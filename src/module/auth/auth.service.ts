import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";

const signUpUserIntoDB = async(payload:IUser)=>{

    const {name,email,password,role} = payload;

    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(password as string,saltRound);

    const result = await pool.query(`
        
        INSERT INTO users (name,email,password,role) 
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at;
        `,[name,email,hashedPassword,role || 'contributor']);

        return result.rows[0]

}
 export const authService = {
    signUpUserIntoDB
 }