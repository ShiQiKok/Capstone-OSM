from django.core.exceptions import ValidationError

def validate_answer_script_status(data):
    for status_obj in data:
        keys = status_obj.keys()

        if 'status' not in keys or 'marker' not in keys:
            raise ValidationError(
                'Json object does not match the status pattern!')

        if status_obj['status'] not in ['In Progress', 'Finished', 'Not Started']:
            raise ValidationError('Invalid status!')

def validate_comment(data):
    for comment_obj in data:
        keys = comment_obj.keys()

        if 'comment' not in keys or 'marker' not in keys:
            raise ValidationError(
                'Json object does not match the status pattern!')

        if (comment_obj['comment'] != None and len(comment_obj['comment']) > 300):
            raise ValidationError('Comment must not exceed 300 characters!')

