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
- MySQL Server
- MySQL Workbench (recommended for database management)

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
   - Create `.env` file in the server directory with the following variables:
   ```env
   PORT=5050
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=travel_agency
   ```

4. Set up the database:
   - Open MySQL Workbench
   - Create a new database named `travel_agency`
   - Import the database schema (if provided)

5. Start the development servers:
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
  - MySQL
  - Sequelize ORM