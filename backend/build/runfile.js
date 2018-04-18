const { help, run } = require('runjs');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const fs = require('fs');
var chalk = require('chalk');
const { SilentLogger } = require('runjs/lib/common');

//
// decorators
//

function runSilent(command, options = {}) {
    run(command, options, new SilentLogger());
}

//
// setup
//

function setup() {
    let envFiles = [];
    fs.readdirSync('setup').forEach(file => {
        if (file.startsWith('env.')) {
            envFiles.push(file);
        }
    });

    let allEnvFilesExist = true;
    envFiles.forEach((filename) => {
        if (!fs.existsSync(filename)) {
            allEnvFilesExist = false;
        }
    });

    if (allEnvFilesExist) {
        console.log("All environment files already exist.")
    }

    envFiles.forEach((filename) => {
        if (!fs.existsSync(filename)) {
            run(`cp setup/${filename} .`);
            console.log(`Please edit this file!`)
        }
    });
}
help(setup, 'Create environment files, e.g. env.production. Please edit files with useful values!');

function install() {
    // TODO install C# packages
    // Currently done by opening the project with Jebrains Rider (will automatically load dependencies)
    console.log("NOT IMPLEMENTED");
}
help(install, 'Install all dependencies in "src" folder');


//
// docker
//

function docker_build () {
    const imageName = 'hvt1/featureforecast-backend';
    const srcDir = `${__dirname}/../src`;
    const binDir = `${__dirname}/docker.${timestamp()}`;

    // create bin folder
    run(`mkdir -p ${binDir}/app/db`);

    try {
        run(`docker run -i -v ${binDir}/app:/binDir -v ${srcDir}:/srcDir mono sh << EOF 
msbuild /p:OutDir=/binDir /srcDir/featureforecast/featureforecast.sln
EOF`);
    } catch (error) {
        console.log(chalk.red('FAILED!\n'));
    }

    // create Dockerfile
    const dockerfile = fs.readFileSync('template.docker.Dockerfile', 'utf8');
    fs.writeFileSync(`${binDir}/Dockerfile`, dockerfile);

    // build docker image
    run(`docker build --tag ${imageName} ${binDir}`);
}
help(docker_build, 'Run backend build scripts');

function docker_start () {
    const localURL = `127.0.0.1:9031`;
    const imageName = 'hvt1/featureforecast-backend';
    const containerName = 'featureforecast-backend';

    const isRunning = checkIsRunning(containerName);
    if (isRunning) {
        console.log(`The docker container '${containerName}' is already running. Make sure to stop it! ('run docker:stop')`);
        return
    }

    run(`docker run --name=${containerName} --publish "${localURL}:80" ${imageName}`);
}
help(docker_start, 'Start backend in docker container. Please execute "run stop" to manually stop the container!');

function docker_stop () {
    const containerName = 'featureforecast-backend';
    console.log(`checking if '${containerName}'-container is running`);
    let containerID = run(`docker ps --filter "name=${containerName}" --format "{{.ID}}"`, {stdio: 'pipe'});
    if (containerID.length !== 0) {
        run(`docker kill ${containerName}`);
    }
    console.log();

    console.log(`checking if '${containerName}'-container exists`);
    containerID = run(`docker ps --all --filter "name=${containerName}" --format "{{.ID}}"`, {stdio: 'pipe'});
    if (containerID.length !== 0) {
        run(`docker rm ${containerName}`);
    }
    console.log();
}
help(docker_stop, 'Stop docker container');

//
// sloppy
//

function sloppy_publish () {
    const imageName = 'hvt1/featureforecast-backend';
    const envFile = 'env.dockerhub';
    console.log(`using ${envFile}`);
    const envObj = loadEnvironment(envFile);

    console.log(chalk.bold(`logging into docker hub, hiding command with credentials`));
    runSilent(`docker login --username ${envObj.USERNAME} --password ${envObj.PASSWORD}`, {stdio: 'pipe'});
    run(`docker push ${imageName}`);
}
help(sloppy_publish, 'Push latest docker build to docker hub');

function sloppy_delete() {
    const envFile = 'env.sloppy';
    console.log(`using ${envFile}`);
    const envObj = loadEnvironment(envFile);

    run(`sloppy delete featureforecast-backend`, {env: envObj});
}
help(sloppy_delete, 'Delete existing project on sloppy.zone');

function sloppy_deploy() {
    const envFile = 'env.sloppy';
    console.log(`using ${envFile}`);
    const sloppyEnv = loadEnvironment(envFile);

    const deployDir = `sloppy.${timestamp()}`;
    run(`mkdir ${deployDir}`);

    run(`cp template.sloppy.yml ${deployDir}/sloppy.yml`);

    run(`sloppy start ${deployDir}/sloppy.yml`, {env: sloppyEnv});
}
help(sloppy_deploy, 'Deploy to sloppy.zone');

//
// dropstack
//

function dropstack_build () {
    const srcDir = `${__dirname}/../src`;
    const binDir = `${__dirname}/dropstack.${timestamp()}`;

    // create dropstack folder
    run(`mkdir -p ${binDir}`);
    run(`mkdir -p ${binDir}/app/db`);

    // build executable
    try {
        run(`docker run -i -v ${binDir}/app:/binDir -v ${srcDir}:/srcDir mono sh << EOF 
msbuild /p:OutDir=/binDir /srcDir/featureforecast/featureforecast.sln
EOF`);
    } catch (error) {
        console.log(chalk.red('FAILED!\n'));
    }

    // create .dropstack.json
    const dropstackEnv = loadEnvironment('env.dropstack');
    var dropstackFile = fs.readFileSync('template.dropstack.json', 'utf8');
    var parsedFile = interpolate(dropstackFile, dropstackEnv);
    fs.writeFileSync(`${binDir}/.dropstack.json`, parsedFile);

    // create Dockerfile
    run(`cp template.dropstack.Dockerfile ${binDir}/Dockerfile`);
}
help(dropstack_build, 'Create dropstack folder');

function dropstack_deploy () {
    const binDir = findNewestDropstackFolder();
    if (binDir === undefined) {
        console.log('No bin-folder found. Please execute a "build" job first!');
        return
    }

    const dropstackEnv = loadEnvironment('env.dropstack');
    const deployToDropstack = `cd ${binDir} && dropstack deploy --compress --verbose --alias ${dropstackEnv.DROPSTACK_ALIAS}.cloud.dropstack.run --type mono --stateful --token ${dropstackEnv.DROPSTACK_TOKEN}`;
    run(deployToDropstack);
}
help(dropstack_deploy, 'Deploy to dropstack');


//
// clean
//

function clean_docker() {
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^docker\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const removeDirectory = `rm -rf ${file}`;
            run(removeDirectory);
        }
    });

}
help(clean_docker, 'Remove all "docker" folders');


function clean_sloppy() {
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^sloppy\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const removeDirectory = `rm -rf ${file}`;
            run(removeDirectory);
        }
    })
}
help(clean_sloppy, 'Remove all "sloppy" folders');

function clean_dropstack() {
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^dropstack\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const removeDirectory = `rm -rf ${file}`;
            run(removeDirectory);
        }
    })
}
help(clean_dropstack, 'Remove all "dropstack" folders');

function clean_install() {
    console.log("NOT IMPLEMENTED");
}
help(clean_install, 'Remove all C# dependencies');


//
// helper
//

function interpolate(text, env) {
    var matches = text.match(/\$([a-zA-Z0-9_]+)|\${([a-zA-Z0-9_]+)}/g) || [];

    matches.forEach(function (match) {
        var key = match.replace(/\$|{|}/g, '');
        var value = env[key];
        text = text.replace(match, value);
    });

    return text;
}

function loadEnvironment(envPath) {
    var env = dotenv.config({path: envPath});
    // console.log(`loadEnvironment:${JSON.stringify(env, null, 2)}`);

    // override 'system environment variables'
    for (var k in env.parsed) {
        process.env[k] = env.parsed[k];
    }

    env = dotenvExpand(env); // will auto merge with 'system environment variables'
    if (env.error) {
        throw env.error
    }
    // console.log(`loadEnvironment dotenvExpand:${JSON.stringify(env, null, 2)}`);

    return env.parsed;
}

function findNewestDropstackFolder() {
    let binFolders = [];
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^dropstack\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const absolutePath = `${__dirname}/${file}`;
            binFolders.push(absolutePath);
        }
    });
    let sorted = binFolders.sort();
    return sorted[sorted.length-1];
}


function timestamp() {
    const pad = (n) => String("00" + n).slice(-2);
    const date = new Date();
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

function checkIsRunning(containerName) {
    let containerID = run(`docker ps --filter "name=${containerName}" --format "{{.ID}}"`, {stdio: 'pipe'});
    if (containerID.length !== 0) {
        return true;
    }

    containerID = run(`docker ps --all --filter "name=${containerName}" --format "{{.ID}}"`, {stdio: 'pipe'});
    if (containerID.length !== 0) {
        return true;
    }

    return false
}

//
// exports
//

module.exports = {
    setup,
    install,

    'docker:build': docker_build,
    'docker:start': docker_start,
    'docker:stop': docker_stop,

    'sloppy:publish': sloppy_publish,
    'sloppy:delete': sloppy_delete,
    'sloppy:deploy': sloppy_deploy,

    'dropstack:build': dropstack_build,
    'dropstack:deploy': dropstack_deploy,

    'clean:docker': clean_docker,
    'clean:dropstack': clean_dropstack,
    'clean:sloppy': clean_sloppy,
    'clean:install': clean_install,
};
