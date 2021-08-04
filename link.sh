#!/bin/bash
# link to local copy for development of sample apps
rm -rf ./lib/node_modules ./samples/node_modules
pushd ./lib
npm install
sudo npm link
npm run build
popd

pushd ./samples
npm install
npm link @pubnub/react-chat-components
popd


pushd ./lib
sudo npm link ../samples/node_modules/react
sudo npm link ../samples/node_modules/pubnub-react
popd

pushd ./samples/node_modules/pubnub-react
npm link react
popd