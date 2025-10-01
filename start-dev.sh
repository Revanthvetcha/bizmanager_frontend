#!/bin/bash

echo "Starting BizManager Development Environment..."
echo

# Check if backend is running
if curl -s http://localhost:4000/api/ping > /dev/null 2>&1; then
    echo "Backend is already running."
else
    echo "Backend is not running. Starting backend server..."
    cd backend && npm start &
    echo "Waiting for backend to start..."
    sleep 5
fi

echo
echo "Starting frontend development server..."
npm run dev
