# Project Documentation

This document provides a comprehensive overview of the project, including its structure, dependencies, and setup instructions.

## 1. Project Overview

This project is a web application with a frontend built using React, Vite, and TypeScript, and a backend that is currently under development.

## 2. Frontend

The frontend is a single-page application built with modern web technologies.

### 2.1. Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web development.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **@mui/material:** A popular React UI framework.
- **Redux Toolkit:** The official, opinionated, batteries-included toolset for efficient Redux development.
- **React Router:** For declarative routing in React applications.
- **Stripe:** For handling payments.
- **Axios:** A promise-based HTTP client for the browser and Node.js.
- **Formik & Yup:** For building forms and handling validation.
- **ESLint & Prettier:** For code linting and formatting.
- **Jest & React Testing Library:** For testing.

### 2.2. Project Structure

The frontend source code is located in the `lovable-project/frontend/src` directory.

```
lovable-project/frontend/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── pages/
│   │   ├── analyses/
│   │   │   └── AnalysisForm.tsx
│   │   ├── auth/
│   │   ├── orders/
│   │   └── payments/
│   │       └── PaymentForm.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── store/
├── package.json
├── vite.config.ts
└── ...
```

- **`src/main.tsx`**: The entry point of the application.
- **`src/App.tsx`**: The main application component.
- **`src/pages`**: Contains the different pages of the application.
- **`src/services`**: Contains services for interacting with APIs.
- **`src/store`**: Contains the Redux store configuration.

### 2.3. Available Scripts

In the `lovable-project/frontend` directory, you can run the following commands:

- `npm install`: Installs the project dependencies.
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.
- **`npm test`**: Runs the tests.
- **`npm run lint`**: Lints the code.
- **`npm run format`**: Formats the code.

## 3. Backend

The backend for this project is located in the `lovable-project/backend` directory. It is currently under development and the directory is empty.

## 4. Getting Started

To get the frontend up and running, follow these steps:

1.  Navigate to the `lovable-project/frontend` directory:
    ```bash
    cd lovable-project/frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
