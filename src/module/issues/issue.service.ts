import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async(payload:IIssue)=>{
    const {title, description, type, reporter_id} = payload;

    const result = await pool.query(`
        
            INSERT INTO issues(title, description, type, reporter_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, description, type, status, reporter_id, created_at;
        
        `,[title, description, type, reporter_id])

        return result.rows[0]
}

export const issueService = {
    createIssueIntoDB
}