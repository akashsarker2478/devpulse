import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signUpUser = async(req:Request,res:Response)=>{
   try {
    
    const userData = req.body;
    const result = await authService.signUpUserIntoDB(userData)

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });

   } catch (error:unknown) {

    const err = error as {code?:String; message:String}
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
        errors: err.message,
      });
    } else{
        res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
    }
   }
}

const loginUser = async(req:Request,res:Response)=>{
 try {
   const userData = req.body;
   const result = await authService.loginUserFromDB(userData)

   return res.status(200).json({
    success:true,
    message : "Login successful",
    data:{
      token :result.accessToken,
      user:result.user
    }
   });
   

 } catch (error:unknown){
  const err = error as {message:string};
  return res.status(500).json({
    success: false,
      message: "Internal server error",
      errors: err.message,
  })
 }
}

export const authController = {
    signUpUser,
    loginUser
}