FROM apify/actor-node-puppeteer-chrome:latest

COPY . ./

RUN npm install
