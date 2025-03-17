FROM node:23.7-alpine
WORKDIR /src
COPY package*.json ./
COPY tsconfig*.json ./ 

RUN npm install

COPY . .

ARG MONGODB_URI

ENV MONGODB_URI=$MONGODB_URI

EXPOSE 8080

RUN npm run build

CMD [ "npm", "run", "start:prod" ]