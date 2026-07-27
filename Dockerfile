# syntax=docker/dockerfile:1

# --- Dependencies -----------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
# Build toolchain for native modules (better-sqlite3): Alpine uses musl, for
# which a prebuilt binary may not exist, so it can compile from source.
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci

# --- Builder ----------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Runner -----------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Serve on plain HTTP; TLS is terminated by an upstream proxy (required for
# camera getUserMedia and service workers, which need a secure context).
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# SQLite analytics database. Mount a volume here so it survives redeploys:
#   docker run -v zwita-data:/data ...
ENV ZWITA_DB_PATH=/data/zwita.db

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /data \
  && chown nextjs:nodejs /data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
VOLUME ["/data"]
CMD ["node", "server.js"]
