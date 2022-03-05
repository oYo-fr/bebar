ARG VERSION=latest
FROM node

RUN npm install -g bebar@$VERSION
