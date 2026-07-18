import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { CustomRequest } from "../../middleware/auth";
import { unlink } from "fs";
import { pool } from "../../db";

 const createIssue = async(req:CustomRequest,res:Response)=>{
    try {
        const {title, description, type} = req.body;
        const loggedInUser = req.user;
        if (!loggedInUser) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: "User data missing from request"
      });
      return;
    }

        const issueData = {
            title,description,type,reporter_id:loggedInUser.id
        };

        const result = await issueService.createIssueIntoDB(issueData)

        res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
    } catch (error:unknown) {
        const err = error as { message: string };
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
    }
}

 const getAllIssue = async(req : Request,res:Response)=>{

    try {
      const query = req.query;
      const result = await issueService.getAllIssueFromDB(query)

      res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            data: result,
      })
    } catch (error :unknown) {
      const err = error as {message:string};
      res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message,
        });
    }
}

const updateIssue = async(req:CustomRequest,res:Response)=>{
 try {
   const {id} = req.params;
  const updateData = req.body;
  const loggedInUser = req.user;
  
  if(!loggedInUser){
    return res.status(401).json({
      success:false,
      message:"unauthorized",
      errors: "User data missing from request"
    })
  }

  const checkIssue = await pool.query(`
    
    SELECT * FROM issues WHERE id = $1

    `,[Number(id)]);

    const currentIssue = checkIssue.rows[0];
    if(!currentIssue){
      return res.status(404).json({
        success: false,
        message: "Issue not found!",
      });
    }

    if(loggedInUser.role === 'contributor'){
      if(currentIssue.reported_id !== loggedInUser.id){
        return res.status(403).json({
          success: false,
          message: "Forbidden",
          errors: "You can only update your own issues."
        });
      }

      if(currentIssue.status !== 'open'){
        return res.status(403).json({
          success: false,
          message: "Forbidden",
          errors: "You can only update issues when the status is open."
        });
      }
    }else if (loggedInUser.role !== 'maintainer') {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "You do not have permission to update this issue."
      });
    }

  const result = await issueService.updateIssueFromDB(Number(id),updateData)
        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
 } catch (error:unknown) {

  const err = error as {message:string}
  res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: err.message,
        });
  
 }
}

const deleteIssue = async(req:CustomRequest,res:Response)=>{
  try {
    const {id} = req.params;
    const loggedInUser = req.user;
    if(!loggedInUser){
      return res.status(401).json({
      success:false,
      message:"unauthorized",
      errors: "User data missing from request"
    })
    }

    if(loggedInUser.role !=="maintainer"){
      return res.status(403).json({
        success: false,
        message: "Forbidden",
        errors: "Access denied. Only maintainers can delete issues."
      });
    }
    const result = await issueService.deleteIssueFromDB(Number(id));
    if (!result) {
            return res.status(404).json({
                success: false,
                message: "Issue not found!",
            });
        }
        res.status(200).json({
          success: true,
          message: "Issue deleted successfully"
        })
  } catch (error:unknown) {
    const err = error as {message:string}
    res.status(500).json({
            success: false,
            message: "something went wrong",
            errors: err.message,
       
    })
  }
}

export  const issueController = {
  createIssue,
  getAllIssue,
  updateIssue,
  deleteIssue
}

