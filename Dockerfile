# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production runner image
FROM oven/bun:1 as runner
WORKDIR /app

# Copy built assets from base
COPY --from=base /app/build ./build
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "build/index.js"]
