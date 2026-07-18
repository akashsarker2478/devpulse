import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { CustomRequest } from "../../middleware/auth";
import { unlink } from "fs";

export const createIssue = async(req:CustomRequest,res:Response)=>{
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

export const getAllIssue = async(req : Request,res:Response)=>{

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

