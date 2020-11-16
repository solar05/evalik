FROM node:alpine3.10
WORKDIR /app
COPY . /app
CMD ["./bin/evalik", "-i"]
