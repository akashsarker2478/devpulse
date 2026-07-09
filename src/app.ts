import express, { type Application, type Request, type Response } from 'express';
import { authRoute } from './module/auth/auth.route';

const app :Application = express()

//middleware
app.use(express.json());
app.use('/api/auth',authRoute)

app.get('/', (req :Request, res:Response) => {
  res.status(200).json({
    message:"express server",
    "author":"akash sarker"
  })
})

export default app;