FROM node:10-alpine
WORKDIR /localshare/server
COPY package* ./
RUN npm i
COPY ./ ./
CMD ["node", "src/index.js"]