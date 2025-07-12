import { Router } from "express";
import { authcheck } from "../middlewares/auth.middleware";
import { createQuestion } from "../controllers/Question.controller";
import { admin_delete, downvoteAnswer, getQuestionWithAnswers, notification, read_notification, submitAnswer, upvoteAnswer } from "../controllers/Answer.controller";
const Answer_Router=Router();
Answer_Router.get("/get/:questionid",getQuestionWithAnswers);
Answer_Router.post("/submit/:questionid",authcheck,submitAnswer)
Answer_Router.post("/upvote",authcheck,upvoteAnswer)
Answer_Router.post("/downvote",authcheck,downvoteAnswer)
Answer_Router.get("/notifications",authcheck,notification);
Answer_Router.delete("/delete",authcheck,admin_delete);
Answer_Router.post("/notification",authcheck,read_notification);
export default Answer_Router;