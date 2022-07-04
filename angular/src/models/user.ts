// crete a class User with the fields in Django UserModel
export class User {
    id?: number | undefined;
    username: string | undefined;;
    password: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    last_login?: Date | undefined;
    date_joined?: Date | undefined;
    updated_at?: Date | undefined;
    token?: any | undefined;
}

export class UserCollabInfo {
    id!: number;
    username!: string;
    email!: string;
}