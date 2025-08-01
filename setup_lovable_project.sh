#!/bin/bash

# Create the main project directory
mkdir -p lovable-project

# Create standard directories
mkdir -p lovable-project/backend
mkdir -p lovable-project/frontend
mkdir -p lovable-project/docs
mkdir -p lovable-project/tests

# Move existing frontend files
mv frontend/.env lovable-project/frontend/
mv frontend/Dockerfile lovable-project/frontend/
mv frontend/index.html lovable-project/frontend/
mv frontend/package-lock.json lovable-project/frontend/
mv frontend/package.json lovable-project/frontend/
mv frontend/tsconfig.json lovable-project/frontend/
mv frontend/vite.config.ts lovable-project/frontend/
mv frontend/src lovable-project/frontend/
mv frontend/node_modules lovable-project/frontend/

echo "Lovable.dev project structure created and frontend files moved."
