# Project Tracker

---

## Table of Contents

1. [Planned MVP Features](#planned-mvp-features)
2. [Planned Features](#planned-features)
3. [Bugs](#bugs)
4. [Notes](#notes)
5. [Todo](#todo)

---

## Planned MVP Features

---

### 1. User Profiles

#### Subtasks

- [x] Implement sign-up and login functionality using Remix and Prisma.
- [x] Create data schema for storing user profiles in Prisma.
- [x] Develop frontend components for personal bio and genre preferences using
      Remix and Tailwind.
- [ ] Implement API for CRUD operations on user profiles and books list.
- [ ] Add a wishlist feature where users can add books they'd like to read.

---

### 2. Book Listings

#### Subtasks

- [x] Create Prisma schema for book listings.
- [ ] Develop API endpoints to add a new book, including uploading photos and
      metadata.
- [ ] Create frontend components for adding and editing book listings.
- [ ] Implement a toggle feature to mark a book as 'Available for Swap' or
      'Wishlist'.

---

### 3. Search & Filter Options

#### Subtasks

- [ ] Implement a basic search algorithm to find books or users.
- [ ] Develop API endpoints for search and filter functionalities.
- [ ] Create frontend UI components for search and filtering.

---

### 4. Swap Requests & Messaging

#### Subtasks

- [x] Create Prisma schema for swap requests and messages.
- [ ] Implement API for sending and receiving swap requests.
- [ ] Develop a simple real-time messaging or chat system.
- [ ] Create frontend components for swap requests and messaging.

---

### 5. Location-based Matching

#### Subtasks

- [ ] Investigate geolocation services suitable for local matching.
- [ ] Develop API endpoints for geolocation-based search.
- [ ] Create frontend components to display books available for swap nearby.

---

### 6. Reviews & Ratings

#### Subtasks

- [x] Create a Prisma schema for storing user reviews and ratings.
- [ ] Implement API endpoints for posting and retrieving ratings.
- [ ] Create frontend UI for users to rate each other after a swap.

---

### 7. Safety Guidelines

#### Subtasks

- [ ] Draft safety guidelines for safe meetups and transactions.
- [ ] Create frontend components to display safety guidelines during the swap
      process.

---

### 8. Basic Notifications

#### Subtasks

- [ ] Implement backend logic for sending notifications using Fly.io.
- [ ] Create frontend notification UI.
- [ ] Develop API endpoints for notifications.

---

## Planned Features

---

### Feature 1: User Profiles

#### Subtasks

- [x] Create the data schema in Prisma for user information
- [ ] Implement the API endpoints for CRUD operations on user profiles using
      Node.js/Remix
- [ ] Develop the frontend components in Remix and Tailwind
- [ ] Add integration tests for user profile operations

---

### Feature 2: Book Listings

#### Subtasks

- [x] Create the data schema in Prisma for book listings
- [ ] Implement API endpoints for CRUD operations on book listings
- [ ] Create frontend components using Remix and Tailwind
- [ ] Develop an option for users to report unsatisfactory book conditions
- [ ] Add integration tests for book listing features

---

### Feature 3: Search & Filter Options

#### Subtasks

- [ ] Design the search algorithm for genre, author, title, etc.
- [ ] Implement the API for search functionality
- [ ] Create UI components for search and filters
- [ ] Optimize database queries using SQLite indexes for efficient search

---

### Feature 4: Location-based Matching

#### Subtasks

- [ ] Investigate third-party libraries or APIs for geolocation services
- [ ] Implement geolocation-based search in the backend
- [ ] Integrate with the frontend, showcasing nearby books
- [ ] Optimize for performance and costs on Fly.io

---

### Feature 5: Swap Requests & Messaging

#### Subtasks

- [x] Create data schema in Prisma for messages and swap requests
- [ ] Implement API endpoints for messaging and swap requests
- [ ] Develop frontend components for real-time messaging and notifications
- [ ] Write tests for messaging and swap requests

---

### Feature 6: Reviews & Ratings

#### Subtasks

- [ ] Create the data schema in Prisma for reviews and ratings
- [ ] Implement API for posting and retrieving reviews
- [ ] Develop frontend UI for submitting and viewing reviews
- [ ] Write tests for review features

---

### Feature 7: Environmental Impact Tracker

#### Subtasks

- [ ] Research algorithms for calculating environmental savings
- [ ] Implement backend logic for tracking
- [ ] Develop frontend UI for displaying impact
- [ ] Write tests for impact calculations

---

### Feature 8: Barcode Scanner

#### Subtasks

- [ ] Investigate libraries for barcode scanning
- [ ] Implement barcode scanning feature in the frontend
- [ ] Integrate with backend to quickly add books
- [ ] Write tests for barcode scanning

---

### Feature 9: Virtual Bookshelf

#### Subtasks

- [ ] Create data schema in Prisma for virtual bookshelf
- [ ] Implement API endpoints for managing the virtual bookshelf
- [ ] Develop frontend UI components
- [ ] Write tests for virtual bookshelf features

---

### Feature 10: Community Features

#### Subtasks

- [ ] Create data schema in Prisma for book clubs and discussion groups
- [ ] Implement API endpoints for community features
- [ ] Develop frontend components for book clubs and discussion groups
- [ ] Write tests for community features

---

### Feature 11: Recommendation System

#### Subtasks

- [ ] Design recommendation algorithm based on user data and activity
- [ ] Implement recommendation logic in the backend
- [ ] Develop frontend UI for displaying recommendations
- [ ] Write tests for recommendation features

---

### Feature 12: Donation Integration

#### Subtasks

- [ ] Research payment gateway APIs
- [ ] Implement donation functionality in backend
- [ ] Develop frontend UI for donations
- [ ] Write tests for donation features

---

### Feature 13: Safety Guidelines

#### Subtasks

- [ ] Research and write safety guidelines
- [ ] Develop frontend UI for displaying safety guidelines
- [ ] Implement verified user badges in Prisma schema and frontend UI
- [ ] Write tests for safety features

---

### Feature 14: Tutorials & Onboarding

#### Subtasks

- [ ] Design onboarding experience
- [ ] Develop frontend UI for tutorials
- [ ] Implement onboarding logic in the backend
- [ ] Write tests for onboarding and tutorials

---

### Feature 15: Events Calendar

#### Subtasks

- [ ] Create data schema in Prisma for events
- [ ] Implement API endpoints for events
- [ ] Develop frontend components for the events calendar
- [ ] Write tests for event features

---

### Feature 16: Integration with External Platforms

#### Subtasks

- [ ] Research APIs for platforms like Goodreads
- [ ] Implement data import/export feature in the backend
- [ ] Develop frontend UI for external integration
- [ ] Write tests for external integration features

---

### Feature 17: Accessibility Features

#### Subtasks

- [ ] Investigate best practices for accessibility
- [ ] Implement voice-over, high contrast theme, adjustable font size
- [ ] Develop frontend UI components for accessibility
- [ ] Write tests for accessibility features

---

### Feature 18: Regular Updates

#### Subtasks

- [ ] Design data schema for updates and notifications
- [ ] Implement API endpoints for sending and receiving updates
- [ ] Develop frontend UI for displaying updates
- [ ] Write tests for update features

---

## Bugs

### BUG-001: Login Button Not Responsive

- **Status**: Open
- **Priority**: Low
- **Description**: Its possible for a user to have multiple active sessions

---

## Notes

- Consider implementing CI/CD for automated tests and deployments.
- Ask @larister to review some of the code so far

---

## TODO list

- [] develop CRUD API for all data models
- [] squash dev commits to eliminate deploy testing litter
- [] configure eslint to order imports akin to CI
- [] navbar dropdown icons
- [] find out SQL join for user -> roles
- [] add user nav config to conditionally render nav items
- [] split root layout into separate components
- [] use [open library](https://covers.openlibrary.org/w/id/6979861-M.jpg) for
  book cover images; create a service that fetches them on upload
- [] use goodreads api to add descriptions to added books; create a service that
  fetches them on upload
- [] build out concept of a "suggest me a book" based on reading/swap history.
  Is there an api for this?
- [] research: can the app be integrated with goodreads accounts?
