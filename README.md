Sports Equipment Rental – Group Project (PAI 2025)

This is a fullstack sports equipment rental web app built with:

Backend: Node.js, Express, Sequelize, SQLite
Frontend: React (Vite), React Router, Context API


How to run the backend

Go into the backend folder
Run 
    npm install
to install dependencies

Start the server with 
    npm start
It will run at http://localhost:3000


How to run the frontend

Go into the frontend folder
Run 
    npm install
to install dependencies

Start the frontend dev server with 
    npm run dev
It will run at http://localhost:5173

To populate the database with example categories and products, run the following command from the /backend directory:
    node seed.js

Resetting the database (optional)
To clear all existing data from the database without deleting the file:

Run this in terminal:
    sqlite3 database.sqlite "DELETE FROM Users; DELETE FROM Categories; DELETE FROM Products; DELETE FROM sqlite_sequence;"