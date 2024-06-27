# Live Polling

Live polling is a dynamic method of gathering instant feedback or opinions from participants in real-time during an event, class, or meeting. It allows users to submit responses to questions or prompts immediately, providing instant insights and engagement.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.IO
- CORS

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v12 or higher)
- MongoDB (running locally or accessible MongoDB URI)
- npm or yarn (package managers)

## Getting Started

Follow these steps to run the backend application locally:

# Backend setup

1. **Clone the repository for backend**:

   ```bash
   git clone https://github.com/kubra16/live-polling-server.git
   cd live-polling-server
   ```

2. **install dependencies**:

```bash
   npm install
```

3. **Setup environment variables** :

   - Create a .env file in the root directory and paste your credentials.

```bash
    MONGO_URL:<your_mobo_url>
```

4. **Start the server** :

```
    npm start
```

- server will run on http://localhost:5000

# Frontend setup :

1. **clone the frontend respository**

```bash
 git clone https://github.com/kubra16/Live-polling.git
 cd Live-polling
```

2. **install dependencies**:

```bash
   npm install
```

3. **Setup environment vaiables**:

- Create a .env file in the root directory and paste your credentials.

```bash
 REACT_APP_API_URL=http://localhost:5000
```

4. **Start the React app** :

```
    npm start
```

- App will run on http://localhost:3000
