# ChainGraph EOSIO Mappings

Temporary repository for EOSIO contract mappings

## Documentation

<https://docs.chaingraph.io>

## Usage example

1. set a contract mappings `yarn mappings eos bkbbanktest3`
2. set an app manifest `yarn manifest bitcash_test`

### Contract mappings

```sh
# dBoard test
yarn mappings eos testproposal && yarn mappings eos testrefendu1 && yarn manifest dboard_test

# bitcash test
yarn mappings eos bkbtokentest && yarn mappings eos bkbmocktoken && yarn mappings eos bkbbanktest3 && yarn mappings eos delphioracle && yarn mappings eos bkbaccountst
yarn manifest bitcash_test
```
