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

## Run Tasks

`run [taskname]`

e.g. `run start`

Available tasks:
```
setup                           - Create environment files, e.g. env.dropstack. Please edit files with useful values!
build                           - Run backend build scripts
start                           - Start backend in docker container
stop                            - Stop running backend in docker container
deploy                          - Create deploy folder and deploy to Dropstack
clean:build                     - Remove all "bin" folders
clean:deploy                    - Remove all "deploy" folders
```

Execute `run` to list all available tasks
