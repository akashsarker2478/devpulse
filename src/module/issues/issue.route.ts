import express from "express";

import userAuth from "../../middleware/auth";
import { issueController } from "./issue.controller";


const router = express.Router();
router.post('/create-issue',userAuth("contributor"),issueController.createIssue)
router.get('/',issueController.getAllIssue)
router.patch('/:id',userAuth("maintainer", "contributor"),issueController.updateIssue)
router.delete("/:id", userAuth("maintainer"), issueController.deleteIssue);

export const issueRouter= router;
