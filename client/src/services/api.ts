// Base configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Response interfaces
interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data?: T;
  display_on_frontend?: string;
  success?: boolean;
  error?: string;
}

// Auth interfaces
interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Question interfaces
interface QuestionData {
  title: string;
  content: string;
  tags: string[];
}

interface Tag {
  id: number;
  name: string;
}

interface Question {
  id: number;
  title: string;
  content: string;
  user?: User;
  askedBy?: User;
  tags: Tag[];
  answers?: Answer[];
  answerCount?: number;
  isUnanswered?: boolean;
  upvotes: number;
  downvotes: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

interface QuestionsResponse {
  totalQuestions: number;
  totalUnanswered: number;
  questions: Question[];
}

// Answer interfaces
interface AnswerData {
  content: string;
}

interface Answer {
  id: number;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  answeredBy: User;
}

interface AnswerResponse {
  success: boolean;
  question: Question;
  answers: Answer[];
}

// AI interfaces
interface MarkdownRequest {
  text: string;
}

// Notification interfaces
interface Notification {
  id: number;
  userId: number;
  questionId?: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: number;
    title: string;
  };
}

interface NotificationsResponse {
  count: number;
  notifications: Notification[];
}

interface ReadNotificationRequest {
  notificationid: number;
}

interface ReadNotificationResponse {
  message: string;
  notification: Notification;
}

// Comment interfaces
interface Comment {
  id: number;
  content: string;
  userId: number;
  answerId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface CommentData {
  content: string;
}

interface CommentsResponse {
  success: boolean;
  comments: Comment[];
}

interface AddCommentResponse {
  success: boolean;
  message: string;
  comment: Comment;
}

// API Service Class using fetch
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth Methods
  async login(data: LoginData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Question Methods
  async createQuestion(data: QuestionData): Promise<ApiResponse<{ message: string; question: Question }>> {
    return this.request<ApiResponse<{ message: string; question: Question }>>('/question/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuestions(): Promise<QuestionsResponse> {
    return this.request<QuestionsResponse>('/question/get', {
      method: 'GET',
    });
  }

  async getUnansweredQuestions(): Promise<{ success: boolean; questions: Question[] }> {
    return this.request<{ success: boolean; questions: Question[] }>('/question/filter/unanswered', {
      method: 'GET',
    });
  }

  async getFilteredQuestions(filterType: string): Promise<{ success: boolean; questions: Question[] }> {
    return this.request<{ success: boolean; questions: Question[] }>(`/question/filter/${filterType}`, {
      method: 'GET',
    });
  }

  async searchQuestions(query: string): Promise<{ questions: Question[] }> {
    return this.request<{ questions: Question[] }>('/question/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async upvoteQuestion(questionId: number): Promise<{ success: boolean; question: Question }> {
    return this.request<{ success: boolean; question: Question }>(`/question/upvote/${questionId}`, {
      method: 'POST',
    });
  }

  async downvoteQuestion(questionId: number): Promise<{ success: boolean; question: Question }> {
    return this.request<{ success: boolean; question: Question }>(`/question/downvote/${questionId}`, {
      method: 'POST',
    });
  }

  async deleteQuestion(questionId: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/answer/delete`, {
      method: 'POST',
      body: JSON.stringify({ questionid: questionId }),
    });
  }

  // Answer Methods
  async submitAnswer(questionId: number, data: AnswerData): Promise<{ success: boolean; message: string; answer: Answer }> {
    return this.request<{ success: boolean; message: string; answer: Answer }>(`/answer/submit/${questionId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnswersByQuestionId(questionId: number): Promise<AnswerResponse> {
    return this.request<AnswerResponse>(`/answer/get/${questionId}`, {
      method: 'GET',
    });
  }

  async upvoteAnswer(answerId: number): Promise<{ success?: boolean; error?: string }> {
    return this.request<{ success?: boolean; error?: string }>('/answer/upvote', {
      method: 'POST',
      body: JSON.stringify({ answerid: answerId.toString() }),
    });
  }

  async downvoteAnswer(answerId: number): Promise<{ success?: boolean; error?: string }> {
    return this.request<{ success?: boolean; error?: string }>('/answer/downvote', {
      method: 'POST',
      body: JSON.stringify({ answerid: answerId.toString() }),
    });
  }

  // AI Methods
  async convertToMarkdown(data: MarkdownRequest): Promise<{ status: number; data: string }> {
    return this.request<{ status: number; data: string }>('/ai/markdown', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAITags(data: MarkdownRequest): Promise<{ status: number; data: string[] }> {
    return this.request<{ status: number; data: string[] }>('/ai/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notification Methods
  async getNotifications(): Promise<NotificationsResponse> {
    return this.request<NotificationsResponse>('/answer/notifications', {
      method: 'GET',
    });
  }

  async readNotification(data: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    return this.request<ReadNotificationResponse>('/answer/notification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Comment Methods
  async getComments(answerId: number): Promise<CommentsResponse> {
    return this.request<CommentsResponse>('/answer/recieve_comment', {
      method: 'POST',
      body: JSON.stringify({ answerId }),
    });
  }

  async addComment(answerId: number, data: CommentData): Promise<AddCommentResponse> {
    return this.request<AddCommentResponse>('/answer/comment', {
      method: 'POST',
      body: JSON.stringify({ ...data, answerId }),
    });
  }

  // Error handling utility
  handleError(error: any): string {
    if (error.response?.data?.display_on_frontend) {
      return error.response.data.display_on_frontend;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return 'An unexpected error occurred';
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export types
export type {
  ApiResponse,
  LoginData,
  SignupData,
  User,
  QuestionData,
  Question,
  AnswerData,
  Answer,
  Tag,
  QuestionsResponse,
  AnswerResponse,
  MarkdownRequest,
  Notification,
  NotificationsResponse,
  ReadNotificationRequest,
  ReadNotificationResponse,
  Comment,
  CommentData,
  CommentsResponse,
  AddCommentResponse,
}; 