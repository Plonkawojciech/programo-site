# programo.pl on Coolify (Traefik in front). Multi-stage: the runtime image
# carries only the standalone server, static assets and public/.
# Build happens inside Coolify's build container, never by hand on the VM.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Turns on `output: "standalone"` in next.config.ts. Vercel builds without it.
ENV BUILD_STANDALONE=1
# NEXT_PUBLIC_* values are inlined at build time, so they must be build args.
ARG NEXT_PUBLIC_META_DATASET_ID
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_META_DATASET_ID=$NEXT_PUBLIC_META_DATASET_ID
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` directly: the npm script's postbuild pings IndexNow, which only
# a production cutover should do (run it by hand after DNS points here).
RUN npx next build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
# Blog posts are read from disk at request time by a few routes.
COPY --from=build /app/src/content ./src/content
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
