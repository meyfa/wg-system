# dependencies
FROM node:20.18.0-alpine as dependencies
WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci

# each component is built separately to enable aggressive caching and parallelism

# build the backend
FROM dependencies as build-backend
COPY backend ./backend
RUN npm run build -w backend

# build the frontend
FROM dependencies as build-frontend
COPY frontend ./frontend
RUN npm run build -w frontend

# now build the entire server
FROM dependencies as build
COPY --from=build-backend /usr/src/app/backend ./backend
COPY --from=build-frontend /usr/src/app/frontend ./frontend
COPY server.ts ./
COPY tsconfig.json ./
RUN npm run build

# execution
FROM node:20.18.0-alpine
WORKDIR /usr/src/app

# - install PRODUCTION dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci --omit=dev \
  && apk add --no-cache tini

# - add the already compiled code
COPY --from=build /usr/src/app/backend/build ./backend/build
COPY --from=build /usr/src/app/frontend/build ./frontend/build
COPY --from=build /usr/src/app/build ./build

# - ports
EXPOSE 8080

# - run as non-root user
USER node

# use tini as init process since Node.js isn't designed to be run as PID 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/server.js"]
