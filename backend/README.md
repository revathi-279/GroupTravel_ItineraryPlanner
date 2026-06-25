# Group Travel Itinerary Planner - Backend

## Overview

The backend of the Group Travel Itinerary Planner is built using Node.js, Express.js, and MongoDB. It provides REST APIs for authentication, trip management, itinerary planning, expense tracking, polling, notifications, settlements, and gallery management.

The system is designed to support collaborative trip planning where multiple users can manage a trip together, vote on decisions, track shared expenses, and maintain trip-related information in a single place.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary
* Multer
* bcrypt
* Cookie Parser
* CORS

---

## Features

### Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* Profile update
* Profile picture upload
* Password update

---

### Trip Management

* Create trip
* Update trip
* Delete trip
* Get trip details
* Search trips
* Add members through invitations
* Manage admins

---

### Itinerary Management

* Create itinerary event
* Update itinerary event
* Delete itinerary event
* View itinerary timeline
* Mark itinerary status

---

### Expense Management

* Create expense
* Update expense
* Delete expense
* Split expenses among selected participants
* Track individual balances
* Settlement calculation

---

### Poll System

* Create poll
* Vote on poll
* Delete poll
* Update poll expiration time
* View poll results

---

### Gallery

* Upload images
* Delete images
* Emoji reactions on images
* Trip-wise gallery management

---

### Notifications

* Trip invitation notifications
* Accept invitations
* Reject invitations
* Notification tracking

---

### Settlements

* Automatic debt calculation
* Settlement summary generation
* Settlement status updates

---

## Project Structure

backend/

├── config/

├── controllers/

├── middlewares/

├── models/

├── routes/

├── services/

├── uploads/

├── utils/

├── app.js

├── server.js

└── package.json

---

## Environment Variables

Create a `.env` file in the backend root directory.

Required variables:

PORT=

MONGODB_URI=

JWT_SECRET=

CLIENT_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

---

## Installation

Install dependencies:

npm install

Run development server:

npm run dev

Run production server:

npm start

---

## API Modules

### Auth APIs

* Register
* Login
* Logout
* Get Profile
* Update Profile
* Update Password
* Upload Profile Picture

### Trip APIs

* Create Trip
* Update Trip
* Delete Trip
* Get Trips
* Get Trip Details
* Search Trips

### Itinerary APIs

* Create Event
* Update Event
* Delete Event
* Get Events

### Expense APIs

* Create Expense
* Update Expense
* Delete Expense
* Get Expenses
* Expense Summary

### Poll APIs

* Create Poll
* Vote Poll
* Delete Poll
* Update Poll Expiry
* Get Polls

### Gallery APIs

* Upload Image
* Delete Image
* Add Reaction

### Notification APIs

* Get Notifications
* Accept Invitation
* Reject Invitation

### Settlement APIs

* Get Settlements
* Update Settlement Status

---

## Security

* Password hashing using bcrypt
* JWT authentication
* Protected routes through middleware
* Role-based admin checks
* Input validation
* Secure cookie handling

---

## Future Improvements

* Real-time notifications
* Real-time polling updates
* Activity logs
* Trip templates
* Advanced analytics
* Offline support

Developed as a collaborative trip planning platform for managing itineraries, expenses, polls, galleries, and group coordination in a single application.
