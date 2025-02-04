import {Router, Request, Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from "cors";
import {PrismaClient} from '@prisma/client'
import * as dotenv from 'dotenv';


dotenv.config();
const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET: string | undefined = process.env.JWT_SECRET
if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined!');
    process.exit(1); // Exit the application if JWT_SECRET is not found
}

router.use(cookieParser())
router.use(cors({
    credentials: true,
    origin: [ "http://localhost:5500"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))


function userMiddleware(req: Request, res: Response, next:NextFunction): void {
    console.log('Cookies received by backend:', req.cookies);
    const token = req.cookies.token;
    console.log('Token from cookies:', token);
    if(!token){
         console.error("No token found in cookies");
         res.status(400).json({ error: 'Access Denied1' });
         return
    }
    if(!JWT_SECRET){
         console.error("JWT_SECRET is not defined");
         res.status(400).json({ error: 'Access Denied2' });
         return
    }
    jwt.verify(token,JWT_SECRET, function(err: Error | null, user: any){
        if(err){
            console.error('Token verification failed:', err);
            res.status(400).json({ error: "Access Denied3" });
        }
        req.body.user = user;
        next();
    })
}

router.post('/', userMiddleware, async function(req, res){
    console.log('Received request body:', req.body); 
    const {title, description} = req.body;
    const userId= req.body.user.userId 
    try{
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                userId:parseInt(userId)
            }
        })
        res.status(200).json(todo)
    }catch(e){
        console.error("Error:", e);
        res.status(500).json("Error creating todo")
    }
})

router.put('/', userMiddleware, async function(req, res){
    const {id,title, description} = req.body;
    const userId= req.body.user.userId 
    try{
        const todo = await prisma.todo.update({
            where: {
                id:parseInt(id)
            },
            data:{
                title,
                description,
                userId:parseInt(userId)
            }
        })
        res.status(200).json(todo)
    }catch(e){
        console.error("Error updating todo:", e);
        res.status(500).json("Error creating todo")
    }
})

router.get('/id', async function(req,res){
    const {id} = req.body;
    const userId= req.body.user.userId 
    try{
        const todo = await prisma.todo.findFirst({
            where: {
                id
            }
        });
        res.status(200).json(todo)
    }catch(e){
        res.status(500).json("Error fetching todo")
    }
})
router.get('/bulk', async function(req,res){
    try{
        const todo = await prisma.todo.findMany();
        res.status(200).json(todo)
    }catch(e){
        res.status(500).json("Error fetching todo")
    }
})

router.delete('/:id', userMiddleware, async function(req, res) {
    const { id } = req.params;  // Get the todo id from the URL parameter
    const userId = req.body.user.userId;  // Assuming you have userId available via middleware
    try {
        const todo = await prisma.todo.findFirst({
            where: {
                id: parseInt(id),
            }
        });
        if (!todo) {
             res.status(404).json({ error: "Todo not found" });
             return
        }
        if (todo.userId !== parseInt(userId)) {
             res.status(403).json({ error: "You are not authorized to delete this todo" });
             return
        }

        await prisma.todo.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (e) {
        console.error("Error deleting todo:", e);
        res.status(500).json({ error: "Error deleting todo" });
    }
});


export default router;
