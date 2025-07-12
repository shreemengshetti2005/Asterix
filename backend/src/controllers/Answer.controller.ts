import { Request, Response } from "express";
import client from "../db/db";

export const getQuestionWithAnswers = async (req: Request, res: Response) => {
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
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: 'asc'
              }
            },
          },
          orderBy: {
            createdAt: 'desc'
          }
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
        tags: question.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
        })),
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
        },
        comments: answer.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          commentedBy: {
            id: comment.user.id,
            username: comment.user.username,
            email: comment.user.email,
          }
        }))
      })),
    };

    return res.status(200).json({ success: true, ...response });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
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

export const read_notification = async (req: Request, res: Response) => {
  try {
    const notificationid = parseInt(req.body.notificationid);

    if (isNaN(notificationid)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const updatedNotification = await client.notification.update({
      where: { id: notificationid },
      data: { isRead: true },
    });

    return res.json({ message: "Notification marked as read", notification: updatedNotification });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    return res.status(500).json({ error: "Failed to update notification" });
  }
};
export const notification = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = parseInt(req.userId);

    const unreadCount = await client.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return res.json({ unreadCount });
  } catch (err) {
    console.error("Error fetching unread notification count:", err);
    return res.status(500).json({ error: "Failed to fetch unread notification count" });
  }
};

export const admin_delete = async (req: Request, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    const userId = parseInt(req.userId);
    const questionId = parseInt(req.body.questionid);

    const user = await client.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    await client.answer.deleteMany({
      where: { questionId }
    });

    await client.question.delete({
      where: { id: questionId }
    });

    return res.json({ message: "Question deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};


export const comment = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const userId = parseInt(req.userId);
  const { answerId, content } = req.body;

  if (!answerId || !content) {
    return res.status(400).json({ error: "Missing answerId or content" });
  }

  try {
    // Get the answer to find its author
    const answer = await client.answer.findUnique({
      where: { id: answerId },
      select: { userId: true, questionId: true },
    });

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Add the comment
    const newComment = await client.comment.create({
      data: {
        content,
        userId,
        answerId,
      },
    });

    // Only send notification if commenter is not the answer author
    if (answer.userId !== userId) {
      await client.notification.create({
        data: {
          message: `Your answer has a new comment.`,
          userId: answer.userId,
          questionId: answer.questionId || null,
        },
      });
    }

    return res.status(200).json({ message: "Comment added", comment: newComment });

  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const recieve_comment = async (req: Request, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const answerId = parseInt(req.body.answerId);
  if (!answerId) return res.status(400).json({ error: "Missing answerId" });

  try {
    const comments = await client.comment.findMany({
      where: { answerId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Server error while fetching comments" });
  }
};