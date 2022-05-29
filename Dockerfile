FROM node:lts
WORKDIR /app
ENV NODE_ENV=production
COPY package.json .
RUN npm install -g npm
RUN npm install --verbose
COPY . .
CMD [ "npm", "run", "build" ]