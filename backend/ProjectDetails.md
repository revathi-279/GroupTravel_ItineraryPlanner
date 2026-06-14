# 🌍 Group Travel Itinerary Planner

A Collaborative Smart Travel Planning Platform built using the MERN Stack.

---

# 📌 Project Overview

Group Travel Itinerary Planner is a full-stack collaborative web application designed to simplify and organize group trip planning.

The application helps groups:

* plan trips together
* create shared itineraries
* vote on hotels/dates/activities
* split expenses
* track trip budgets
* view weather forecasts
* upload and share trip memories/photos

The goal of this project is not only to build a useful travel planning platform, but also to deeply understand real-world MERN stack architecture, backend development flow, API design, authentication systems, and full-stack application structure.

---

# 🎯 Problem Statement

Planning trips with multiple people often becomes difficult because:

* communication is spread across multiple apps
* expenses become confusing
* itinerary management becomes messy
* decisions take too long
* weather and budget information are not centralized
* trip details get lost in chats

This application solves these problems by providing one centralized collaborative platform for group travel management.

---

# 🧠 Project Goals

This project is being developed to learn:

## Full Stack Development

* frontend/backend communication
* API architecture
* request/response lifecycle
* authentication flow
* database relationships

## Backend Development

* Express architecture
* REST APIs
* middleware
* JWT authentication
* business logic
* MongoDB integration

## Frontend Development

* React architecture
* state management
* protected routes
* API integration
* reusable components

## Real-World Development Workflow

* project planning
* modular architecture
* scalable folder structure
* feature-based development
* backend-first workflow

---

# 🚀 Main Features

# 🔐 Authentication System

Users can:

* register account
* login securely
* access protected routes
* stay authenticated using JWT tokens

### Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected APIs
* User Authorization

---

# ✈️ Trip Management

Users can:

* create trips
* edit trip details
* manage members
* delete trips
* organize travel plans

### Features

* Trip Creation
* Destination Management
* Travel Dates
* Member Management
* Trip Ownership

---

# 🗓️ Shared Itinerary Planner

Group members can collaboratively create itineraries.

### Features

* Day-wise planning
* Add activities
* Add notes
* Add timings
* Collaborative updates

### Example

Day 1

* Flight
* Hotel Check-in
* Beach Visit

---

# 🗳️ Poll & Voting System

Members can vote on travel decisions.

### Poll Types

* Hotel Selection
* Destination Selection
* Date Selection
* Activity Selection

### Features

* Vote tracking
* Poll results
* Duplicate vote prevention

---

# 💰 Expense Splitting System

Track and split trip expenses.

### Features

* Add Expenses
* Track Who Paid
* Equal Split
* Custom Split
* Member Balances
* Expense History

### Example

Liri paid ₹4000
Split among 4 members

Each member owes ₹1000

---

# 📊 Budget Tracking

Track overall trip budget health.

### Features

* Total Budget
* Total Spent
* Remaining Amount
* Budget Status

### Budget Indicators

* 🟢 Safe
* 🟡 Moderate
* 🔴 Over Budget

---

# 🌤️ Weather Integration

Display destination weather forecast.

### Features

* Current Weather
* Forecast During Trip
* Weather Awareness for Planning

### APIs

* OpenWeather API
  or
* WeatherAPI

---

# 🔔 Notifications (Easy Version)

Frontend notifications for:

* new expenses
* new polls
* itinerary updates
* trip changes

### Possible Library

* React Toastify

---

# ⏳ Trip Countdown

Displays days remaining until trip starts.

### Example

“Goa Trip starts in 12 days 🎉”

---

# 🖼️ Shared Photo Gallery

Members can upload and view trip memories.

### Features

* Upload Images
* Shared Gallery
* Trip Memories
* Cloud Storage Integration

---

# 🏗️ System Architecture

Frontend (React)
↓
Axios API Requests
↓
Backend Server (Express.js)
↓
MongoDB Database
↓
JSON Response
↓
Frontend UI Update

---

# 🧠 Backend-First Development Strategy

This project is intentionally being developed using a backend-first approach.

## Why Backend First?

Backend-first development helps understand:

* API design
* authentication flow
* database relationships
* business logic
* request/response lifecycle
* real application architecture

Once backend becomes stable and understandable, frontend integration becomes much easier.

---

# 🛠️ Tech Stack

# Frontend

* React
* React Router
* Axios
* Tailwind CSS

---

# Backend

* Node.js
* Express.js

---

# Database

* MongoDB Atlas
* Mongoose

---

# Authentication

* JWT
* bcrypt

---

# File Uploads

* Multer
* Cloudinary

---

# APIs & Integrations

* Weather API

---

# 📁 Planned Folder Structure

group-travel-planner/
│
├── backend/
│
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   └── server.js
│
├── frontend/
│
│   ├── src/
│   │
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── utils/
│   │   └── App.jsx
│
└── README.md

---

# 🧠 Backend Architecture Explanation

# server.js

Responsible for:

* starting server
* connecting database
* listening on port

Acts as:
Application Entry Point

---

# app.js

Responsible for:

* creating Express app
* middleware configuration
* routes setup
* app-level configuration

Acts as:
Application Configuration Layer

---

# controllers/

Contains business logic.

Examples:

* registerUser()
* loginUser()
* createTrip()

---

# routes/

Defines API endpoints.

Examples:

* /api/auth
* /api/trips
* /api/expenses

---

# middleware/

Handles reusable request processing.

Examples:

* authentication
* authorization
* validation

---

# models/

Defines MongoDB schemas and collections.

Examples:

* User
* Trip
* Expense
* Poll

---

# 🗄️ Database Planning

# Users Collection

Fields:

* name
* email
* password
* profilePhoto
* joinedTrips

---

# Trips Collection

Fields:

* title
* description
* destination
* startDate
* endDate
* createdBy
* members
* itinerary
* expenses
* polls
* budget
* photos

---

# Expenses Collection

Fields:

* amount
* description
* paidBy
* splitBetween
* tripId

---

# Polls Collection

Fields:

* question
* options
* votes
* createdBy
* tripId

---

# Photos Collection

Fields:

* imageUrl
* uploadedBy
* uploadedAt
* tripId

---

# 🔌 Planned API Structure

# Authentication APIs

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

---

# Trip APIs

POST /api/trips
GET /api/trips
GET /api/trips/:id
PUT /api/trips/:id
DELETE /api/trips/:id

---

# Itinerary APIs

POST /api/itinerary
PUT /api/itinerary/:id
DELETE /api/itinerary/:id

---

# Poll APIs

POST /api/polls
POST /api/polls/vote
GET /api/polls/:tripId

---

# Expense APIs

POST /api/expenses
GET /api/expenses/:tripId

---

# Photo APIs

POST /api/photos/upload
GET /api/photos/:tripId

---

# 🔄 Main User Flow

User Register/Login
→ Create Trip
→ Invite Members
→ Members Join Trip
→ Plan Itinerary
→ Create Polls
→ Vote on Decisions
→ Add Expenses
→ Track Budget
→ View Countdown
→ Check Weather
→ Upload Photos
→ Complete Trip

---

# 📚 Development Phases

# ✅ Phase 1

Project Planning & Architecture

---

# ⏳ Phase 2

Backend Initialization & Server Setup

Topics:

* Express setup
* app.js & server.js
* environment variables
* middleware basics
* routes basics

---

# ⏳ Phase 3

MongoDB Connection & Models

Topics:

* MongoDB Atlas
* Mongoose
* schemas
* models
* database connection flow

---

# ⏳ Phase 4

Authentication System

Topics:

* registration
* login
* JWT
* bcrypt
* protected routes
* auth middleware

---

# ⏳ Phase 5

Trip Management APIs

Topics:

* create trip
* update trip
* delete trip
* member handling

---

# ⏳ Phase 6

Shared Itinerary System

Topics:

* nested itinerary structure
* collaborative updates

---

# ⏳ Phase 7

Poll & Voting System

Topics:

* vote tracking
* poll logic
* result calculation

---

# ⏳ Phase 8

Expense Splitting System

Topics:

* balance calculation
* expense tracking
* split logic

---

# ⏳ Phase 9

Advanced Features

Topics:

* weather integration
* budget tracking
* trip countdown
* notifications

---

# ⏳ Phase 10

Photo Upload System

Topics:

* multer
* cloudinary
* image uploads

---

# ⏳ Phase 11

Frontend Development

Topics:

* React pages
* API integration
* protected frontend routes
* state management

---

# ⏳ Phase 12

Deployment & Optimization

Topics:

* frontend deployment
* backend deployment
* environment variables
* production setup

---

# 🚨 Common Beginner Mistakes To Avoid

* Starting frontend before understanding backend flow
* Copy-pasting large tutorials
* Mixing all logic into one file
* Ignoring folder structure
* Not understanding request/response flow
* Building all features at once
* Skipping planning stage

---

# 🌱 Developer Mindset For This Project

The goal is NOT:
“Finish project quickly.”

The goal is:
“Understand how real full-stack applications are built.”

Important focus areas:

* architecture thinking
* modular development
* API flow
* database relationships
* authentication understanding
* scalable code structure

---

# 📌 Current Progress

* [x] Project Planning
* [x] Feature Finalization
* [x] Architecture Planning
* [x] Folder Structure Planning
* [ ] Backend Initialization
* [ ] MongoDB Connection
* [ ] Authentication
* [ ] Trip APIs
* [ ] Poll System
* [ ] Expense System
* [ ] Weather Integration
* [ ] Budget Tracking
* [ ] Notifications
* [ ] Countdown Feature
* [ ] Photo Uploads
* [ ] Frontend Integration
* [ ] Deployment

---

# 🚀 Future Enhancements

Possible future improvements:

* Interactive Maps
* Realtime Notifications
* AI Trip Suggestions
* Collaborative Notes
* Public Trip Sharing
* Analytics Dashboard

---

# 🧑‍💻 Project Status

Current Development Stage:
Planning & Backend Architecture Preparation

Next Step:
Backend Initialization & Express Server Setup
