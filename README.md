# React ToDo App

<img align="center" src="https://github.com/MehmetBozkir/React-Portfolio/assets/150898451/1d94fe22-89f4-48dd-8167-61a0d90bb590" height="500" width="1200" alt="Responsive Photo 1"/>

<hr> 

This is a simple To-Do application built with Next.js for the frontend and Node.js for the backend. Users can create, edit, delete, search, and filter to-dos. Each user can only access their own to-dos, and to-dos can include images and files.

<p align="center"> 

<br> 
  
:wrench: Features 
  ------------------------------

- Responsive web design :
     - Different designs customized for small and large screens.
- UI&UX Desigin
- User authentication with JWT
- Create, read, update, and delete to-dos
- Search and filter to-dos by title and tags
- Pagination
- Image and file uploads

  <br> 
  
  ## :link: Prerequisites
  - Node.js
  - MongoDB
    
   <br> 
 
  ## :book: How to use
To clone and run this application, you'll need [Git](https://git-scm.com/downloads) and [ReactJS](https://reactjs.org/docs/getting-started.html) installed on your computer. From your command line:

- Backend

```
# Clone this repository
$ git clone https://github.com/MehmetBozkir/react-interview-todo-app.git

# Go into the repository
$ cd react-interview-todo-app

# Go into the repository
$ cd todo-app-backend

# Install dependencies
$ npm install

# Create a .env file with the following content:
$ echo "" > .env

# Start the backend server
$ node server.js
```

- Frontend

```
# Navigate to the frontend directory:
$ cd ../todo-app-frontend

# Install dependencies
$ npm install

# Create a .env file with the following content:
$ echo "" > .env

# Start the frontend server:
$ npm run dev
```

  ## 💬 Manual User Creation and Database Setup

  - Open MongoDB shell or your MongoDB management tool.
  - Create a new database called todo-app.
  - Create a new collection called users.
  - Insert a new user document with the following structure:
    
```
{
  "password": "$2b$10$hashedPasswordHere", // Hash the password before saving
  "name": "User Name"
}
```

- Your MongoDB setup should look like this:
    
```
- todo-app
  - users
    - { "password": "$2b$10$hashedPasswordHere", "name": "User Name" }
```

- You can now log in with the user credentials you created.
  
