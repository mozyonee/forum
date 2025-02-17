FROM node:23.7-alpine
WORKDIR /src
COPY package*.json ./
COPY tsconfig*.json ./ 

RUN npm install

COPY . .

ENV MONGODB_URI="mongodb://f4_user:f4_password@database-service:27017/f4_db"

EXPOSE 8080

RUN npm run build

CMD [ "npm", "run", "start:prod" ]