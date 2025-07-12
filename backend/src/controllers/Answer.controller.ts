import { Request, Response } from "express";
import client from "../db/db";
export const getQuestionWithAnswers = async (req:Request, res:Response) => {
  const { questionid } = req.params;

  try {
    const question = await client.question.findUnique({
      where: { id: parseInt(questionid) },
      include: {
        user: true,
        tags: true,
        answers: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const response = {
      question: {
        id: question.id,
        title: question.title,
        content: question.content,
        upvotes: question.upvotes,
        downvotes: question.downvotes,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        askedBy: {
          id: question.user.id,
          username: question.user.username,
          email: question.user.email,
        },
        tags: question.tags.map(tag => ({ id: tag.id, name: tag.name })),
      },
      answers: question.answers.map(answer => ({
        id: answer.id,
        content: answer.content,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        answeredBy: {
          id: answer.user.id,
          username: answer.user.username,
          email: answer.user.email,
        }
      })),
    };

    return res.status(200).json({ success: true, ...response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};





export const submitAnswer = async (req:Request, res:Response) => {
  const { questionid } = req.params;
  if(!req.userId)return;
  const userId = parseInt(req.userId);


  const { content } = req.body;

  try {
 
    const question = await client.question.findUnique({
      where: { id: parseInt(questionid) },
      include: { user: true },
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }


    const answeringUser = await client.user.findUnique({
      where: { id: userId },
    });

    if (!answeringUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

   
    const answer = await client.answer.create({
      data: {
        content,
        questionId: question.id,
        userId,
      },
      include: {
        user: true,
      },
    });

    await client.notification.create({
      data: {
        userId: question.userId,
        message: `${answeringUser.username} answered your question: "${question.title}"`,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Answer submitted successfully.',
      answer: {
        id: answer.id,
        content: answer.content,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        answeredBy: {
          id: answer.user.id,
          username: answer.user.username,
          email: answer.user.email,
        }
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};




export const upvoteAnswer = async (req:Request, res:Response) => {
  const { answerid } = req.body;
  if(!req.userId){
    return
  }
  const voterId = parseInt(req.userId);

  try {
    const answer = await client.answer.findUnique({
      where: { id: parseInt(answerid) },
      include: { user: true, question: true },
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found.' });
    }

    const voter = await client.user.findUnique({
      where: { id: voterId },
    });

    if (!voter) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedAnswer = await client.answer.update({
      where: { id: answer.id },
      data: {
        upvotes: answer.upvotes + 1,
      },
    });

    await client.notification.create({
      data: {
        userId: answer.userId,
        message: `${voter.username} upvoted your answer to the question "${answer.question.title}"`,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Answer upvoted successfully.',
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};


export const downvoteAnswer = async (req:Request, res:Response) => {
  const { answerid } = req.body;
  if(!req.userId){
    return
  }
  const voterId = parseInt(req.userId);

  try {
    const answer = await client.answer.findUnique({
      where: { id: parseInt(answerid) },
      include: { user: true, question: true },
    });

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found.' });
    }

    const voter = await client.user.findUnique({
      where: { id: voterId },
    });

    if (!voter) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedAnswer = await client.answer.update({
      where: { id: answer.id },
      data: {
        downvotes: answer.downvotes + 1,
      },
    });

    await client.notification.create({
      data: {
        userId: answer.userId,
        message: `${voter.username} downvoted your answer to the question "${answer.question.title}"`,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Answer downvoted successfully.',
      answer: updatedAnswer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
