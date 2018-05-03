#!/bin/sh

echo
echo "Replacing environment variables"
sh /replace.sh /usr/share/nginx/html/static/**/*
if [[ $? != 0 ]]
then
    echo "FAILED"
    exit 0;
fi
echo

echo "Rename files to invalidate cache"
unixTimestamp=$(date +%s)
for FILE in `find /usr/share/nginx/html/static/js/main.* -type f`
do
    oldFilename="${FILE##*/}"
    newFilename="main.$unixTimestamp.js"

    baseDir=$(dirname $FILE)
    oldFilepath=$FILE
    newFilepath="$baseDir/$newFilename"

    # rename js files
    mv $oldFilepath $newFilepath

    # rename index.html
    sed -i 's/'"$oldFilename"'/'"$newFilename"'/' /usr/share/nginx/html/service-worker.js
    sed -i 's/'"$oldFilename"'/'"$newFilename"'/' /usr/share/nginx/html/index.html
    sed -i 's/'"$oldFilename"'/'"$newFilename"'/' /usr/share/nginx/html/asset-manifest.json
done

echo "starting NGINX"
nginx -g "daemon off;"
