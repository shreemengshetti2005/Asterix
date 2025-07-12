# StackIt – A Minimal Q&A Forum Platform

StackIt is a lightweight, community-driven question-and-answer platform built for collaborative learning and structured knowledge sharing. Designed with simplicity in mind, StackIt provides a clean user experience for asking questions, sharing answers, and engaging in thoughtful discussions.

---

## ✨ Features

### 🔍 Core Functionality
- Ask questions with title, rich-text description, and tags
- Answer questions using the same formatting capabilities
- Vote on answers (upvote/downvote)
- Mark accepted answers (by the question author)
- Tagging system for discoverability
- Search and filter questions by tags or status
- Notification system for replies, comments, and mentions
- Fully responsive design (desktop and mobile)
- Pagination support for question browsing

### ✏️ Rich Text Editor Capabilities
- Bold, Italic, Strikethrough
- Numbered and bullet lists
- Emoji support
- Hyperlink and image insertion
- Text alignment (left, center, right)

### 👤 User Roles
| Role  | Permissions |
|-------|-------------|
| Guest | View questions and answers |
| User  | Register, log in, post questions/answers, vote |
| Admin | Moderate content, ban users, reject spam, manage platform activity |

---

## 🛠️ Tech Stack

### 🧩 Frontend
- **React** with **TypeScript (TSX)**
- **Tailwind CSS** for styling
- HTML-based rich text editor

### 🧩 Backend
- **Node.js**
- **Express.js**
- **PostgreSQL** for persistent data storage
- **ChromaDB** for semantic search indexing and querying

### ⚙️ DevOps & Infra
- **Docker** for containerized deployment
- **REST API** for communication between client and server

---

## 🧠 Semantic Search with ChromaDB

We use [ChromaDB](https://www.trychroma.com/) to semantically embed question content, improving search relevance beyond simple keyword matching. This enables users to find similar or related discussions naturally.

---

## 📸 Screens

### 🏠 Home Page
- View all questions
- Filters: Newest, Unanswered, More
- Search functionality
- Login button
- Ask New Question (CTA)
- Pagination

### ❓ Ask a Question
- Title input
- HTML Rich Text Editor for description
- Tag input (multi-select)
- Submit button

### 🧵 Question Detail
- Question with full context and tags
- Answers listed with upvote button
- Submit new answer using rich text editor
- Breadcrumb navigation
