
import express, { type Application, type Request, type Response } from 'express';
import {Pool} from "pg"
import dotenv from "dotenv"

dotenv.config();
const app :Application = express()

const port =process.env.PORT|| 5000;

app.use(express.json())

const pool =  new Pool({

    connectionString:process.env.DB_URL
})

const initDB = async()=>{
    try {
        await pool.query(`
        
        CREATE TABLE IF NOT EXISTS users(
            
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'contributor',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        
        )
        
        `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'open',
          reporter_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Database connected successfully!!")

    } catch (error) {
        console.log(error)
    }
}
initDB()

app.get('/', (req :Request, res:Response) => {
  res.status(200).json({
    message:"express server",
    "author":"akash sarker"
  })
})

app.listen(port, () => {
  console.log(`devpulse running on port ${port}`)
})