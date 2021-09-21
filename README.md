# wg-system

[![CI](https://github.com/meyfa/wg-system/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/wg-system/actions/workflows/main.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/211b6450628333791e6a/maintainability)](https://codeclimate.com/github/meyfa/wg-system/maintainability)

Management system for flat sharing


## Setup

### Requirements

It is expected that you have some sort of server to deploy this on. Any device with access to that server can then view
the provided web page, for example a tablet taped to the kitchen wall, or your mobile phone or computer.

### Installation via Docker

The preferred setup method is via Docker and Docker-Compose. Please note that the `docker-compose.yml` contained in
this repository is meant for building the application from source. Usually, you should obtain the pre-built image from
Docker Hub instead.

To do so, create a `docker-compose.yml` similar to the following anywhere on your server:

```yml
version: '3.1'

networks:
  internal:

services:

  mongodb:
    image: mongo:5
    container_name: wg_mongodb
    restart: unless-stopped
    networks:
    - internal

  wg_system:
    image: meyfa/wg-system:latest
    container_name: wg_system
    restart: unless-stopped
    networks:
    - internal
    ports:
    - '8080:8080'
    environment:
      MONGODB_URI: 'mongodb://wg_mongodb/wgsystem'
```

Then run `docker-compose build` followed by `docker-compose up -d` to start the services. The application will be
available on your server via port 8080.

You can adapt this method to your specific server setup, if required.

### Running without Docker

The other route is to install MongoDB manually, install Node, clone this repository, fetch dependencies via `npm i`
and execute `npm start` to run the server without Docker.
The same environment variables as in the compose file above need to be set.
This is not such a good idea because it is less automatic than using Docker and upgrades might be harder. As such, it
is really just intended for development.


## Development

Some hints on developing this project follow. This is irrelevant when all you want to do is run your own instance.

The entire project is written in JavaScript and TypeScript. You should have a recent version of Node (16 or later)
and NPM installed. Since we are using NPM Workspaces, NPM 7 or later is required.

- The `backend` workspace contains the database connection and everything else required to make the system work,
  such as an API.
- The `frontend` workspace contains a React app that is the user interface.
- Finally, there is the `server.js` file used to bootstrap the backend and also serve compiled frontend files.
  This is written in plain JavaScript for simplicity reasons.

### Start scripts

Both the backend and frontend need to be compiled before they can be used. This is easily done via `npm run build-all`.
To then start the server, use `npm run production`. Alternatively, `npm start` is a shortcut to do both things at once.

For frontend development, use `npm run dev` to get the backend up and running as well as obtain a temporary web
server with hot-reloading capability at port `3000`. Note that the command has to be re-run when the backend is
changed because hot-reloading the backend would be infinitely more complex.

### Quality control

ESLint and Stylelint are used to ensure proper code style. Use `npm run lint-all` to lint all workspaces, or
`npm run lint -w backend` / `npm run lint -w frontend` to lint a specific workspace.
The `lint-fix-all` script (or `lint-fix` for a single workspace) can also correct many simple mistakes by itself.

There are many great editor integrations for ESLint, Stylelint and TypeScript; use them!

### Dependency management

To install a new dependency, you have to decide: is it needed everywhere, like ESLint? Is it required by `server.js`?
If the answer was 'yes' to at least one of these questions, install the dependency to the root folder
(e.g. `npm i express`).
Otherwise, install it to the appropriate workspace: `npm i -w frontend react`.

Due to how workspaces work, if at any point a `package-lock.json` or `node_modules` is created in one of the
workspaces, you've done something wrong. Delete them and run `npm i` in the root directory. This will hoist the
dependencies to the parent project for better de-duplication.


## Contributing

Issues and pull requests are very welcome! Please keep in mind that this project is licensed under the MIT license.
By contributing, you agree to make your work available under the same terms.
Additionally, please use Conventional Commit messages and proper code style. The latter can be verified using the
configured linting scripts.
