 rm -rf ~/.loan


echo "Init configuration"
loand init mynode --chain-id my-test-chain

echo "add validator keys to test backend"
loand keys add my_validator --keyring-backend test
MY_VALIDATOR_ADDRESS=$(loand keys show my_validator -a --keyring-backend test)

echo "add a genesis account to genesis.json"
loand add-genesis-account "$MY_VALIDATOR_ADDRESS" 100000000000000stake

echo "Generate a genesis tx carrying a self delegation"
loand gentx my_validator 100000000000stake --chain-id my-test-chain --keyring-backend test

echo "collect genesis txs and output a genesis.json file"
loand collect-gentxs



