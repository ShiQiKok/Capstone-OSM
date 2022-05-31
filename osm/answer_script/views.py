import csv
import shutil
import uuid
import zipfile
from itertools import islice
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import status
from rest_framework.authentication import (
    BasicAuthentication, SessionAuthentication)
from rest_framework.decorators import (
    api_view, authentication_classes, permission_classes)
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import AnswerScript, ScriptStatus
from assessment.models import Assessment
from .serializers import AnswerScriptSerializer

# ViewSets define the view behavior.
# To easily create a answer script in back end


class AnswerScriptViewSet(ViewSet):
    serializer_class = AnswerScriptSerializer

    def list(self, request):
        return Response("GET API")

    def create(self, request):
        serializer = AnswerScriptSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


# CRUD actions for front end
@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def overview(request):
    api_urls = {
        'getAll': 'answers/',
        'get': 'answer-details/',
        'create': 'answer-create/',
        'update': 'answer-update/',
        'delete': 'answer-delete/',
        'bulkCreate': 'answer-bulk-create/'
    }

    return Response(api_urls)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def answers(request, assessment_id):
    answers = AnswerScript.objects.filter(assessment_id=assessment_id)
    serializer = AnswerScriptSerializer(answers, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def answer_details(request, id):
    answer = AnswerScript.objects.get(id=id)
    serializer = AnswerScriptSerializer(answer, many=False)

    return Response(serializer.data)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_answer(request):
    serializer = AnswerScriptSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_answer(request, id):
    answer = AnswerScript.objects.get(id=id)
    assessment = Assessment.objects.get(id=answer.assessment.id)

    if (assessment.type == 'essay_based'):
        request.data['script'] = answer.script

    try:
        # update adobe pdf
        answer.script.save(request.FILES['file'].name, request.FILES['file'])
    except:
        pass

    serializer = AnswerScriptSerializer(instance=answer, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_answer(request, id):
    answer = AnswerScript.objects.get(id=id)
    answer.delete()

    return Response("AnswerScript successfully deleted")


# TODO: error handling for unsupported file name
@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def bulk_create(request):

    def process_csv_file(file):
        unformatted_content = file.read().decode("utf-8")
        col_num = len(unformatted_content.split("\n")[0].split(","))
        cell = unformatted_content.split(',')
        num = col_num - (len(cell) % col_num) + 1  # include header
        content = []
        index = 0

        while index < num:
            if index == 0:
                content.extend(
                    cell[index * col_num: (index + 1) * (col_num - 1)])
            else:
                content.extend(
                    cell[index * (col_num - 1) + 1: (index + 1) * (col_num - 1)])

            if index != num - 1:
                temp = cell[(index + 1) * (col_num - 1)]

                if temp.count('\n') > 1:
                    last_occurrence = temp.rfind('\n')
                    d1, d2 = temp[:last_occurrence], temp[last_occurrence + 1:]
                else:
                    d1, d2 = cell[(index + 1) * (col_num - 1)].split('\n')

                content.extend([d1, d2])

            else:
                content.extend(cell[(index + 1) * (col_num - 1):])

            index += 1

        def split_list(data, num): return [
            data[i: i + num] for i in range(0, len(data), num)]
        content = split_list(content, col_num)

        return content

    def process_csv_content(content, assessment_id):
        assessment = Assessment.objects.get(id=assessment_id)
        markers = assessment.markers.all()
        record = []
        header = [h.replace('"', '') for h in content[0]]
        content = content[1:]

        # format
        for row in content:
            data = {}
            for col in range(len(header)):
                data[header[col]] = row[col].replace('"', '')
            record.append(data)

        answers = []

        for row in record:
            question_keys = list(filter(lambda k: 'Response' in k, row.keys()))

            answer_list = []
            for k in question_keys:
                answer_list.append({
                    "answer": row[k]
                })

            temp = [{"marksAwarded": None} for i in range(len(question_keys))]
            marks = [{"markerId": marker.id, "totalMark": 0, "distribution": temp} for marker in markers]
            status = [{"marker": marker.id, "status": "Not Started"} for marker in markers]

            answers.append({
                "student_name": row['\ufeffSurname'] + ' ' + row['First name'],
                "student_id": row['Email address'],
                "status": status,
                "marks": marks,
                "answers": answer_list,
                "assessment": assessment_id,
                "script": None
            })

        return answers

    file = request.FILES['file']
    assessment_id = request.data['assessmentId']
    file_name = file.name
    content_type = file.content_type

    # when the uploaded file is PDF
    if content_type == 'application/pdf':
        assessment = Assessment.objects.get(id=assessment_id)
        criteria_num = len(assessment.rubrics['criterion'])
        data = process_data(file_name, assessment_id, file, criteria_num)

        create_request = request._request
        create_request.POST = data
        return create_answer(create_request)

    elif content_type == 'text/csv':
        lines = process_csv_file(file)
        data = process_csv_content(lines, assessment_id)

        for d in data:
            create_request = request._request
            create_request.POST = d
            response = create_answer(create_request)
            print(response.data)

        return Response("CSV file uploaded")

    # when it's bulk upload file (zip)
    elif content_type == 'application/zip':
        zip_file = zipfile.ZipFile(file)

        zip_file.extractall()

        # get all files except the self directory
        for path in zip_file.namelist():
            folder_name, filename = path.split('/')
            zip_ext_file = zip_file.open(path)
            in_memory_file = InMemoryUploadedFile(
                zip_ext_file, None, path, 'application/pdf', len(zip_file.read(path)), None)
            assessment = Assessment.objects.get(id=assessment_id)
            criteria_num = len(assessment.rubrics['criterion'])
            data = process_data(folder_name, assessment_id,
                                in_memory_file, criteria_num)

            create_request = request._request
            create_request.POST = data
            print(create_answer(create_request).data)

            # remove the locally extracted files
            file_path = settings.BASE_DIR / folder_name
            shutil.rmtree(file_path)

        # close the zip_file
        zip_file.close()
        return Response("Bulk upload successful!")

    return Response({"error": "File extension does not match."}, status=status.HTTP_400_BAD_REQUEST)


# TODO: change student ID
# process PDF file's data
def process_data(folder_name, assessment_id, file, criteria_num):
    [student_name, student_id] = folder_name.split('_')[0:2]
    assessment = Assessment.objects.get(id=assessment_id)
    markers = assessment.markers.all()
    temp = [{"marksAwarded": None} for i in range(criteria_num)]
    marks = [{"markerId": marker.id, "totalMark": 0, "distribution": temp} for marker in markers]
    status = [{"marker": marker.id, "status": "Not Started"} for marker in markers]

    return {
        "student_name": student_name,
        "student_id": student_id,
        "marks": marks,
        "answers": None,
        "status": status,
        "assessment": assessment_id,
        "script": file
    }
