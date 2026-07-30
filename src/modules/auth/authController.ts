import { authService } from "./authService.js";
import { RegistrationSchema, LoginSchema } from "./authSchema.js";
import z from 'zod'

export async function Register(input: unknown){
    const parsed = RegistrationSchema.safeParse(input);
    if(!parsed.success) return {error: z.treeifyError(parsed.error)}

    try{
        const user = await authService.register(parsed.data)
        return { data: {id: user.id, email: user.email, name: user.name}}
    }catch(err){
        if(err instanceof Error) return {error: err.message}
        return {error: 'Registration failure'}
    }
}

export async function Login(input: unknown){
    const parsed = LoginSchema.safeParse(input);
    if(!parsed.success) return {error: z.treeifyError(parsed.error)}

    try{
        const token = await authService.login(parsed.data);
        return {data:token};
    }catch(err){
        if(err instanceof Error) return { error: err.message}
        return {error: 'Login failure'}
    }
}

export async function VerifyEmail(userEmail: string){
    try{
        const user = await authService.verifyEmail(userEmail);
        return { data: {id: user.id, email: user.email, name: user.name}}
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Failed to verify email.'}
    }
}

export async function ConfirmEmail(userEmail: string, token: string){
    try{
        const user = await authService.confirmedEmail(userEmail, token);
        return { data: {id: user.id, email: user.email, name: user.name}}
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Failed to verify email.'}
    }
}