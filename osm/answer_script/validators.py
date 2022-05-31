from django.core.exceptions import ValidationError

def validate_answer_script_status(data):
    for status_obj in data:
        keys = status_obj.keys()

        if 'status' not in keys or 'marker' not in keys:
            raise ValidationError(
                'Json object does not match the status pattern!')

        if status_obj['status'] not in ['In Progress', 'Finished', 'Not Started']:
            raise ValidationError('Invalid status!')
