# 🧑‍🤝‍🧑 Team Collaboration Dashboard

A real-time collaboration platform for teams to manage projects, assign tasks, communicate, and track progress efficiently. Built with **Node.js**, **Express**, **PostgreSQL**, and **Socket.IO**, this tool provides seamless teamwork and productivity.

---

## 🚀 Features

### ✅ Core Features

- **Authentication & Authorization**
  - Secure user registration and login with JWT
  - Role-based access control (Admin, Member)

- **Project Management**
  - Create, update, delete projects
  - Manage team members and roles within projects

- **Task Management**
  - Add, update, delete tasks
  - Assign tasks to members with deadlines & priority
  - Status workflow: To Do → In Progress → Done

- **Real-Time Collaboration**
  - Live task updates, typing indicators via Socket.IO
  - Notifications and real-time events

- **Team Chat**
  - Project specific chat channels

- **File Sharing**
  - Upload and attach files to projects/tasks

---

### 📊 Productivity & Tracking

- **Kanban Board UI (Frontend)**
  - Drag-and-drop tasks by status
  - Visual overview of task distribution

- **Progress Tracking**
  - Track % of completed tasks

- **Deadline Reminders**
  - Scheduled backend jobs using `node-cron` to alert users of due/overdue tasks

---

### ⚙️ Admin & User Controls

- **Invitations & Teams**
  - Invite users to projects/teams
  - Accept/reject invite functionality
---

## 🛠 Tech Stack

### Backend

- **Node.js** + **Express.js** — API framework
- **PostgreSQL** + **Sequelize ORM** — Database & models
- **Socket.IO** — Real-time WebSockets communication
---

## 📦 Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 13.x

### Setup Instructions

# Clone the repository
- git clone https://github.com/code-brownie/Team-collab.git
- cd Team-collab

# Install dependencies
npm install

# Start the server
npm run dev
