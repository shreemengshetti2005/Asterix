export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  userName: string;
  answerCount: number;
  votes: number;
  views: number;
  timeAgo: string;
}

export const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine both the names into a single column...",
    tags: ["SQL", "Database", "Beginner"],
    userName: "John Doe",
    answerCount: 5,
    votes: 15,
    views: 234,
    timeAgo: "2 hours ago"
  },
  {
    id: "2",
    title: "React useState not updating state immediately",
    description: "I'm trying to update a state variable using useState hook but the state doesn't seem to update immediately. I've tried multiple approaches but can't figure out what's wrong with my code...",
    tags: ["React", "JavaScript", "Hooks"],
    userName: "Jane Smith",
    answerCount: 3,
    votes: 8,
    views: 156,
    timeAgo: "4 hours ago"
  },
  {
    id: "3",
    title: "Best practices for API error handling in Node.js",
    description: "What are the industry standard approaches for handling errors in a Node.js REST API? I want to implement proper error handling that provides meaningful responses to clients while logging detailed information for debugging...",
    tags: ["Node.js", "API", "Error Handling"],
    userName: "Mike Johnson",
    answerCount: 2,
    votes: 12,
    views: 89,
    timeAgo: "6 hours ago"
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to use which?",
    description: "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the differences and provide examples of use cases where one is better than the other?",
    tags: ["CSS", "Grid", "Flexbox"],
    userName: "Sarah Wilson",
    answerCount: 7,
    votes: 25,
    views: 445,
    timeAgo: "8 hours ago"
  },
  {
    id: "5",
    title: "Python list comprehension with multiple conditions",
    description: "How can I create a list comprehension in Python with multiple if conditions? I want to filter a list based on multiple criteria and I'm not sure about the syntax...",
    tags: ["Python", "List Comprehension"],
    userName: "David Brown",
    answerCount: 4,
    votes: 6,
    views: 123,
    timeAgo: "1 day ago"
  },
  {
    id: "6",
    title: "Docker container not starting: permission denied",
    description: "I'm getting a permission denied error when trying to start my Docker container. The application works fine locally but fails when containerized. Here's my Dockerfile and the error message...",
    tags: ["Docker", "DevOps", "Permissions"],
    userName: "Alex Chen",
    answerCount: 1,
    votes: 3,
    views: 67,
    timeAgo: "1 day ago"
  }
];