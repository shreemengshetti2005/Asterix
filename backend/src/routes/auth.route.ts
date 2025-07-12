import { Router } from "express";

import { login,logout,signup } from "../controllers/Auth.controller";
const authRoute=Router();
authRoute.post("/signup",signup)
authRoute.post("/login",login)
authRoute.get("/logout",logout)


export default authRoute;