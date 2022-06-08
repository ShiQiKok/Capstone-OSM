from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_pandas import PandasView, PandasExcelRenderer
from assessment.models import Assessment
from answer_script.models import AnswerScript
from .serializers import GradebookAnswerScriptSerializer

class GradebookView(PandasView):
    queryset = AnswerScript.objects.all()
    serializer_class = GradebookAnswerScriptSerializer

    def filter_queryset(self, qs):
        return qs.filter(assessment_id=self.kwargs['assessment_id'])

    def transform_dataframe(self, df):

        marks_json_list = df.loc[:, "marks"].to_list()
        comment_json_list = df.loc[:, "comment"].to_list()
        # get the total number of collaborators for this assessment

         # exclude the "marks" and "comment" column
        df = df.loc[:, df.columns != 'marks']
        df = df.loc[:, df.columns != 'comment']

        marks = {}
        comments = {}
        for i in range(len(marks_json_list)):
            for j in range(len(marks_json_list[i])):
                if marks_json_list[i][j]['markerId'] not in marks.keys():
                    marks[ marks_json_list[i][j]['markerId']] = [marks_json_list[i][j]['totalMark']]
                else:
                    marks[ marks_json_list[i][j]['markerId']].append(marks_json_list[i][j]['totalMark'])

                if comment_json_list[i][j]['marker'] not in comments.keys():
                    comments[ comment_json_list[i][j]['marker']] = [comment_json_list[i][j]['comment']]
                else:
                    comments[ comment_json_list[i][j]['marker']].append(comment_json_list[i][j]['comment'])

        # # print(marks_json_list)
        # for l in marks_json_list:
        #     for obj in l:
        #         if obj['markerId'] not in marks.keys():
        #             marks[obj['markerId']] = [obj['totalMark']]
        #         else:
        #             marks[obj['markerId']].append(obj['totalMark'])


        for marker_id, value in marks.items():
            df[f"Marker_{marker_id}"] = value

        for marker_id, value in comments.items():
            df[f"Comment_{marker_id}"] = value

        return df

    renderer_classes = [PandasExcelRenderer]
