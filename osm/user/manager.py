from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **data):
        """
        Create and save a User with the given email and password.
        """
        groups = []
        user_permissions = []

        KEYS = data.keys()

        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)

        if 'user_permissions' in KEYS:
            user_permissions = data['user_permissions']
            del data['user_permissions']

        if 'groups' in KEYS:
            groups = data['groups']
            del data['groups']

        user = self.model(email=email, **data)
        user.set_password(password)
        user.save()

        # save many-to-many fields
        user.groups.set(groups)
        user.user_permissions.set(user_permissions)

        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)