import { Resend } from "resend";
import { env } from "./env.js";
let resendClient: Resend | null = null;

export default function getResend(){
    if(!resendClient){
        resendClient = new Resend(env.RESEND_API_KEY)
    }
    return resendClient;
}