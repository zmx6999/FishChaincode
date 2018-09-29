#!/bin/bash
export PATH=$PWD/../../bin:$PATH

if [ ! -d crypto-config ]; then mkdir crypto-config; else rm -rf crypto-config/*; fi
cryptogen generate --config=crypto-config.yaml
if [ $? != 0 ]; then echo "failed to generate crypto"; exit 1; fi

if [ ! -d config ]; then mkdir config; else rm -rf config/*; fi
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock config/genesis.block
if [ $? != 0 ]; then echo "failed to generate genesis.block"; exit 1; fi

configtxgen -profile TwoOrgsChannel -outputCreateChannelTx config/channel.tx -channelID mychannel
if [ $? != 0 ]; then echo "failed to create channel"; exit 1; fi

configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate config/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP
if [ $? != 0 ]; then echo "failed to update anchor peer for Org1MSP"; exit 1; fi
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate config/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP
if [ $? != 0 ]; then echo "failed to update anchor peer for Org2MSP"; exit 1; fi