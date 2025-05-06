# Travel Agency Application

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server
- MySQL Workbench (for database management)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travel-agency-app
```

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=travel_agency
```

4. Set up the database:
   - Open MySQL Workbench
   - Create a new database named `travel_agency`
   - Import the database schema (if provided)

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory with the following variables:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

### Backend (server directory)

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests

### Frontend (client directory)

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Features

- User authentication
- Browse travel packages
- Book flights and hotels
- View booking history
- Search and filter options
- Responsive design
