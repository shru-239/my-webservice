Node.js User Registration and Real-Time User List

This project demonstrates a Node.js web application that allows users to register and view a real-time list of connected users. It utilizes MongoDB as the database, Express.js for building the API, and Socket.IO for real-time communication.
Features

    User Registration:
        A form to collect user details (name, email, address, login ID, password).
        Form validation on both frontend and backend.
        Data is stored securely in MongoDB.
    Real-Time User List (user-list.html):
        Automatically redirects to user-list.html after successful registration.
        Displays a list of currently connected users in a table.
        Updates the list automatically when users join or leave.
        Clickable email IDs to view full user details in a popup.
    User Details Popup:
        Click on a user's email in the list to view their complete details in a popup (implemented using JavaScript alerts for simplicity).
    Session Management:
        Uses localStorage to preserve user sessions across page redirects.
    User Disconnection:
        Users can disconnect manually using a "Disconnect" button on the live_users.html page.
        Proper cleanup is performed on the server-side when users disconnect.

Technologies Used

    Backend:
        Node.js
        Express.js
        MongoDB (with Mongoose)
        Socket.IO
    Frontend:
        HTML
        CSS (with Bootstrap)
        JavaScript (with jQuery)

Prerequisites

    Node.js and npm: Make sure you have Node.js and npm installed on your system.
    MongoDB: You need a running MongoDB instance. You can download and install it from https://www.mongodb.com/.

Getting Started

Clone the Repository:

git clone https://your-repository-url.git
cd your-project-directory

Install Dependencies:

npm install

Set Up Environment Variables:

    Create a .env file in the project root.
    Add the following variable:

    MONGO_URI=mongodb://localhost:27017/yourdatabase 

Start the Server:

npm start 

    Open in Browser:
        Go to http://localhost:3000 in your browser to access the registration page.

Usage

    Register a User:
        Fill out the registration form on index.html and click "Save."
        You will be automatically redirected to live_users.html.
    View Live Users (user-list.html):
        The table will display all currently connected users.
        Click on a user's email to view their full details in a popup.
    Disconnect:
        Click the "Disconnect" button to disconnect and return to the registration page.

Project Structure

    server.js: The main Node.js server file.
    models/user.js: Defines the Mongoose schema for user data.
    routes.js: Defines the API routes for handling user data.
    public/: Contains frontend assets:
        index.html: The user registration page.
        live_users.html: The live user list page.
        script.js: The frontend JavaScript logic.
        style.css: The CSS for styling (consider using Bootstrap for enhanced styling).

Additional Notes

    Password Hashing: In a production environment, you should hash passwords before storing them in the database for security.
    Error Handling: Consider adding more comprehensive error handling to both the frontend and backend.
    Popup Customization: The user details popup currently uses a basic JavaScript alert. You can replace this with a custom modal or use a library like Bootstrap Modal for a better user experience.

Contributing

Feel free to contribute to this project by creating issues or submitting pull requests.
License
This project is licensed under the MIT License.
