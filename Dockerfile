FROM node:12.18.4-stretch-slim

EXPOSE 8080

WORKDIR /app

COPY ./ ./

RUN npm install

ENTRYPOINT ["node", "app.js"]