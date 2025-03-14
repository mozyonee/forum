FROM node:23.7-alpine
WORKDIR /src
COPY package*.json ./
COPY tsconfig*.json ./ 

RUN npm install

COPY . .

ENV EDGE_STORE_ACCESS_KEY="53FSG2OHuN1QpXdeIzALJQRMMNZRdPbg"
ENV EDGE_STORE_SECRET_KEY="VnkDfU10MD4vuQMetFMaltBp1NxtyPPBQeeBItvtOiqGocqo"

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]