import { Request, Response } from 'express'

import { createQuestionSchema } from '../helpers/Interface'
import client from '../db/db'


export const createQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const parsed = createQuestionSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors
      })
    }

    const { title, content, tags } = parsed.data

    const tagRecords = await Promise.all(
      tags.map(async (tagName) => {
        return client.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        })
      })
    )

    const question = await client.question.create({
      data: {
        title,
        content,
        userId:parseInt(userId),
        tags: {
          connect: tagRecords.map((tag) => ({ id: tag.id }))
        }
      },
      include: {
        tags: true
      }
    })
     await client.notification.create({
      data: {
        userId: parseInt(userId),
        questionId: question.id,
        message: `Your question "${title}" has been posted successfully.`,
      }
    })
    return res.status(201).json({ message: 'Question created successfully', question })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}



export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await client.question.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        tags: true,
        answers: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    })

    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      title: q.title,
      content: q.content,
      user: q.user,
      tags: q.tags,
      answers: q.answers,
      answerCount: q.answers.length,
      isUnanswered: q.answers.length === 0,
      upvotes: q.upvotes,
      downvotes: q.downvotes,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt
    }))

    const totalQuestions = questions.length
    const totalUnanswered = questions.filter(q => q.answers.length === 0).length

    return res.status(200).json({
      totalQuestions,
      totalUnanswered,
      questions: formattedQuestions
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}




export const upvoteQuestion = async (req:Request, res:Response) => {
  const { questionid } = req.params;
  if(!req.userId){
    return
  }
  const voterId = parseInt(req.userId);

  try {
    const [question, voter] = await Promise.all([
      client.question.findUnique({
        where: { id: parseInt(questionid) },
        include: { user: true },
      }),
      client.user.findUnique({
        where: { id: voterId },
      }),
    ]);

    if (!question || !voter) {
      return res.status(404).json({ error: 'Question or user not found' });
    }

    const updated = await client.question.update({
      where: { id: question.id },
      data: { upvotes: question.upvotes + 1 },
    });

    await client.notification.create({
      data: {
        userId: question.userId,
        message: `${voter.username} upvoted your question "${question.title}"`,
      },
    });

    return res.status(200).json({ success: true, question: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const downvoteQuestion = async (req:Request, res:Response) => {
  const { questionid } = req.params;
  if(!req.userId){
    return
  }
  const voterId = parseInt(req.userId);

  try {
    const [question, voter] = await Promise.all([
      client.question.findUnique({
        where: { id: parseInt(questionid) },
        include: { user: true },
      }),
      client.user.findUnique({
        where: { id: voterId },
      }),
    ]);

    if (!question || !voter) {
      return res.status(404).json({ error: 'Question or user not found' });
    }

    const updated = await client.question.update({
      where: { id: question.id },
      data: { downvotes: question.downvotes + 1 },
    });

    await client.notification.create({
      data: {
        userId: question.userId,
        message: `${voter.username} downvoted your question "${question.title}"`,
      },
    });

    return res.status(200).json({ success: true, question: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFilteredQuestions = async (req:Request, res:Response) => {
  const { filter } = req.params;

  try {
    let questions;

    switch (filter) {
      case 'newest':
        questions = await client.question.findMany({
          orderBy: { createdAt: 'desc' },
          include: { user: true, answers: true, tags: true },
        });
        break;

      case 'oldest':
        questions = await client.question.findMany({
          orderBy: { createdAt: 'asc' },
          include: { user: true, answers: true, tags: true },
        });
        break;

      case 'unanswered':
        questions = await client.question.findMany({
          where: { answers: { none: {} } },
          orderBy: { createdAt: 'desc' },
          include: { user: true, answers: true, tags: true },
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid filter. Use "newest", "oldest", or "unanswered".' });
    }

    return res.status(200).json({ success: true, questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

