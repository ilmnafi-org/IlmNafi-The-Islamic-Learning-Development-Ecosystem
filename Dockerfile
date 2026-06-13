# Multi-stage production build for Node.js + Express + Vite Full-Stack Application
# Stage 1: Build the client assets and compile TypeScript server
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install all workspace dependencies
RUN npm ci

# Copy the entire workspace configuration and source files
COPY . .

# Build the client spa and bundle the express backend into dist/server.cjs
RUN npm run build

# Stage 2: Safe production final runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies to keep the image lightweight and highly secure
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose production port
EXPOSE 3000

# Run container as a secure non-root user for optimal production protection
USER node

# Execute the self-contained production bundle
CMD ["node", "dist/server.cjs"]
