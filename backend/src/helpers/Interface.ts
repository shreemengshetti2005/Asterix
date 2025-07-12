import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      html?:string;
      photoVar?:number;
    }
  }
}
const signupinteface = z.object({
  username: z.string(),
  password:z.string(),
  email:z.string().email()
});
const signininteface = z.object({
    
    password:z.string(),
  //  username:z.string(),
   email:z.string(),
  });

  export{signininteface,signupinteface}