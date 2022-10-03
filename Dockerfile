FROM node:14.15.4-alpine AS ui-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:14.15.4-alpine AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/client/build ./client/build
COPY package*.json ./
RUN npm install
COPY server/ ./server/

ENV PORT="4000" \
    MONGODB_URI="" \
    NODE_ENV="" \
    API_KEY="" \
    S3_BUCKET="" \
    AWS_BUCKET_REGION="" \
    AWS_ACCESS_KEY_ID="" \
    AWS_SECRET_ACCESS_KEY="" \
    BASE_URL="" \
    SEND_GRID_EMAIL=""

EXPOSE 4000
CMD ["node", "./server/server.js"]