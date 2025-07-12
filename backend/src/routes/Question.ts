import { Router } from "express";
import { authcheck } from "../middlewares/auth.middleware";
import { createQuestion, downvoteQuestion, getAllQuestions, getFilteredQuestions, searchQuestions, upvoteQuestion } from "../controllers/Question.controller";
const Question_Router=Router();
Question_Router.get("/get",getAllQuestions);
Question_Router.get("/filter/:filter",getFilteredQuestions)
Question_Router.post("/search",searchQuestions);
Question_Router.post("/create",authcheck,createQuestion)
Question_Router.post("/upvote/:questionid",authcheck,upvoteQuestion)
Question_Router.post("/downvote/:questionid",authcheck,downvoteQuestion)
export default Question_Router;