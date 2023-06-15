#!/usr/bin/env bash
# Should be called from project root directory

# Assumes to be on the testnet network
OPERATOR_ADDRESS=`cat config/addr.json | jq .testnet.operatorAddress -r`
formated_date=`date +%Y-%m-%dT%H:%M:%S`

# Create job
cat jobs/sample.toml | sed -e "s|__YOUR_OPERATOR_CONTRACT_ADDRESS__|$OPERATOR_ADDRESS|g" | \
sed -e "s|__VERSION__|$formated_date|g" 
