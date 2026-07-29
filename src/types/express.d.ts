export interface ReqUser{
    id: string;
    email: string;
}

declare global{
    namespace Express{
        interface Request{
            user?: ReqUser
        }
    } 
}
