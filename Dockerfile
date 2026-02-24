FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api/package.json ./api/package.json

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY api ./api

# Build the API
RUN pnpm --filter api build

# Deploy only production dependencies and built files
RUN pnpm --filter api --prod deploy /prod/api

# Runner stage
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /prod/api ./
COPY --from=builder --chown=nestjs:nodejs /app/api/dist ./dist

USER nestjs

# Expose the application port
EXPOSE 3333

# Start the application
CMD ["npm", "start"]
