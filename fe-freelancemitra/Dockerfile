# Frontend (Next.js) - FreelanceMitra
# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Build (env vars for build can be passed at build-time if needed)
COPY . .
RUN npm run build

# Stage 2: run
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Standalone server listens on 0.0.0.0 by default
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
CMD ["node", "server.js"]
