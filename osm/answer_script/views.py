from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AnswerScriptSerializer
from .models import AnswerScript
import uuid
import zipfile
from django.core.files.uploadedfile import InMemoryUploadedFile

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
        return Response(serializer.errors)


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_answer(request, id):
    answer = AnswerScript.objects.get(id=id)
    serializer = AnswerScriptSerializer(instance=answer, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


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
    file = request.FILES['file']
    assessment_id = request.data['assessmentId']
    file_name = file.name
    content_type = file.content_type

    ## when this is not bulk create
    if content_type != 'application/zip':
        data = process_data(file_name, assessment_id, file)
        create_request = request._request
        create_request.POST = data
        return create_answer(create_request)

    ## when it's bulk upload file (zip)
    else:
        zip_file = zipfile.ZipFile(file)
        zip_file.extractall()

        # get all files except the self directory
        for filename in zip_file.namelist()[1:]:
            zip_ext_file = zip_file.open(filename)
            in_memory_file = InMemoryUploadedFile(zip_ext_file, None, filename, 'application/pdf', len(zip_file.read(filename)), None)
            filename = filename.split('/')[-1]
            data = process_data(filename, assessment_id, in_memory_file)

            create_request = request._request
            create_request.POST = data
            create_answer(create_request)

        # close the zip_file
        zip_file.close()
        # remove the locally extracted files
        # ! ERROR: remove cannot use
        # remove(file)

        return Response("Bulk upload successfully")

def process_data(filename, assessment_id, file):
    student_fname, student_lname, student_id, _ = filename.split('_')
    student_id = str(uuid.uuid4())
    return {
        "student_name": student_fname + ' ' + student_lname,
        "student_id": student_id,
        "marks": None,
        "answers": None,
        "assessment": assessment_id,
        "script": file
    }