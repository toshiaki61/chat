FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/services/chat .
COPY pnpm-lock.yaml ./
# ENV SERVICES_CHAT_PORT=33333

# EXPOSE ${SERVICES_CHAT_PORT}
RUN npm install -g pnpm
RUN pnpm install --production
RUN pnpm install tslib @nestjs/config \
  json-logger-service @liaoliaots/nestjs-redis ioredis \
  @nestjs/mongoose mongoose \
  class-transformer

CMD node ./main.js
