// crete a class User with the fields in Django UserModel
export class User {
    id?: number | undefined;
    uuid?: string | undefined;
    username: string | undefined;;
    password: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    is_staff?: boolean | undefined;
    is_active?: boolean | undefined;
    is_superuser?: boolean | undefined;
    last_login?: Date | undefined;
    date_joined?: Date | undefined;
    updated_at?: Date | undefined;
    groups?: any[] | undefined;
    user_permissions?: any[] | undefined;
    token?: any | undefined;
}

export class UserCollabInfo {
    id!: number;
    username!: string;
    email!: string;
}