#!/usr/bin/env bash
# Should be called from project root directory

# Assumes to be on the ganache network
OPERATOR_ADDRESS=`cat config/addr.json | jq .ganache.operatorAddress -r`
formated_date=`date +%Y-%m-%dT%H:%M:%S`

# Create bridge
echo "{\"confirmations\": 0, \"minimumContractPayment\": \"0\", \"name\": \"test\", \"url\": \"http://host.docker.internal:4242\" }" | \
kubectl exec -i deployment/gweihir-gweihir-dev-chainlink-node -- \
bash -c "cat - > /home/root/bridge.json && chainlink admin login -f /chainlink/.api && chainlink bridges create /home/root/bridge.json"

# Create job
cat jobs/sample.toml | sed -e "s|__YOUR_OPERATOR_CONTRACT_ADDRESS__|$OPERATOR_ADDRESS|g" | \
sed -e "s|__VERSION__|$formated_date|g" | \
kubectl exec -i deployment/gweihir-gweihir-dev-chainlink-node -- \
bash -c "cat - > /home/root/job.toml && chainlink admin login -f /chainlink/.api && chainlink jobs create /home/root/job.toml"


