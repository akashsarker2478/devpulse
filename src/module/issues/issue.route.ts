import express from "express";
import { createIssue, getAllIssue } from "./issue.controller";
import userAuth from "../../middleware/auth";

const router = express.Router();
router.post('/create-issue',userAuth("contributor"),createIssue)
router.get('/',getAllIssue)

export const issueRouter= router;
