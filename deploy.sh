#!/usr/bin/env bash
cd /home/ubuntu/BEPAsset
changed=0
git remote update && git status -uno | grep -q 'Your branch is behind' && changed=1
if [ $changed = 1 ]; then
    git pull origin master;
    cd bnbridge
    yarn install
    yarn run build
    cp -Rv build /var/www/html
    echo "Updated successfully";
else
    echo "Up-to-date"
fi
# Simple deploy script for Backend Manager whenever it catches a commit
# It will run on intervals of 1 minute and build can take up to 5 - 10
# minutes to fully finish and deploy
