# Dockerfile for Gweihir Chainlink external adapter
FROM node:16-alpine AS builder

RUN apk update && apk add --no-cache git

WORKDIR /app

ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY babel.config.js tsconfig.json .
COPY src ./src

RUN yarn build

# Clean up node_modules in preparation for production
RUN yarn install --frozen-lockfile --production --ignore-scripts --offline


FROM node:16-alpine AS app

# Handle kernel signals 
# @see https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#handling-kernel-signals
RUN apk update && apk add --no-cache tini

WORKDIR /app

COPY LICENSE .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/build/external-adapter ./src

ENV NODE_ENV production

EXPOSE 4242

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/usr/local/bin/node", "src/app"]