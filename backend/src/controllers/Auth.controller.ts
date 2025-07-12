import { signininteface, signupinteface } from "../helpers/Interface"
import { Request,Response } from "express";
import client from "../db/db";
import jwt from 'jsonwebtoken'
import { responce } from "../helpers/responce";
import bcrypt from 'bcrypt'
const JWT_SECRET=process.env.JWT_SECRET || "OUR PROJECT"

export const signup=async(req:Request,res:Response)=>{
    try {
        const Inputdata=signupinteface.parse(req.body);
        const hassedpassword=await bcrypt.hash(Inputdata.password,4)
         if(!JWT_SECRET){
             throw new Error("JWT_SECRET is not defined in environment variables");
        }
      
      const d = await client.user.create({
  data: {
    username: Inputdata.username,
    password: hassedpassword,
    email: Inputdata.email
  }
});

const { password, ...userWithoutPassword } = d;

const wait = jwt.sign({ userId: d.id }, JWT_SECRET);

res.cookie("jwt_token", wait, {
  httpOnly: true,
  secure: true
});

res.json(
  responce({
    status: 200,
    message: "signup complete",
    data: userWithoutPassword,
    frontend: "signup complete"
  })
);
return;

    } catch (error) {
        res.json(responce({status:500,message:"some error",data:"some error",frontend:"signup uncessufll"}))
        return
    }
}



export const login = async (req: Request, res: Response) => {
    try {
        const Inputdata = signininteface.parse(req.body); 

        const user = await client.user.findUnique({
           where:{
            email:Inputdata.email
           }
        });

        if (!user) {
            res.status(401).json(responce({
                status: 401,
                message: "Invalid username or password",
                data: null,
                frontend: "Login failed"
            }));
            return 
        }

        const isPasswordValid = await bcrypt.compare(Inputdata.password, user.password);
        if (!isPasswordValid) {
            res.status(401).json(responce({
                status: 401,
                message: "Invalid username or password",
                data: null,
                frontend: "Login failed"
            }));
            return
        }
        if(!JWT_SECRET){
             throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.cookie("jwt_token", token, {
            httpOnly: true,
            secure: true
        });

        res.json(responce({
            status: 200,
            message: "Login successful",
            data: user,
            frontend: "Login complete"
        }));
        return 
    } catch (error) {
        console.log(error)
        res.status(500).json(responce({
            status: 500,
            message: "Internal server error",
            data: null,
            frontend: "Login failed"
        }));
        return
    }
};




export const logout=async (req:Request,res:Response) => {
    try {
        res.clearCookie("jwt_token")
        res.json(responce({status:200,message:"logout complete",data:"hi",frontend:"logout complete"}))
        return
        
    } catch (error) {
        res.status(500).json(responce({
            status: 500,
            message: "Internal server error",
            data: null,
            frontend: "Login failed"
        }));
        return
    }
}