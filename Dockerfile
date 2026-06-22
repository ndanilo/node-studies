# Phase 11 — multi-stage Docker build for Node AI services
#
# Build:  docker build -t node-studies-phase11 .
# Run:    docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... node-studies-phase11

# ── Stage 1: compile TypeScript ─────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build:prod

# ── Stage 2: production runtime (no devDependencies, no source) ─────────────
FROM node:22-alpine AS run

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

# Non-root user — security best practice (like running as non-admin in IIS/K8s)
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health/live || exit 1

CMD ["node", "dist/phase-11/index.js"]
