FROM node:18-alpine AS front-end

WORKDIR /frontend/trivia-frontend

COPY ./trivia-frontend/package*.json ./
RUN npm install

COPY ./trivia-frontend .

RUN npm run build

FROM nginx:alpine
COPY --from=front-end /frontend/trivia-frontend/build /usr/share/nginx/html