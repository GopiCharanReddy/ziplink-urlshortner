# ZipLink - URL Shortener

A modern URL shortening service built with React and Node.js that allows users to create shorter, more manageable links.

## About The Project

ZipLink is a full-stack URL shortening service designed to transform long, unwieldy web addresses into short, memorable links. This repository contains the frontend application, built with React, which provides a user-friendly interface for creating and managing your links.

Users can sign up for an account, generate short URLs, and view analytics on how many clicks each link receives. The project emphasizes a modern, secure, and seamless user experience, featuring a sleek dark theme and robust JWT-based authentication.

## Features

-   **User Authentication**: Secure sign-up and sign-in functionality using JWT (Access and Refresh tokens).
-   **URL Shortening**: Authenticated users can paste a long URL to receive a shortened "ZipLink".
-   **Click Analytics**: Users can view the total number of clicks for each URL they have shortened.
-   **Protected Routes**: The main dashboard is only accessible to authenticated users.
-   **Modern UI**: A sleek, dark-themed interface built with Tailwind CSS.
-   **Persistent Sessions**: Users remain logged in across browser sessions.

## Tech Stack

-   **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
-   **Routing**: [React Router v6](https://reactrouter.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **API Communication**: [Axios](https://axios-http.com/)
-   **State Management**: React Context API
-   **Deployment**: Configured for [Vercel](https://vercel.com/) with Vercel Analytics

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or higher)
-   A running instance of the backend API.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd urlshortner
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the root of the project and add the URL of your backend API.
    ```env
    // filepath: ./.env
    VITE_BACKEND_API_URL=http://localhost:8000
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

## Available Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Runs ESLint to analyze the code for potential errors.
-   `npm run preview`: Serves the production build locally for previewing.
