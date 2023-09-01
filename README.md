# Project Tracker

---

## Table of Contents

1. [Overview](#overview-unleash-your-inner-bookworm-with-storyswap)
2. [AWS and AI](#aws-and-ai-supercharging-storyswap)
3. [Development Timeline](#development-timeline)
4. [StorySwap MVP Features](#storyswap-mvp-features)
5. [StorySwap AI-Enhanced Features](#storyswap-ai-enhanced-features)
6. [Beyond MVP: Final Version Features](#beyond-mvp-final-version-features)
7. [Integrating AWS Services with Fly.io for Remix App](#integrating-aws-services-with-flyio-for-remix-app)
8. [Bugs](#bugs)
9. [Notes](#notes)
10. [Todo list](#todo-list)

## Overview: Unleash Your Inner Bookworm with StorySwap! 📚

Swap your read books for new adventures, connect with fellow book lovers, and
get personalized book recommendations—all in one app! Discover the joy of
sharing stories today.

---

## StorySwap: Where Stories Find a New Home

---

### Purpose

StorySwap aims to revolutionize the way we read, share, and experience books.
Forget the days of dusty bookshelves and forgotten novels. StorySwap is a
platform designed for avid readers and casual bibliophiles alike to swap books
with others in their community.

### Benefits

1. **Discover Hidden Gems**: Browse through an extensive list of books from
   other readers in your area. You might find your next favorite read just a
   block away!

2. **Sustainability**: Swap, don't shop! Reduce environmental impact by
   extending the life cycle of books.

3. **Community Building**: Join book clubs and discussion groups to connect with
   like-minded individuals.

4. **Personalized Recommendations**: Get recommendations based on your
   preferences and reading history.

5. **Safety**: Safety guidelines and verified profiles ensure secure
   transactions.

### Unique Selling Points (USP)

1. **Location-based Matching**: Find books and book lovers close to you, making
   swaps convenient and community-centric.

2. **Wishlist Feature**: Can't find the book you're looking for? Add it to your
   wishlist and get notified when it becomes available.

3. **Environmental Impact Tracker**: See how your swapping activities are
   contributing to a greener planet.

4. **Integrated Messaging**: Negotiate swaps and make plans without leaving the
   app.

5. **Events Calendar**: Stay updated on local book-related events, from author
   visits to book club meetings.

[Back to Top](#table-of-contents)

---

## AWS and AI: Supercharging StorySwap

### Benefits of AWS Integration

1. **Scalability**: Leveraging AWS services ensures that StorySwap can easily
   scale as the user base grows.

2. **Security**: AWS's robust security protocols help safeguard user data and
   transactions.

3. **Data Analytics**: Utilize AWS's powerful analytics tools to gain insights
   into user behavior, aiding in data-driven decision-making.

4. **Unified Management**: Centralize application services, from database to
   notifications, streamlining administration and reducing operational
   complexity.

5. **Cost Efficiency**: Take advantage of bundled AWS services and potential
   discounts to minimize operating costs.

### Benefits of AI Integration

1. **Personalized Recommendations**: AI algorithms analyze reading habits and
   preferences to provide custom book recommendations.

2. **Chat Support**: AI-powered chatbots can offer immediate customer service,
   answering queries and troubleshooting issues.

3. **Advanced Search**: Machine learning enhances search algorithms, making them
   more precise and context-aware.

4. **Resource Allocation**: AI helps optimize server usage and other resources,
   further cutting down operational costs.

### Unique Selling Points (USP) with AWS & AI

1. **Real-Time Analytics**: Use AWS and AI for real-time user analytics,
   enhancing UX by understanding behavior patterns.

2. **Automated Moderation**: AI can automatically screen book listings and user
   interactions for any inappropriate content.

3. **AI-Powered Community Building**: AI can identify common interests among
   users, suggesting book clubs or reading circles they might be interested in.

4. **Cost Predictions**: AI can forecast server load and other costs, helping in
   budget planning.

5. **Secure Transactions**: AWS's proven security services combined with
   AI-driven fraud detection make for exceptionally secure swaps and
   transactions.

[Back to Top](#table-of-contents)

---

## AWS Services for StorySwap AI-Enhanced Features

### 1. Personalized Book Recommendations

- **Amazon Personalize**: Provides real-time and batch recommendations. You can
  train the recommendation engine based on your users' behavior.

### 2. Book Synopsis Summarization

- **Amazon Comprehend**: Natural Language Processing (NLP) service that could be
  adapted for text summarization. While not a direct summarization service, its
  key phrase extraction could be a starting point.

### 3. Real-time Chatbot Support

- **Amazon Lex**: Provides the advanced deep learning functionalities of
  automatic speech recognition (ASR) for converting speech to text, and natural
  language understanding (NLU).

### 4. Sentiment Analysis for Reviews

- **Amazon Comprehend**: Offers sentiment analysis as one of its capabilities.
  You can directly plug it into your review system.

### 5. Language Translation for Global Reach

- **Amazon Translate**: Real-time and batch language translation service that
  could help in translating content dynamically.

### 6. Image Recognition for Book Condition

- **Amazon Rekognition**: Ideal for image analysis and can be trained to
  recognize conditions of books based on images.

### 7. Predictive Text in Search and Messaging

- **AWS Lambda + API Gateway**: While AWS doesn't offer a direct service for
  predictive text, you can build a microservice using Lambda functions triggered
  by API Gateway to handle this.

### 8. Voice Search Functionality

- **Amazon Transcribe**: Can convert voice to text and can be used in
  conjunction with search functionalities.

### 9. Environmental Impact Estimation

- **AWS SageMaker**: For custom machine learning models that can estimate
  environmental impacts.

### 10. OCR for Quick Book Details Input

- **Amazon Textract**: Can extract text and data from scanned documents.

---

### Why These Services?

- **Ease of Integration**: All these services are designed to be plug-and-play
  to some extent, reducing the need for extensive machine learning expertise.
- **Scalability**: AWS services are built to scale, fitting both small and large
  applications.
- **Comprehensive SDKs**: AWS SDKs often have good support for popular
  languages, including JavaScript/TypeScript.

[Back to Top](#table-of-contents)

---

## Development Timeline

## Phase 1: Setting Up Infrastructure & Basic Features

### Week 1-2: Initial Setup

1. **AWS & Fly.io Integration**
   - Get the app deployed on Fly.io and establish connections to AWS services,
     as needed.

### Week 3-4: User Profiles & Safety

1. **User Profiles (MVP & Planned)**
   - Implement sign-up and login, create data schema in Prisma.
2. **Safety Guidelines (MVP)**
   - Draft and display safety guidelines, essential for early adopters.

### Week 5-6: Basic Book Interactions

1. **Book Listings (MVP & Planned)**
   - Develop CRUD operations for book listings and API endpoints.
2. **Wishlist Feature (MVP)**
   - Implement a basic wishlist feature for user profiles.

---

## Phase 2: Enhancing User Experience

### Week 7-9: Search & Filters

1. **Search & Filter Options (MVP & Planned)**
   - Implement basic search algorithm and API endpoints.

### Week 10-12: Messaging & Swap Requests

1. **Swap Requests & Messaging (MVP & Planned)**
   - Develop API for swap requests and a simple real-time messaging system.

---

## Phase 3: Additional Features & Usability

### Week 13-15: Location and Reviews

1. **Location-based Matching (MVP & Planned)**
   - Investigate geolocation services and implement them.
2. **Reviews & Ratings (MVP & Planned)**
   - Implement the API for ratings and create the frontend UI.

### Week 16-18: Community and More

1. **Community Features (Planned)**
   - Implement book clubs and discussion groups.
2. **Notification System (MVP)**
   - Implement backend logic for notifications using Fly.io.

---

## Phase 4: Advanced Features & Optimization

### Week 19-21: Advanced Features

1. **Environmental Impact Tracker (Planned)**
   - Begin work on environmental impact tracking.
2. **Recommendation System (Planned)**
   - Design and implement a recommendation algorithm.

### Week 22-24: Final Testing & Debugging

1. **Integration Tests**
   - Implement integration tests for all features.
2. **Performance Optimization**
   - Optimize for performance, especially if using AWS and Fly.io together.

[Back to Top](#table-of-contents)

---

## StorySwap MVP Features

### 1. User Profiles

#### Subtasks

- [ ] Implement sign-up and login functionality using Remix and Prisma.
- [ ] Create data schema for storing user profiles in Prisma.
- [ ] Develop frontend components for personal bio and genre preferences using
      Remix and Tailwind.
- [ ] Implement API for CRUD operations on user profiles and books list.
- [ ] Add a wishlist feature where users can add books they'd like to read.

---

### 2. Book Listings

#### Subtasks

- [ ] Create Prisma schema for book listings.
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

- [ ] Create Prisma schema for swap requests and messages.
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

- [ ] Create a Prisma schema for storing user reviews and ratings.
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

[Back to Top](#table-of-contents)

---

## StorySwap AI-Enhanced Features

---

### 1. Personalized Book Recommendations

#### Subtasks

- [ ] Research and choose an AI-based recommendation engine API that fits the
      project requirements.
- [ ] Implement API integration in the backend using Node.js and Prisma.
  - [ ] Set up API endpoints to fetch recommendations.
- [ ] Develop frontend UI components using React and Tailwind to display
      personalized book recommendations.
  - [ ] Create a 'Recommended Books' section on the user dashboard.

---

### 2. Book Synopsis Summarization

#### Subtasks

- [ ] Evaluate available text summarization APIs.
- [ ] Implement the chosen API in the backend.
  - [ ] Create an endpoint that sends a book's full description and receives the
        summary in return.
- [ ] Update the front-end book listing component to display the summarized
      synopsis.
  - [ ] Add a toggle switch to view full description or summary.

---

### 3. Real-time Chatbot Support

#### Subtasks

- [ ] Identify a chatbot API that can be easily integrated and customized.
- [ ] Integrate the chatbot API into the backend.
- [ ] Design and implement frontend UI for the chatbot overlay using React and
      Tailwind.
  - [ ] Implement UI logic to open and close the chatbot window.

---

### 4. Sentiment Analysis for Reviews

#### Subtasks

- [ ] Research sentiment analysis APIs that can analyze text reviews.
- [ ] Integrate the chosen API in the backend.
  - [ ] Update review endpoints to also return sentiment scores.
- [ ] Modify the frontend review display to include sentiment score, possibly as
      a visual indicator.
  - [ ] Implement this as a separate React component.

---

### 5. Language Translation for Global Reach

#### Subtasks

- [ ] Identify a language translation API.
- [ ] Backend implementation to support multiple languages.
  - [ ] Include language preference in user profile data.
- [ ] Implement a language toggle on the frontend.
  - [ ] Use React's context or another state management solution to switch
        languages dynamically.

---

### 6. Image Recognition for Book Condition

#### Subtasks

- [ ] Research image recognition APIs that can assess book conditions.
- [ ] Implement chosen API in the backend.
  - [ ] Add an endpoint for image analysis results.
- [ ] Modify the book listing UI to include a visual indicator of book condition
      based on image recognition.
  - [ ] Update the book listing React component.

---

### 7. Predictive Text in Search and Messaging

#### Subtasks

- [ ] Find a predictive text API suitable for web applications.
- [ ] Integrate the API in the backend.
  - [ ] Update search and messaging endpoints to include predictive text
        options.
- [ ] Implement predictive text in the frontend search and chat components.
  - [ ] Use async features in React for real-time suggestions.

---

### 8. Voice Search Functionality

#### Subtasks

- [ ] Research voice recognition APIs compatible with web applications.
- [ ] Implement chosen API in the backend.
  - [ ] Create an endpoint for voice-to-text results.
- [ ] Design and implement a voice search button in the frontend UI.
  - [ ] Update the search bar component to include a microphone icon for voice
        search.

---

### 9. Environmental Impact Estimation

#### Subtasks

- [ ] Find or develop a basic machine learning model to estimate environmental
      impact.
- [ ] Integrate this model into the backend.
  - [ ] Create an endpoint to fetch environmental impact estimates.
- [ ] Add an "Environmental Impact Tracker" dashboard in the frontend.
  - [ ] Create a separate React component for this feature.

---

### 10. OCR for Quick Book Details Input

#### Subtasks

- [ ] Research available OCR APIs.
- [ ] Integrate the chosen OCR API in the backend.
  - [ ] Create an endpoint to send images and receive text data.
- [ ] Implement a camera scan option in the frontend to capture book details.
  - [ ] Add a 'Scan' button in the book listing form to trigger the camera.
  - [ ] Automatically populate form fields with scanned data.

[Back to Top](#table-of-contents)

---

## Beyond MVP: Final Version Features

### Feature 1: User Profiles

#### Subtasks

- [ ] Create the data schema in Prisma for user information
- [ ] Implement the API endpoints for CRUD operations on user profiles using
      Node.js/Remix
- [ ] Develop the frontend components in Remix and Tailwind
- [ ] Add integration tests for user profile operations

---

### Feature 2: Book Listings

#### Subtasks

- [ ] Create the data schema in Prisma for book listings
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

- [ ] Create data schema in Prisma for messages and swap requests
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

[Back to Top](#table-of-contents)

---

## Integrating AWS Services with Fly.io for Remix App

### Table of Contents

1. [Integrating AWS with Fly.io](#integrating-aws-with-flyio)
2. [Hosting on AWS](#hosting-on-aws)
3. [Blending the Two](#blending-the-two)
4. [Recommendations](#recommendations)

---

## Integrating AWS with Fly.io

### Considerations

1. **SDKs and APIs**

   - Utilize AWS SDKs or APIs within your app, deployed on Fly.io, to interact
     with AWS services.

2. **Security**

   - Securely store AWS credentials as environment variables or use services
     like AWS Secrets Manager.

3. **Networking**

   - Ensure network permissions and firewall settings on both sides (AWS and
     Fly.io) allow for necessary interactions.

4. **Data Transfer Costs**

   - Be aware that using AWS services while hosting elsewhere can incur
     additional data transfer costs.

5. **Monitoring**
   - AWS provides CloudWatch for detailed monitoring, but you may need multiple
     monitoring solutions for full observability.

---

## Hosting on AWS

### Considerations

1. **Unified Management**

   - Simplifies administration, scaling, and monitoring.

2. **Cost Optimization**

   - Lower internal data transfer costs and potential bundled service pricing.

3. **Integrated Services**

   - AWS services are tightly integrated with each other for seamless data and
     service flow.

4. **Vendor Lock-in**
   - AWS services often work best with each other, leading to potential vendor
     lock-in.

---

## Blending the Two

### Considerations

1. **Best of Both Worlds**

   - Use Fly.io for edge deployments and AWS for its rich ecosystem of services.

2. **Complexity**

   - May result in more complex system architecture and data flow.

3. **Cost Analysis**
   - Balancing resources across two platforms may require more stringent cost
     monitoring.

---

## Recommendations

1. If you’re happy with Fly.io, you can easily integrate AWS services into your
   Fly.io-deployed application.

2. If you foresee the need for multiple, tightly-integrated AWS services,
   consider migrating to AWS.

[Back to Top](#table-of-contents)

---

## Bugs

### BUG-001: Login Button Not Responsive

- **Status**: Open
- **Priority**: Low
- **Description**: Its possible for a user to have multiple active sessions

[Back to Top](#table-of-contents)

---

## Notes

- Consider implementing CI/CD for automated tests and deployments.
- Ask @larister to review some of the code so far

[Back to Top](#table-of-contents)

---

## Todo list

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
- [] BUG: books index calls loader many times, repeating the same if logging out
  from that page. Why?
- [] book list can have author/genre/condition link to a search page revealing
  more of the same
- [] list pages need filters
- [] research: can we integrate with a courier service, printing delivery
  labels, organising book pick ups etc
- [] why do the constants not hot reload on change?
- [] add meta functions to all routes
- [] community/history models/api
- [] about page model/api
- [] welcome index model/api
- [x] deleting book search string creates an infinite loop of requests that I
      think remix eventually halts; how can I circumvent this? On every change
      in search term, the loader should only run once. Required revalidation
      prevention!
- [] passport.js for SSOs
- [] convert prisma to SQL statements
- [] use
  [Wes Bos CSS hack](https://twitter.com/wesbos/status/1696899705471426982)

[Back to Top](#table-of-contents)
