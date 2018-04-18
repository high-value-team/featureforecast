# Build Scripts

## Prerequisites

* node v9.5.0
* npm v5.6.0
* yarn v0.23.4
* Docker

```
brew install node@9
npm install -g npm@5.6.0
npm install -g yarn@0.23.4
```

install build dependencies
```
yarn install
```

# How to build the C# binary?

For building the binary certain packages are needed. One way to download them is to use JetBrains Rider software.

open with Rider: `totalorder/backend/src/to.backend/to.backend.sln`

Rider will automatically load packages into the following folder: `totalorder/backend/src/to.backend/packages`

Later execute `run docker:build` followed by `run docker:start`


## Run Tasks

`run [taskname]`

e.g. `run start`

Available tasks:
```
setup                           - Create environment files, e.g. env.production. Please edit files with useful values!
install                         - Install all dependencies in "src" folder
docker:build                    - Run backend build scripts
docker:start                    - Start backend in docker container. Please execute "run stop" to manually stop the container!
docker:stop                     - Stop docker container
sloppy:publish                  - Push latest docker build to docker hub
sloppy:delete                   - Delete existing project on sloppy.zone
sloppy:deploy                   - Deploy to sloppy.zone
dropstack:build                 - Create dropstack folder
dropstack:deploy                - Deploy to dropstack
clean:docker                    - Remove all "docker" folders
clean:dropstack                 - Remove all "dropstack" folders
clean:sloppy                    - Remove all "sloppy" folders
clean:install                   - Remove all C# dependencies
```

Execute `run` to list all available tasks


## room for improvement

Currently when starting a docker container with `run start` the container is not terminated on CTRL-C. The node process is terminated, but the container still runs in the background and blocks the given http-port (e.g. localhost:8080).
The docker container needs to be manually killed, just do the following:
```
docker ps
docker kill featureforecast-backend
```
