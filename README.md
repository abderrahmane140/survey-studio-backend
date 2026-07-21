# Survey Studio Backend

A RESTful API for creating, publishing, and collecting responses for surveys.

Built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

---

# Features

- Create, update, delete surveys
- Create, update, delete sections
- Create, update, delete questions
- Publish surveys
- Get published surveys
- Submit survey responses
- View survey responses

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- CORS

---

# Project Structure

```
survey-studio-backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── controllers/
│   │   ├── survey.controller.js
│   │   ├── section.controller.js
│   │   ├── question.controller.js
│   │   ├── public.controller.js
│   │   └── response.controller.js
│   │
│   ├── routes/
│   │   ├── survey.routes.js
│   │   ├── section.routes.js
│   │   ├── question.routes.js
│   │   ├── public.routes.js
│   │   └── response.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/abderrahmane140/survey-studio-backend.git
```

Move into the project

```bash
cd survey-studio-backend
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/survey_studio"
PORT=3000
```

Replace:

- **postgres** → your PostgreSQL username
- **password** → your PostgreSQL password
- **survey_studio** → your database name

---

# Database Setup

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev
```

If you already have migrations:

```bash
npx prisma migrate deploy
```

Open Prisma Studio

```bash
npx prisma studio
```

Reset the database

```bash
npx prisma migrate reset
```

---

# Run the Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Server

```
http://localhost:3000
```

---

# API Endpoints

## Survey

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/surveys` | Get all surveys |
| GET | `/api/surveys/:id` | Get survey |
| POST | `/api/surveys` | Create survey |
| PUT | `/api/surveys/:id` | Update survey |
| DELETE | `/api/surveys/:id` | Delete survey |
| PATCH | `/api/surveys/:id/publish` | Publish survey |

---

## Sections

| Method | Endpoint |
|---------|----------|
| POST | `/api/surveys/:surveyId/sections` |
| GET | `/api/surveys/:surveyId/sections` |
| PUT | `/api/sections/:id` |
| DELETE | `/api/sections/:id` |

---

## Questions

| Method | Endpoint |
|---------|----------|
| POST | `/api/surveys/:surveyId/sections/:sectionId/questions` |
| GET | `/api/surveys/:surveyId/sections/:sectionId/questions` |
| PUT | `/api/questions/:id` |
| DELETE | `/api/questions/:id` |

---

## Public

| Method | Endpoint |
|---------|----------|
| GET | `/api/public/surveys/:id` |

Returns a published survey with all sections and questions.

---

## Responses

| Method | Endpoint |
|---------|----------|
| POST | `/api/responses` |
| GET | `/api/responses/survey/:surveyId` |

---

# Example Request

Create Survey

```http
POST /api/surveys
```

```json
{
    "title": "Customer Satisfaction",
    "description": "Help us improve our services"
}
```

---

Publish Survey

```http
PATCH /api/surveys/{surveyId}/publish
```

---

Submit Response

```http
POST /api/responses
```

```json
{
    "surveyId": "survey-id",
    "answers": [
        {
            "questionId": "question-id",
            "value": "John Doe"
        }
    ]
}
```

---

# Question Types

Supported question types:

- short_text
- long_text
- email
- number
- date
- single_choice
- multiple_choice
- rating

---

# Database Schema

```
Survey
│
├── SurveySection
│      │
│      ├── SurveyQuestion
│      │
│      └── SurveyQuestion
│
├── SurveyResponse
│      │
│      └── ResponseAnswer
```

Relationships

```
Survey
 ├── hasMany Sections
 ├── hasMany Responses

Section
 ├── belongsTo Survey
 ├── hasMany Questions

Question
 ├── belongsTo Section

Response
 ├── belongsTo Survey
 ├── hasMany Answers

Answer
 ├── belongsTo Response
 ├── belongsTo Question
```

---

# HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Future Improvements

- Authentication & Authorization
- Request Validation
- Pagination
- Search & Filtering
- Soft Delete
- Swagger / OpenAPI Documentation
- Docker Support
- Unit & Integration Tests
- Rate Limiting
- Logging
- File Upload Support
- Email Invitations
- Survey Expiration
- Anonymous Responses
- Drag & Drop Question Ordering

---

# Author

**Abderrahmane Bsar**

Backend Developer

Built as an MVP survey management API using Node.js, Express.js, Prisma, and PostgreSQL.