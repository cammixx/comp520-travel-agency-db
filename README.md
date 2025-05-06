# Travel Agency Application

A modern web application for managing travel bookings, built with React and Node.js.

## Features

- Trip browsing and booking
- Flight selection (departure and return)
- Hotel booking
- Travel insurance options
- Customer information management
- Booking confirmation and management


## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd travel-agency-app
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables (database connection, etc.)

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm start
   ```

## Booking Process

1. Select a trip from available options
2. Choose departure and return flights
3. Select a hotel
4. Add travel insurance (optional)
5. Enter customer information
6. Confirm booking

## Technologies Used

- Frontend:
  - React
  - Axios for API calls
  - Bootstrap for styling

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - Sequelize ORM