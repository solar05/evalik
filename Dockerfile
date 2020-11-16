FROM node:alpine3.10
WORKDIR /app
COPY . /app
CMD ["node", "__tests__/run.js"]
