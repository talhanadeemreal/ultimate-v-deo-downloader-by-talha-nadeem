FROM node:18-slim

# Install Python 3, pip, and FFmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    pip3 install yt-dlp --break-system-packages && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose the port (Render will override this at runtime via env var, but good practice)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
