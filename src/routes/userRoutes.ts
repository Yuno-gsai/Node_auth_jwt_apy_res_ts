import express, { NextFunction,Request,Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUser, getUserByID, updateUsaer } from '../controllers/usersControler';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const router = express.Router();

const authenticationToken = (req: Request, res: Response, next: NextFunction ): void =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return; 
    }
    jwt.verify(token, JWT_SECRET, (err,decode)=>{
        if(err) return res.status(403).json({error:'Invalid token'});
        next();
        })
};


router.post('/',authenticationToken,createUser);
router.get('/',authenticationToken,getAllUser);
router.get('/:id',authenticationToken,getUserByID);
router.put('/:id',authenticationToken,updateUsaer);
router.delete('/:id',authenticationToken,deleteUser);

export default router;  


