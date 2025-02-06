FROM node:23.7
WORKDIR /src
COPY package*.json ./
COPY tsconfig*.json ./ 
RUN npm install

COPY . .

ENV MONGODB_URI="mongodb+srv://vadymabakumov:mjvhOfbpBDSaTBk4@f4cluster.i7oqv.mongodb.net/test?retryWrites=true&w=majority"
ENV CLIENT_HOST="http://localhost"
ENV CLIENT_PORT=3000
ENV SERVER_PORT=8080

EXPOSE 8080

RUN npm run build

CMD [ "npm", "run", "start:prod" ]