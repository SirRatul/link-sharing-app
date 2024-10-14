# Frontend Mentor - Link-sharing app solution

This is a solution to the [Link-sharing app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/linksharing-app-Fbt7yweGsT).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Architecture](#architecture)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
- [Running the project](#running-the-project)

## Overview

### The challenge

Users should be able to:

- Create, read, update, delete links and see previews in the mobile mockup
- Receive validations if the links form is submitted without a URL or with the wrong URL pattern for the platform
- Drag and drop links to reorder them
- Add profile details like profile picture, first name, last name, and email
- Receive validations if the profile details form is saved with no first or last name
- Preview their devlinks profile and copy the link to their clipboard
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- **Bonus**: Save details to a database (build the project as a full-stack app)
- **Bonus**: Create an account and log in (add user authentication to the full-stack app)

## My process

### Built with

- React
- Node.js
- MongoDB

### Architecture

#### Frontend

The front end of this app was built with the React library. The overall page structure is a React Router application wrapped in a React Query Provider and two Context Providers, one for authentication and one for data manipulation.

On initial page load, the application checks for a logged-in user from localStorage. If no user exists, a modal prompts the user to log in or create an account. 

Upon successful authentication, the home page renders a list of links (or a placeholder indicating that no links currently exist). The user can toggle between this page and a "Profile Details" page to update personal information.

#### Backend

The back end was developed as a Node.js backend utilizing the Express.js library for routing. There are five endpoints for the API: root, /signup, /login, /userInfo, and /links. File structure is organized according to these endpoints:

##### 1. User Signup
- **Method**: `POST`
- **API Name**: `/signup`
- **Sample Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```
- **Response**:
    ```json
    {
        "user": {
            "email": "user@example.com",
            "id": "12345",
            "token": "jwt_token",
            "firstName": "John",
            "lastName": "Doe",
            "profileImg": "url_to_image",
            "links": ["link1", "link2"]
        },
        "error": null
    }
    ```

##### 2. User Login
- **Method**: `POST`
- **API Name**: `/login`
- **Sample Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "yourpassword"
    }
    ```
- **Response**:
    ```json
    {
        "user": {
            "email": "user@example.com",
            "id": "12345",
            "token": "jwt_token",
            "firstName": "John",
            "lastName": "Doe",
            "profileImg": "url_to_image",
            "links": ["link1", "link2"]
        },
        "error": null
    }
    ```

##### 3. Get User Information
- **Method**: `GET`
- **API Name**: `/user`
- **Sample Request Query**:
    - `?userId=12345`
- **Response**:
    ```json
    {
        "user": {
            "userId": "12345",
            "firstName": "John",
            "lastName": "Doe",
            "email": "user@example.com",
            "profileImg": "url_to_image",
            "links": ["link1", "link2"]
        },
        "error": null
    }
    ```

##### 4. Update User Information
- **Method**: `PATCH`
- **API Name**: `/user`
- **Sample Request Body**:
    ```json
    {
        "userId": "12345",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "newemail@example.com"
        "profileImg": file
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "user": {
            "userId": "12345",
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "newemail@example.com",
            "profileImg": "url_to_image",
            "links": ["link1", "link2"]
        },
        "error": null
    }
    ```

##### 5. Get User Links
- **Method**: `GET`
- **API Name**: `/links`
- **Sample Request Query**:
    - `?userId=12345`
- **Response**:
    ```json
    {
        "links": ["link1", "link2"],
        "error": null
    }
    ```

##### 6. Update User Links
- **Method**: `PATCH`
- **API Name**: `/links`
- **Sample Request Body**:
    ```json
    {
        "userId": "12345",
        "links": ["link1", "link2", "link3"]
    }
    ```
- **Response**:
    ```json
    {
        "success": true,
        "updatedLinks": ["link1", "link2", "link3"],
        "error": null
    }
    ```

###### Summary
- **Signup**: Create a new user account with optional profile image upload.
- **Login**: Authenticate an existing user and retrieve user info.
- **Get User Info**: Retrieve user information based on `userId`.
- **Update User Info**: Modify user details and optionally update the profile image via file upload.
- **Get User Links**: Retrieve links associated with the user.
- **Update User Links**: Modify the user's links.

#### Database

The database is configured in a simple single-table in MongoDB.

## Running the project

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd link-sharing-app
   
2. **Install dependencies for both frontend and backend**:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   cd ../

3. **Run the project**: You can run both the frontend and backend simultaneously using:
    ```bash
   npm start
 
4. **Access the application**: Open your browser and navigate to http://localhost:3000 to view the application.