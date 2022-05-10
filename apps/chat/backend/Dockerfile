FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/chat/backend .
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --production
RUN pnpm install tslib @nestjs/config \
  json-logger-service @liaoliaots/nestjs-redis ioredis \
  @nestjs/microservices \
  @nestjs/mongoose mongoose \
  class-transformer

CMD node ./main.js
