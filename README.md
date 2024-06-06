# EmployeeTaskManagement
**Project Overview**
This project is a full-stack application that uses React for the front-end, Node.js with Express for the back-end, and Firebase Firestore for the database. The app allow owner to manage employees and efficiently with basic CRUD operations, real-time task updates and seamless communication between employees and their owner with Socket.io.

**Project Structure**  
frontend/                   # Front-end  
  ├── public/               # Public assets    
  └── src/                  # React components and configuration  
      ├── app/              # Shared application configurations and logic like redux store, global types, routes,...  
      │   ├── services/     # API service using RTK query  
      │   └── slices/       # Redux slices  
      ├── assets/           # Static assets  
      ├── components/       # Reusable UI components  
      │   └── ui/           # UI components of Shadcn  
      ├── hooks/            # Custom hooks  
      ├── hooks/            # Custom hooks  
      ├── lib/              # Library modules  
      ├── pages/            # Page components  
      └── utils/            # Utility functions  
backend/                    # Back-end (Node.js with Express)  
  ├── config/               # Configuration for services like firebase, twilio, nodemailer,...  
  ├── controllers/          # Controller modules  
  ├── middleware/           # Middleware functions  
  ├── models/               # Firebase database models  
  ├── routes/               # Route handlers  
  ├── utils/                # Utility functions  
  ├── server.js             # Express server setup  
  └── package.json          # Back-end dependencies  
README.md                   # Project documentation  

**Getting Started**  
Prerequisites  
  Node.js and npm installed  
  
**Front-end Setup**  
Navigate to the frontend directory and install dependencies:  
cd frontend  
npm i  

**Back-end Setup**  
Navigate to the backend directory and install dependencies:  
cd backend  
npm i  

**Notes**  
For demo, I have create 2 verified accounts for owner and employee with fixed access code  
ONWER  
  Phone number: 1234567890  
  Access code: 123456  
EMPLOYEE  
  Email address: tester@gmail.com  
  Access code: 123456  
