import {Router, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from "cors";
import {PrismaClient} from '@prisma/client'

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET: string | undefined = process.env.JWT_SECRET

router.use(cookieParser());
router.use(cors({
    credentials: true,
    origin: ["http://localhost:5500"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

router.post('/signup', async function(req,res){
    const { username,password,firstname,lastname} = req.body;
    try{
    const user = await prisma.user.create({
        data:{
            username,
            password,
            firstname,
            lastname
        }
    });
    res.status(200).json(user)
    }catch(e){
        console.error("Error:", e);
        res.status(500).json({ error: "Error Creating Profile" });
    }
})

router.post('/sigin', async function(req,res){
    const { username,password} = req.body;
    try{
    const user = await prisma.user.findFirst({
        where:{
            username,
            password
        }
    });
    if(!user){
        res.status(500).send("Invalid Username/Password");
        return;
    }

    if(!JWT_SECRET){
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    const token = jwt.sign ({userId: user.id}, JWT_SECRET)
    res.cookie("token",token, {
        httpOnly: true,  // Ensure JavaScript on the frontend cannot access the cookie (security)
    // Set to true only if you're using HTTPS
        //sameSite: 'Strict',  // Restricts cross-site requests with the cookie
    });
    res.json({ message: "Logged in successfully", token })
    }catch(e){
    res.status(500).json({ error: "Error Signing In" });
    }
});

/*router.post('/logout', async function(req, res){
    res.clearCookie("token");
    res.json({
        message: "Logged Out"
    })
})*/

export default router;