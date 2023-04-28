# build front-end
FROM node:lts-alpine AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm build

FROM node:lts-alpine

RUN npm install pnpm -g

WORKDIR /app

COPY --from=frontend /app .

CMD ["pnpm", "run","dev"]
