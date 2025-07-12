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




export const upvoteAnswer = async (req: Request, res: Response) => {
  const { answerid } = req.body;
  if(!req.userId)return;
  const userId = parseInt(req.userId);

  if (!userId || !answerid) {
    return res.status(400).json({ error: "Missing userId or answerId." });
  }

  try {
    const existingVote = await client.answerVote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId: parseInt(answerid),
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ error: "You have already voted on this answer." });
    }

    const answer = await client.answer.update({
      where: { id: parseInt(answerid) },
      data: {
        upvotes: { increment: 1 },
        votes: {
          create: {
            userId,
            type: "UPVOTE",
          },
        },
      },
      include: {
        question: true,
        user: true,
      },
    });

    await client.notification.create({
      data: {
        userId: answer.userId,
        message: `${'Someone'} upvoted your answer to "${answer.question.title}"`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Answer upvoted.",
      answer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error." });
  }
};


export const downvoteAnswer = async (req: Request, res: Response) => {
  const { answerid } = req.body;
  if(!req.userId)return;
  const userId = parseInt(req.userId);

  if (!userId || !answerid) {
    return res.status(400).json({ error: "Missing userId or answerId." });
  }

  try {
    const existingVote = await client.answerVote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId: parseInt(answerid),
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ error: "You have already voted on this answer." });
    }

    const answer = await client.answer.update({
      where: { id: parseInt(answerid) },
      data: {
        downvotes: { increment: 1 },
        votes: {
          create: {
            userId,
            type: "DOWNVOTE",
          },
        },
      },
      include: {
        question: true,
        user: true,
      },
    });

    await client.notification.create({
      data: {
        userId: answer.userId,
        message: `${ 'Someone'} downvoted your answer to "${answer.question.title}"`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Answer downvoted.",
      answer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error." });
  }
};
