# Group Travel Itinerary Planner - Frontend

## Overview

The frontend of the Group Travel Itinerary Planner is built using React and provides an interactive interface for planning and managing group trips. It allows users to collaborate on itineraries, manage expenses, participate in polls, view galleries, and track trip activities through a modern and responsive user interface.

The application communicates with the backend through REST APIs and provides a seamless experience for trip organizers and members.

---

## Tech Stack

* React
* React Router DOM
* Axios
* Tailwind CSS
* Framer Motion
* Lucide React
* Context API

---

## Features

### Authentication

* User registration
* User login
* User logout
* Protected routes
* Profile management
* Profile picture upload

---

### Dashboard

* Active trip overview
* Upcoming trip information
* Pending invitations
* Quick navigation to trip modules

---

### Trip Management

* Create trip
* Edit trip
* Delete trip
* Search trips
* View trip details
* Manage members and admins

---

### Itinerary Planning

* Timeline-based itinerary view
* Create itinerary events
* Edit itinerary events
* Delete itinerary events
* Event status tracking

---

### Expense Tracking

* Add expenses
* Edit expenses
* Delete expenses
* Expense summaries
* Balance tracking
* Settlement visualization

---

### Polls

* Create polls
* Vote on polls
* View results
* Poll expiration tracking

---

### Gallery

* Upload images
* View trip gallery
* Emoji reactions
* Delete images

---

### Notifications

* View invitations
* Accept invitations
* Reject invitations
* Notification center

---

## Project Structure

frontend/

├── public/

├── src/

│   ├── assets/

│   ├── common/

│   ├── components/

│   ├── context/

│   ├── layouts/

│   ├── pages/

│   ├── services/

│   ├── routes/

│   ├── utils/

│   ├── App.jsx

│   └── main.jsx

├── package.json

└── vite.config.js

---

## Theme System

The project uses a centralized theme configuration.

Location:

src/common/common.js

This file contains:

* Colors
* Typography
* Border radius
* Shadows
* Spacing
* Shared component styles

All pages and components consume values from this file to maintain consistent styling throughout the application.

---

## Installation

Install dependencies:

npm install

Run development server:

npm run dev

Create production build:

npm run build

Preview production build:

npm run preview

---

## Main Pages

### Authentication

* Login
* Register

### Dashboard

* Trip overview
* Invitations
* Quick actions

### Trip Details

* Trip information
* Members
* Admin controls

### Itinerary

* Timeline view
* Event management

### Expenses

* Expense management
* Settlement tracking

### Polls

* Poll creation
* Voting
* Results

### Gallery

* Image management
* Reactions

### Profile

* User information
* Account settings

---

## API Integration

The frontend communicates with backend services through dedicated service modules.

Examples:

* authService
* tripService
* itineraryService
* expenseService
* pollService
* galleryService
* notificationService
* settlementService

---

## User Roles

### Admin

Can:

* Edit trip details
* Manage members
* Create itinerary events
* Manage expenses
* Create polls
* Delete trip resources

### Member

Can:

* View trip information
* Participate in polls
* View itineraries
* Add permitted expenses
* Upload gallery images
* React to images

---

## Animations

The application uses Framer Motion for:

* Page transitions
* Drawers
* Modals
* Timeline interactions
* Notification animations

---

## Design Goals

* Clean and modern interface
* Travel-focused experience
* Collaborative workflow
* Consistent visual design
* Easy navigation
* Responsive layouts

---

## Future Improvements

* Real-time notifications
* Real-time poll updates
* Real-time expense synchronization
* Offline support
* Advanced trip analytics
* Mobile application

---

## Author

Developed as the frontend interface for a collaborative group travel planning platform that helps users organize trips, manage expenses, coordinate activities, and share memories in one place.
