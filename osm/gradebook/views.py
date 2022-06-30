from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_pandas import PandasView, PandasExcelRenderer
from assessment.models import Assessment
from answer_script.models import AnswerScript
from .serializers import GradebookAnswerScriptSerializer
from user.models import User

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


        for marker_id, value in marks.items():
            user = User.objects.get(id=marker_id)
            df[f"Marks_{user.username}"] = value

        for marker_id, value in comments.items():
            user = User.objects.get(id=marker_id)
            df[f"Comment_{user.username}"] = value

        return df

    renderer_classes = [PandasExcelRenderer]
