FROM node:23.7-alpine
WORKDIR /src
COPY package*.json ./
COPY tsconfig*.json ./ 

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]