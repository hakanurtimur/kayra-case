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

ARG CART_ORIGIN=http://localhost:3002
ENV CART_ORIGIN=$CART_ORIGIN

COPY . .

RUN pnpm --filter @kayra/home build \
  && rm -rf apps/home/.next/standalone/node_modules/typescript apps/home/.next/standalone/node_modules/.pnpm/typescript@*

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=node:node /workspace/apps/home/.next/standalone ./
COPY --from=builder --chown=node:node /workspace/apps/home/.next/static ./apps/home/.next/static
COPY --from=builder --chown=node:node /workspace/apps/home/public ./apps/home/public

USER node

EXPOSE 3000

CMD ["node", "apps/home/server.js"]
