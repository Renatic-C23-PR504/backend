FROM node:14.21.2-alpine
WORKDIR /
ENV PORT 9291
COPY . .
RUN npm install
EXPOSE 9291
CMD [ "npm", "run", "start"]