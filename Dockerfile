ARG VERSION=latest
FROM node
RUN echo Installing Bebar version $VERSION
RUN npm install -g bebar@$VERSION
