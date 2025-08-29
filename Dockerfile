# 1. Use node image
FROM node:20

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install deps
COPY package*.json ./
RUN npm install

# 4. Copy rest of the app
COPY . .

# 5. Expose port
EXPOSE 5173

# 6. Run dev server
CMD ["npm", "run", "dev"]
