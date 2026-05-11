FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN rm -rf dist && rm -rf node_modules
RUN npm ci && npm run build

EXPOSE 3000

CMD ["node", "/app/dist/main.js"]
