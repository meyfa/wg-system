# dependencies
FROM node:22.11.0-alpine as dependencies
WORKDIR /usr/src/app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci

# each component is built separately to enable aggressive caching and parallelism

# build the backend
FROM dependencies AS build-backend
COPY backend ./backend
RUN npm run build -w backend

# build the frontend
FROM dependencies AS build-frontend
COPY frontend ./frontend
RUN npm run build -w frontend

# now build the entire server
FROM dependencies AS build
COPY --from=build-backend /usr/src/app/backend ./backend
COPY --from=build-frontend /usr/src/app/frontend ./frontend
COPY server.ts ./
COPY tsconfig.json ./
RUN npm run build

# execution
FROM node:22.11.0-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache tini

# - install production dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci --omit=dev --include-workspace-root --workspace=backend \
    && npm cache clean --force

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
CMD ["node", "--enable-source-maps", "--disable-proto=delete", "build/server.js"]
