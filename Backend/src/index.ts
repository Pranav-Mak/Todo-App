import express, {Request, Response} from 'express';
import userRouter from './Routes/user';
import todoRouter from './Routes/todo';

const app = express();

app.use(express.json());
app.use('/user',userRouter);
app.use('/todo',todoRouter);

const port: number = 3000;
app.listen(port, function(){
    console.log(`Server is running on ${port}`)
});
