# build
FROM node:lts-alpine as build
WORKDIR /usr/src/app

# - install dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci

# - copy in app code and build it
COPY . .
RUN npm run build-all

# execution
FROM node:lts-alpine
WORKDIR /usr/src/app

# - install PRODUCTION dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci --production

# add the already compiled code
COPY --from=build /usr/src/app/server.js ./
COPY --from=build /usr/src/app/backend/build ./backend/build
COPY --from=build /usr/src/app/frontend/build ./frontend/build

# we listen on :8080
EXPOSE 8080

# start the server ("production" skips the build step)
CMD ["npm", "run", "production"]
