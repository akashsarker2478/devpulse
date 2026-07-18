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

const updateIssueFromDB = async(id:number,updateData:{title?:string;description?:string;type?:string;status?:string})=>{

    const { title, description, type, status } = updateData;

    const result = await pool.query(`
        
        UPDATE issues
        SET title = COALESCE($1,title),
            description = COALESCE($2, description),
            type = COALESCE($3, type), 
            status = COALESCE($4, status),
            updated_at = NOW()
            WHERE id = $5
            RETURNING * 

        `,[title, description, type, status, id])

        return result.rows[0]
}

const deleteIssueFromDB = async(id:number)=>{
    const result = await pool.query(`
            DELETE from issues 
            WHERE id = $1
            RETURNING*

        `,[id])
        return result.rows[0]
}

export const issueService = {
    createIssueIntoDB,
    getAllIssueFromDB,
    updateIssueFromDB,
    deleteIssueFromDB
}