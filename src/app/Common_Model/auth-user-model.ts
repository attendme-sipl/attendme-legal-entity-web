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

    erroHandler(errorStatus: number): string{
    
        try {
         switch(errorStatus){
             case 401: return "Access denied"
         }
        } catch (error) {
            
        }

    }
}
