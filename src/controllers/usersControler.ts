import { Request, Response } from 'express';
import { hashPassword } from '../services/password.service';
import  prisma  from '../models/user';

export const createUser = async (req:Request,res:Response,):Promise<void>=>{
    const {email, password} = req.body;
    try{
        const hashedPassword = await hashPassword(password);
        if(!password) throw new Error('Password is required');
        if(!email) throw new Error('Email is required');
        const user = await prisma.create({
            data:{
                email,
                password: hashedPassword
            }
        })
        res.status(201).json({user})
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

export const getAllUser = async (req:Request,res:Response,):Promise<void>=>{
    try{
        const user = await prisma.findMany()
        res.status(200).json(user);
    }catch(err: any){
        res.status(500).json({error:'Internal server error'})
    }
}

export const getUserByID = async (req:Request,res:Response,):Promise<void>=>{
    const userID = parseInt(req.params.id)
    try{
        const user = await prisma.findUnique({
            where:{
                id: userID
            }
        })
        if(!user){
            res.status(404).json({error:'User dosent exist'})
            return
        };
        res.status(200).json(user);
    }catch(err: any){
        res.status(500).json({error:'Internal server error'})
    }
}

export const updateUsaer = async (req:Request,res:Response,):Promise<void>=>{
    const userID = parseInt(req.params.id)
    const { email,password } = req.body;
    try{
        let dataUpdate: any = {...req.body}
        if(password){
            const hashedPassword = await hashPassword(password)
            dataUpdate.password = hashedPassword
        }
        if(email){
            dataUpdate.email = email
        }
        const user = await prisma.update({
            where:{
                id: userID
            },
            data: dataUpdate
        })
        res.status(200).json(user);
    }catch(err: any){
        if(err?.code === 'p2002' && err?.meta?.target?.includes('email')){
            res.status(400).json({error: 'Emael does exist'})
        }
        else if(err?.code === 'p2025'){
            res.status(400).json({error:'User Doest exist'})
        }
        res.status(500).json({error:'Internal server error'})
    }
}

export const deleteUser = async (req:Request,res:Response,):Promise<void>=>{
    const userID = parseInt(req.params.id)
    try{
        await prisma.delete({
            where:{
                id: userID
            }
        })
        res.status(200).json({message:'User Deleted'}).end()
    }catch(err:any){
        if(err?.code === 'p2002' && err?.meta?.target?.includes('email')){
            res.status(400).json({error: 'Emael does exist'})
        }
        else if(err?.code === 'p2025'){
            res.status(400).json({error:'User Doest exist'})
        }
        res.status(500).json({error:'Internal server error'})
    }
}