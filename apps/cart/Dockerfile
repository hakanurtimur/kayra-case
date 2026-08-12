FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /workspace

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/home/package.json apps/home/package.json
COPY apps/cart/package.json apps/cart/package.json
COPY packages/cart-contract/package.json packages/cart-contract/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile

FROM dependencies AS builder

COPY . .

RUN pnpm --filter @kayra/cart build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3002

COPY --from=builder --chown=node:node /workspace/apps/cart/.next/standalone ./
COPY --from=builder --chown=node:node /workspace/apps/cart/.next/static ./apps/cart/.next/static
COPY --from=builder --chown=node:node /workspace/apps/cart/public ./apps/cart/public

USER node

EXPOSE 3002

CMD ["node", "apps/cart/server.js"]
