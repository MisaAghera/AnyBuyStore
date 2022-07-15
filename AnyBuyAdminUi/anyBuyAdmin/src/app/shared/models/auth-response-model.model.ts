export class AuthResponseModel {
    token: string='';
    refreshtoken?:string;
    userId? : number;
    userName? : string;
    isAuthSuccessful: boolean  = true;
    errorMessage?: string;
    expiration?:any
}
