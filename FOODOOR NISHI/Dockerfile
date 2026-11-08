# FOODOOR Full-Stack Container (Node.js + Python AI Engine)
FROM python:3.11-slim

# Install Node.js 20.x and build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python ML dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install --omit=dev || true

# Copy application source
COPY . .

# Set default production environment
ENV NODE_ENV=production
ENV PORT=5000
ENV AI_PORT=5001
ENV AI_SERVICE_URL=http://localhost:5001
ENV CORS_ORIGIN=*

EXPOSE 5000
EXPOSE 5001

# Start unified launcher
CMD ["node", "scripts/start-all.js"]

