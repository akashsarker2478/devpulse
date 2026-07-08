import express, { type Application, type Request, type Response } from 'express';

const app :Application = express()

//middleware
app.use(express.json())

app.get('/', (req :Request, res:Response) => {
  res.status(200).json({
    message:"express server",
    "author":"akash sarker"
  })
})

export default app;