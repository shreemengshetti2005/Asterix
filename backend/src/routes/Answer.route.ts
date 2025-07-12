import { Router } from "express";
import { authcheck } from "../middlewares/auth.middleware";
import { createQuestion } from "../controllers/Question.controller";
import { admin_delete, comment, downvoteAnswer, getQuestionWithAnswers, notification, read_notification, recieve_comment, submitAnswer, upvoteAnswer } from "../controllers/Answer.controller";
const Answer_Router=Router();
Answer_Router.get("/get/:questionid",getQuestionWithAnswers);
Answer_Router.post("/submit/:questionid",authcheck,submitAnswer)
Answer_Router.post("/upvote",authcheck,upvoteAnswer)
Answer_Router.post("/downvote",authcheck,downvoteAnswer)
Answer_Router.get("/notifications",authcheck,notification);
Answer_Router.post("/notification",authcheck,read_notification);
Answer_Router.post("/delete",authcheck,admin_delete);
Answer_Router.post("/comment",authcheck,comment)
Answer_Router.post("/comments",authcheck,recieve_comment)
export default Answer_Router;