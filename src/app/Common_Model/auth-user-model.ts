export class AuthUserModel {
    passwordChange: boolean;
    token: string;
    sessionToken:string;
    expiresAt: string;
    userNotFound:boolean;
    userId: number;
    menuDetails: [{
        menuParameterId: number,
        menuName: string,
        ngModelPropName: string,
        menuParameterPath: string
    }]


}
