# User CRUS application with NextJS

## Description

This project is a Next.js application designed to implement a User CRUD (Create, Read, Update, Delete) system. It features a standard CRUD pattern, allowing users to securely manage user data through a user-friendly interface. The backend API is built using json-server and is accessible only through its API endpoints.

### Features
- Create User: Securely add new users with validation.
- Read User:   Fetch and display user data.
- Update User: Modify existing user information.
- Delete User: Remove users from the database.
- Search User: Search users and pagination.

### Technology Stack
- Frontend: Next.js
- Backend: json-server

## Pay attention

Dear Reviewers,

I have documented some of my decisions and approaches in the project. I have included contexts regarding Git usage, instructions on how to run the software, and potential improvements if more time were available. I also answered to questions in the challenge file at the end of this file.

Please review the documentation in detail. I look forward to discussing this application with you and receiving your feedback.

## Installation

```bash
$ npm install
```

Please don't forget to create a `.env` file in the root of the project from the `.env.example` file. You are free to change the port. If you change the mock server API or Next.js `PORT`, make sure to use the correct URL for each of them. For instance, if you run the mock server on port 5000, please update the appropriate setting in the `.env` file. Similarly, if you change the Next.js `PORT` setting in the `.env` file, you need to use that port in the browser to open the application.

## Running the app

```bash
# To run the API
npx json-server ./src/__mocks__/db.json

# development mode
$ npm run dev

# watch mode
$ npm run start

# To build the project
$ npm run build
```

## Test

```bash
# unit tests
$ npm run test
```

## Project Structure

### Packages
```bash
React Query # Data fetching from the server and managing data and cache
Jest # Testing framework
React testing library # Component and integration test
flowbite-react # UI component library
axios # Validation library for requests
zod # Validation library for requests
json-server # Mock API server
neverthrow # Handling failures and errors.
inversify # inversion of control (IoC) container
```

### Root directory
```bash
components: # To keep components that are used in all modules, such as the UI library clone, React Query provider, etc. If a component belongs to a specific module, it should be in the components folder within its own module folder.
contexts # To keep different contexts like invis(Back-end)
modules # To keep different modules like invis(Front-end)
shared # To keep different parts which could be used in all parts of the application. The types, interfaces, and validation objects can be used across contexts and modules.
infrastructure # To keep infrastructures important files
```

### contexts directory
```bash
shared # To keep different parts which are shared in the contexts
Other # To keep different contexts like invis
```

### modules directory
```bash
shared # To keep different parts which are shared in the module
other # To keep different module like invis
```

Each context has its own application, infrastructure, and domain directory to keep different parts of that specific context like handler, controllers, usecases, etc.

Each module has its own hooks, components, pages, services and types directory to keep different parts of that specific module.

## Git structure

There are two different branches. The first branch is master, the second branch is development. I made feature branch locally which will be added to the development branch with all commits(linier) and from the development branch will be merged into master branch for each separated functionality which contains all commits in single commit(squash). In this way we will have a more cleaner master branch so if something gets wrong in the master we are simply able to revert to the last version with one single revert command.

I didn't add a demo branch because I think these two branches are enough for a simple code challenge.

## State management
Given my experience in developing traveling API and CRM systems, I approached this project for Invis, a travel company, with a focus on efficient server interaction. Recognizing the importance of interacting with the server, I chose to utilize a server-side state management tool instead of a client-side tool like Redux. For this purpose, I implemented React Query, which excels in managing and caching data based on specific conditions, making it a superior choice for this application.

## Performance optimizations
To enhance performance, I implemented several key strategies:

- Caching with React Query: 
By leveraging React Query for data caching, we minimize unnecessary server requests. This approach ensures that data remains fresh and is re-fetched based on specific conditions, significantly improving performance.

- Server-Side and Client-Side Rendering:
 Utilizing a combination of server-side and client-side rendering in Next.js allows us to optimize for both initial load times and client interactions. Components that do not require client-side hooks are designated as server components, benefiting from the fast responses server rendering provides.

- Code Splitting:
Implementing code splitting divides our application into smaller bundles that are only loaded when needed. This technique reduces data transfer and execution time, leading to faster performance. Server components also benefit from automatic code-splitting by route segments, ensuring only the necessary code for the current route is loaded during navigation.

- Prefetching: 
Preloading data and resources for anticipated user actions.

- Partial Rendering: 
Rendering only the visible portion of the UI to reduce initial load times.

- Soft Navigation:
Enhancing navigation speed by keeping the app state consistent and avoiding full page reloads.

- Client-Side Search:
Implementing search functionality on the client side to reduce server load and provide faster results.

These strategies collectively contribute to a highly performant application, reducing load times and improving user experience. More details on these techniques will be covered in the presentation.

### Summary of Performance Techniques:
- Code Splitting
- Prefetching
- Caching
- Partial Rendering
- Soft Navigation
- Client-Side Search

## Running the Application

### Start the Backend API:
Ensure the backend API is running first. The mock server will be accessible on port 3000.

### Verify API:
Open your browser and navigate to http://localhost:3000/users to verify that the server is responding with the list of users provided by the mock server.

### Start the Next.js Application:
Run the Next.js application to view the frontend. By default, it will be available on port 3001. Navigate to http://localhost:3001 to see the user list view page.

### Check for Port Conflicts:
If port 3001 is not available, check the command line for the port being used by Next.js and use that port number to view the application.

## Tracing the Request (RQ) and Response (RS) Flow in the API Route
In the Next.js API route, the request and response flow follows a structured approach to ensure clarity, maintainability, and separation of concerns. Below is the detailed explanation of each component involved in this flow:

### 1. Handlers
#### Purpose: Handles incoming HTTP requests.
#### Location: api directory.
#### Function: Each handler is responsible for:
- Receiving the incoming request.
- Validating the request using a Zod schema.
- Calling the appropriate use case to execute part of the domain logic.
#### Responsibilities:
- Handle the entry request.
- Validate the request.
- Proceed with the request if validation is successful.
- Create and send the response after invoking the corresponding use case.
Limitations:
- Handlers should not include error handling or business logic.
User permissions, authorization, and similar checks are not part of handler duties.

### 2. Use Cases
#### Purpose: Implement the application logic.
#### Function of Each use case:
- Executes a method from the service.
- Returns the result if everything is successful.
- Converts domain errors into appropriate HTTP error messages if something goes wrong.
####  Benefits:
- Increased flexibility in developing specific domains.
- Improved readability.
- Easier testing and maintenance.


### 3. Service
Purpose: Manages interactions with the mock server and prepares the result data.

#### Function: 
The service layer interacts directly with the mock server to fetch, update, or delete data.
#### Design Choice:
Data mappers are not used in this software due to the simplicity and clarity of the data interactions.

## Module structure

Each module responsible for managing a specific section of the application includes the following parts:

- **components**: Contains the React components specific to that module.
- **hooks**: Contains React Query hooks and mutations to manage data fetching and state.
- **pages**: Contains the React pages for each part of the module.
- **services**: Functions to interact with the API routes.
- **types**: Defines static types that shape the data object structure used within the module.


This choice avoids unnecessary complexity and keeps the codebase straightforward.
By organizing the request and response flow into these three components, we achieve a clear separation of concerns, making the codebase easier to maintain, test, and extend. This structure ensures that each part of the application has a single responsibility, enhancing overall code quality and developer productivity.

## Configurations

### Zod Validation

Purpose: Validates incoming data structures to ensure they meet the API's expectations before processing.

## Testing

This project adopts a robust testing strategy that includes all unit, component and also integration tests, ensuring that all individual components function as expected and that the system works as a whole from a user’s perspective.

### Unit Tests

- Purpose: Unit tests are designed to test individual pieces of code in isolation, primarily focusing on small functions or modules. The goal is to ensure that each part performs as expected independently of others.

- Location: Unit tests are located next to their respective source files in the src directory, following the convention of naming test files with a .spec.ts/tsx suffix. This proximity helps in maintaining and navigating related source and test files.

Example Structure:

```bash
src/
├── contexts/
    ├── invis/
        ├── domain/
            ├── services/
                ├── UserRepository.ts
                ├── UserRepository.spec.ts
```
Key Technologies: 

These tests leverage Jest and react testing library as the testing framework, utilizing features such as mocks and spies to isolate dependencies.

#### Running Tests

- Unit Tests: Run with `npm run test`, which executes all .spec.ts files across the src directory.

## HTTP methods to interact with the server:

## End point with the mock server to interact with Postman

These endpoints will be invoked by the Nextjs API route.

#### Get method /users

- This endpoint returns all users in an array.

#### POST requests /users
- To add a new user.

#### GET requests /users/:id
- To get a specific user data.

#### PATCH requests /users/:id
- To update a specific user data.

#### DELETE requests /users/:id
- To delete a specific user data.

#### Mock user
Here is a mock user object to be used for CRUD operations:
```bash
{
    "id": "1",
    "name": "Amir haghighi",
    "username": "Bret",
    "email": "Sincere@april.biz"
  }
```

To update and delete a user you don't need to pass the id and it should be passed as a URL parameter.

## NextJs API routes:
In this application we have the end points below:
- GET: /api/invis/users  To get all users
- GET  /api/invis/users/:id To get a specific user data
- POST /api/invis/users/add/:id To add a new user
- PATCH /api/invis/users/update/:id To update a user
- DELETE /api/invis/users/delete/:id To add a user

## Scalability and Performance Optimization
- Horizontal Scaling
- Caching
- Database Optimization(Like indexing and query optimization)
- Content Delivery Network (CDN)
- Microservices Architecture
- Server-Side Rendering (SSR) and Static Site Generation (SSG) or maybe ISR if needed

## Handling Performance Bottlenecks
To address performance bottlenecks and ensure the application remains responsive under high load, I consider the following strategies as general strategies:
- Profiling and Monitoring
- Code Optimization
- Efficient Data Fetching
- Async and Deferred Loading
- Optimize Database Access

## What about if I had more time?
If given more time, the following improvements would be implemented to enhance the project's robustness, maintainability, and scalability:
- More tests + E2E tests with Cypress
- Docker for containerization
- CI/CD pipeline
- A better error handler for converting domain exceptions to HTTP exceptions
- Adding a logger to log RQ and RS in DB(using a logging library like Winston or Bunyan) or somewhere else like DD

We can discuss these concerns and techniques in more detail during our meeting.

I am looking forward to discussing this with you later this week.

Best regards,
Amir.
