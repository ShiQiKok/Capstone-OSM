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
        # get the total number of collaborators for this assessment
        collaborators_num = len(marks_json_list[0])

         # exclude the "marks" column
        df = df.loc[:, df.columns != 'marks']

        marks = {}
        for l in marks_json_list:
            for obj in l:
                if obj['markerId'] not in marks.keys():
                    marks[obj['markerId']] = [obj['totalMark']]
                else:
                    marks[obj['markerId']].append(obj['totalMark'])


        for marker_id, value in marks.items():
            df[f"Marker_{marker_id}"] = value

        return df

    renderer_classes = [PandasExcelRenderer]
