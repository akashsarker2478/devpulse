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

const getAllIssueFromDB = async(query:{sort?:string,type?:string,status?:string})=>{
    const {sort = "newest",type,status} = query;

    let queryText = `SELECT * FROM issues`;
 if(type){
        queryText += ` WHERE type = '${type}'`;
    }

    if(status){
       queryText += type ? ` AND status = '${status}'` : ` WHERE status = '${status}'`;
    }

    if(sort === 'oldest'){
        queryText += ` ORDER BY created_at ASC;`
    }else{
          queryText += ` ORDER BY created_at DESC;`
    }

    const issueResult = await pool.query(queryText);
    const issues = issueResult.rows;

    const issuesWithReporters = [];

    for(const issue of issues){
        const reporterResult = await pool.query(`
            SELECT name,role FROM users WHERE id = $1
            `,[issue.reporter_id]);

            const reporter = reporterResult.rows[0];

            const issueWithReporterData = {
                ...issue,reporter: reporter? {name:reporter.name,role:reporter.role}: null
            } 
            issuesWithReporters.push(issueWithReporterData)
    }
    return issuesWithReporters;

    

    
}

export const issueService = {
    createIssueIntoDB,
    getAllIssueFromDB
}