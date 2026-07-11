import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.post("/signUp",authController.signUpUser)
router.post("/signIn",authController.loginUser)

export const authRoute = router;