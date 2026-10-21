#!/usr/bin/env bash
set -e

# Backend
cd backend
npm install
npm run init-db
npm start &

# Frontend
cd ../frontend
npm install
npm run dev &

wait