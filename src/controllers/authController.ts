import { promises } from 'dns';
import {Request, Response} from 'express';  
import { comparePassword, hashPassword } from '../services/password.service';
import  prisma  from '../models/user';
import { generateToken } from '../services/auth.services';

export const register = async(req: Request ,res: Response): Promise<void> =>{
    const {email, password} = req.body;
    try{
        if(!password) throw new Error('Password is required');
        if(!email) throw new Error('Email is required');
        const hashedPassword = await hashPassword(password);
        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        }); 
        const token = generateToken(user);
        res.status(201).json({token});
    }catch(error:any){
        if(email === undefined || password === undefined){
            res.status(400).json({message: 'Email and password are required'});
            return;
        }
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({message: 'Email already exists'});
            return;
        }
        res.status(500).json({message: 'Internal server error'});
    } 
}

export const login = async (req: Request , res: Response): Promise<void> =>{
    const { email, password } = req.body;
    try{
        const user = await prisma.findUnique({ where: { email } });
        if(!user) throw new Error('User not found');
        const passswordMatch = await comparePassword(password, user.password);
        if(!passswordMatch) throw new Error('Invalid password');
        const token = generateToken(user);
        res.status(200).json({token});
    }catch(err:any){
        res.status(401).json({message: err.message});
    }
}