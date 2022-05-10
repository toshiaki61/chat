FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/admin/backend .
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --production
RUN pnpm install tslib @nestjs/config \
  json-logger-service @liaoliaots/nestjs-redis ioredis \
  @nestjs/mongoose mongoose \
  @nestjs/microservices \
  class-transformer

CMD node ./main.js
