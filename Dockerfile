FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./

RUN npm install --registry="https://registry.npmjs.org"

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]