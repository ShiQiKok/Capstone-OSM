from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AssessmentSerializer
from .models import Assessment
import xml.etree.ElementTree as ET
import pandas as pd
import re


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def overview(request):
    api_urls = {
        'getAll': 'assessments/',
        'get': 'assessment-details/',
        'create': 'assessment-create/',
        'update': 'assessment-update/',
        'delete': 'assessment-delete/',
        'uploadRubrics': 'rubrics-upload/',
        'uploadQuestions': 'questions-upload/',
    }

    return Response(api_urls)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def assessments(request, user_id):
    assessments = Assessment.objects.filter(markers=user_id).order_by('id')
    serializer = AssessmentSerializer(assessments, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def assessment_details(request, id):
    assessment = Assessment.objects.get(id=id)
    serializer = AssessmentSerializer(assessment, many=False)

    return Response(serializer.data)


@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def create_assessment(request):
    serializer = AssessmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def update_assessment(request, id):
    assessment = Assessment.objects.get(id=id)
    serializer = AssessmentSerializer(instance=assessment, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def delete_assessment(request, id):
    assessment = Assessment.objects.get(id=id)
    assessment.delete()

    return Response("Assessment successfully deleted")


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def upload_rubrics(request):
    file = request.FILES['file']
    file_name = file.name
    content_type = file.content_type

    if content_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        try:
            df = pd.read_excel(file)
            df = df.fillna('')
            marksRange = [c for c in df.columns if re.match(
                r"[0-9]?[0-9]-[0-9]?[0-9]", c)]
            criteria = []

            for i in range(len(df)):
                columns = [{"description": df.iloc[i][r]} for r in marksRange]
                obj = {
                    "title": df.iloc[i]["Criteria"],
                    "description": df.iloc[i]["Description"],
                    "totalMarks": df.iloc[i]["Total"],
                    "columns": columns
                }
                criteria.append(obj)

            # to process keys
            for i in range(len(marksRange)):
                min_range, max_range = marksRange[i].replace(
                    ' ', '').split('-')
                obj = {
                    "min": min_range,
                    "max": max_range
                }
                marksRange[i] = obj

            rubrics = {
                "marksRange": marksRange,
                "criterion": criteria
            }
            return Response(rubrics)
        except:
            return Response("Make sure the template uploaded follows the template rules.", status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response("The file must be a .xlsx file", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def upload_questions(request):
    file = request.FILES['file']
    file_name = file.name
    content_type = file.content_type

    if content_type == 'text/xml':
        tree = ET.parse(file)
        root = tree.getroot()
        questions = root.findall('question')

        question_obj = []

        for question in questions:
            if type(question.find('questiontext')) != type(None):
                unformatted = question.find('questiontext').find('text').text
                text = re.search(r'<p(.*?)>(.*?)</p>', unformatted).group(2)

                if type(question.find('defaultgrade')) != type(None):
                    marks = int(float(question.find('defaultgrade').text))

                    obj = {
                        "no": len(question_obj) + 1,
                        "value": {
                            "question": text,
                            "marks": marks
                        }
                    }
                    question_obj.append(obj)

        return Response(question_obj)

    elif content_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        df = pd.read_excel(file)

        questions = []

        for i in range(len(df)):
            obj = {
                "no": df.loc[i]['Question'],
                "value": {
                    "question": df.loc[i]['Description'],
                    "marks": df.loc[i]['Total']
                }
            }
            questions.append(obj)

        return Response(questions)

    return Response("The file must be either a .xlsx or .xml file", status=status.HTTP_400_BAD_REQUEST)
