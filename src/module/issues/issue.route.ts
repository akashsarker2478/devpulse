import express from "express";
import { createIssue } from "./issue.controller";
import userAuth from "../../middleware/auth";

const router = express.Router();
router.post('/create-issue',userAuth("contributor"),createIssue)

export const issueRouter= router;
