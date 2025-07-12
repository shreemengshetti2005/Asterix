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


 const createQuestionSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .max(5000, 'Content cannot exceed 5000 characters'),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .min(1, 'At least one tag is required')
    .max(5, 'You can add at most 5 tags')
})


  export{signininteface,signupinteface,createQuestionSchema}