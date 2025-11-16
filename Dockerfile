# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine AS builder

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Only copy package files first to use cache
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy the rest of your project
COPY . .

# ------------------- RUNTIME IMAGE -------------------
FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy node_modules and all source from builder
COPY --from=builder /usr/src/app ./

# Expose port (your app uses 8000)
EXPOSE 8000

# Start app
CMD ["npm", "start"]
