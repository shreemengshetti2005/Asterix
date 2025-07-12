// import client from "../db/db";
import client from "../db/db";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { responce } from "../helpers/responce";
import { NextFunction, Request,Response } from "express";
import { JWT_SECRET } from "../helpers/dotenv";

const authcheck=(req:Request,res:Response,next:NextFunction)=>{
    try {
       
        
        const jwttoken=req.cookies.jwt_token;
        if (!jwttoken) {
            res.status(401).json(responce({
                status: 401,
                message: "No token provided",
                data: null,
                frontend: "You are unauthorized"
            }));
            return 
        }
         if(!JWT_SECRET){
             throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const decoded = jwt.verify(jwttoken, JWT_SECRET)as JwtPayload;
        if(!decoded.userId){
            return
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
         res.status(500).json(responce({
            status: 500,
            message: "Internal server error",
            data: null,
            frontend: "Something went wrong try again"
        }));
        return
    }
}

export {authcheck}