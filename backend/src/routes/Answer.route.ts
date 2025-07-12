import { Router } from "express";
import { authcheck } from "../middlewares/auth.middleware";
import { createQuestion } from "../controllers/Question.controller";
import { downvoteAnswer, getQuestionWithAnswers, submitAnswer, upvoteAnswer } from "../controllers/Answer.controller";
const Answer_Router=Router();
Answer_Router.get("/get/:questionid",getQuestionWithAnswers);
Answer_Router.post("/submit/:questionid",authcheck,submitAnswer)
Answer_Router.post("/upvote",authcheck,upvoteAnswer)
Answer_Router.post("/downvote",authcheck,downvoteAnswer)
export default Answer_Router;