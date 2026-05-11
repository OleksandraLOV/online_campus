FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

COPY . .


ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN rm -rf dist && rm -rf node_modules
RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
