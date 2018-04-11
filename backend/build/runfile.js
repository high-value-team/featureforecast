const { help, run } = require('runjs');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const fs = require('fs');

//
// tasks
//

function setup() {
    const envFiles = ['env.dropstack'];
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
            run(`cp examples/${filename} .`);
            console.log(`Please edit this file!`)
        }
    });
}
help(setup, 'Create environment files, e.g. env.dropstack. Please edit files with useful values!');

function build () {
    const srcDir = `${__dirname}/../src`;
    const binDir = `${__dirname}/bin.${timestamp()}`;

    // create bin folder
    run(`mkdir -p ${binDir}`);
    run(`mkdir -p ${binDir}/db`);

    const buildBackend = `docker run -i -v ${binDir}:/binDir -v ${srcDir}:/srcDir mono sh << EOF 
msbuild /p:OutDir=/binDir /srcDir/featureforecast/featureforecast.sln
EOF
`;
    run(buildBackend);
}
help(build, 'Run backend build scripts');

function start () {
    const binPath = findNewestBinFolder();
    if (binPath === undefined) {
        console.log('No bin-folder found. Please execute a "build" job first!');
        return
    }

    stop();

    console.log("starting backend in docker container")
    const startBackend = `docker run --name=featureforecast-backend --interactive --env FEATUREFORECAST_BACKEND_DATABASEPATH=/mnt --publish "127.0.0.1:8080:80" --volume ${binPath}:/workdir mono sh << EOF
mono /workdir/ff.server.exe
EOF`;
    run(startBackend);
}
help(start, 'Start backend in docker container. Please execute "run stop" to manually stop the container!');

function stop () {
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

function deploy () {
    const binPath = findNewestBinFolder();
    if (binPath === undefined) {
        console.log('No bin-folder found. Please execute a "build" job first!');
        return
    }

    const deployPath = `deploy.${timestamp()}`;
    const createDeployFolder = `cp -r ${binPath} ${deployPath}`;
    run(createDeployFolder);

    // create and write .dropstack.json in deploy folder
    const dropstackEnv = loadEnvironment('env.dropstack');
    var file = fs.readFileSync('template.dropstack.json', 'utf8');
    var parsedFile = interpolate(file, dropstackEnv);
    fs.writeFileSync(`${deployPath}/.dropstack.json`, parsedFile);

    // create Dockerfile
    var dockerfile = fs.readFileSync('template.Dockerfile', 'utf8');
    fs.writeFileSync(`${deployPath}/Dockerfile`, dockerfile);

    const deployToDropstack = `cd ${deployPath} && dropstack deploy --compress --verbose --alias ${dropstackEnv.DROPSTACK_ALIAS}.cloud.dropstack.run --type mono --stateful --token ${dropstackEnv.DROPSTACK_TOKEN}`;
    run(deployToDropstack);
}
help(deploy, 'Create deploy folder and deploy to Dropstack');


function clean_build() {
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^bin\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const removeDirectory = `rm -rf ${file}`;
            run(removeDirectory);
        }
    });

}
help(clean_build, 'Remove all "bin" folders');


function clean_deploy() {
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^deploy\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
            const removeDirectory = `rm -rf ${file}`;
            run(removeDirectory);
        }
    })
}
help(clean_deploy, 'Remove all "deploy" folders');


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

function findNewestBinFolder() {
    let binFolders = [];
    fs.readdirSync('.').forEach(file => {
        if (fs.statSync(file).isDirectory() && file.match(/^bin\.[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}$/)) {
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
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDay())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

//
// exports
//

module.exports = {
    setup,
    build,
    start,
    stop,
    deploy,
    'clean:build': clean_build,
    'clean:deploy': clean_deploy,
};