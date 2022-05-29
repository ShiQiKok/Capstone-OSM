from django.core.exceptions import ValidationError
import re

def validate_password(password):
    upper = re.compile('[A-Z]')
    lower = re.compile('[a-z]')
    num = re.compile('[0-9]')
    special_char = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

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
