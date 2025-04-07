# Base image with Node and Debian for ffmpeg support
FROM node:18-alpine

# Install FFmpeg
RUN apk update && apk add --no-cache ffmpeg

# Set workdir
WORKDIR /app

# Copy files
COPY . .

# Install deps
RUN npm install

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
