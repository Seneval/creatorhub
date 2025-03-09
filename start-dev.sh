#!/bin/bash
# Start backend server
node server.js & 
BACKEND_PID=$!

# Start frontend server
cd frontend && npm run dev & 
FRONTEND_PID=$!

# Handle SIGINT (Ctrl+C)
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
