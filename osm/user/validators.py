from django.core.exceptions import ValidationError
import re

upper = re.compile('[A-Z]')
lower = re.compile('[a-z]')
num = re.compile('[0-9]')
special_char = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

def validate_password(password):
    if (len(password) < 8):
        raise ValidationError("Password must be at least 8 characters long.")
    if (upper.search(password) == None):
        raise ValidationError("Password must contain at least one uppercase letter.")
    if (lower.search(password) == None):
        raise ValidationError("Password must contain at least one lowercase letter.")
    if (num.search(password) == None):
        raise ValidationError("Password must contain at least one number.")
    if (special_char.search(password) == None):
        raise ValidationError("Password must contain at least one special character.")

def validate_first_or_last_name(data):
    if (num.search(data)):
        raise ValidationError("Name cannot contain numbers.")
    if (special_char.search(data)):
        raise ValidationError("Name cannot contain special characters.")