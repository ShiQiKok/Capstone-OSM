// crete a class User with the fields in Django UserModel
export class User {
    id!: number;
    uuid!: string;
    username!: string;
    password!: string;
    first_name!: string;
    last_name!: string;
    email!: string;
    is_staff!: boolean;
    is_active!: boolean;
    is_superuser!: boolean;
    last_login!: Date;
    date_joined!: Date;
    updated_at!: Date;
    groups!: any[];
    user_permissions!: any[];
    token!: any;
}