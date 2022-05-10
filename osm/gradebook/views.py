from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from openpyxl import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from wsgiref.util import FileWrapper
from django.http import HttpResponse

@api_view(['GET'])
@authentication_classes([JWTAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def download_gradebook(request):
    workbook = Workbook()
    sheet = workbook.active

    response = HttpResponse(save_virtual_workbook(workbook), content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="%s"' % 'testing.xlsx'

    return response


