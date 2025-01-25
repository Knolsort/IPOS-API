# Use a Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if exists)
COPY package*.json ./

# Copy the prisma directory for `prisma generate` to work
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application's port
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
