FROM node:23.7
WORKDIR /src
COPY package*.json ./
RUN npm install

COPY . .

ENV EDGE_STORE_ACCESS_KEY="53FSG2OHuN1QpXdeIzALJQRMMNZRdPbg"
ENV EDGE_STORE_SECRET_KEY="VnkDfU10MD4vuQMetFMaltBp1NxtyPPBQeeBItvtOiqGocqo"
ENV SERVER_HOST="http://localhost"
ENV SERVER_PORT=8080
ENV CLIENT_PORT=3000

EXPOSE 3000

RUN npm run build

CMD npm start -- -p ${CLIENT_PORT}