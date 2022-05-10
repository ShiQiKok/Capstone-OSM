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

    renderer_classes = [PandasExcelRenderer]
