import bcrypt from "bcryptjs";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";
import jwt from "jsonwebtoken"
import config from "../../config";

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

const loginUserFromDB =async(payload:{email:string, password:string})=>{
    const {email,password} = payload;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    const user = result.rows[0];

    if(!user){
        throw new Error("User not found with this email!")
    }

    const matchPassword = await bcrypt.compare(password,user.password);
    if(!matchPassword){
    throw new Error("invalid credential")
}

    const jwtPayload = {
        id:user.id,
        name:user.name,
        role:user.role
    }

    const accessToken = jwt.sign(jwtPayload,config.jwtSecret,
        {expiresIn:"1d"})

    const {password:_,...userWithoutPassword} = user;

        return{
            accessToken,
            user:userWithoutPassword
        }
};


 export const authService = {
    signUpUserIntoDB,
    loginUserFromDB
 }