# FlowDesk — Ticketing System Backend

FlowDesk is a role-based ticket management backend built with Node.js, Express, and MySQL.  
It supports authentication, authorization, ticket lifecycle management, comments, and activity logging.

## Features
- JWT-based authentication
- Role-based access control (ADMIN / USER)
- Ticket lifecycle enforcement
- Ticket assignment and comments
- Activity/audit log for all ticket actions
- Swagger (OpenAPI) documentation

## Tech Stack
- Node.js
- Express.js
- MySQL (Railway)
- JWT, bcrypt
- Swagger / OpenAPI

## API Documentation
http://localhost:5000/api-docs


## Setup
```bash
git clone <repo>
cd backend
npm install
npm run dev

## Environment Variables
```bash
PORT=5000
JWT_SECRET=your_secret
MYSQLHOST=...
MYSQLUSER=...
MYSQLPASSWORD=...
MYSQLDATABASE=...
MYSQLPORT=...

## Roles
ADMIN: assign tickets, update status, view all activity
USER: create tickets, view own tickets, comment

