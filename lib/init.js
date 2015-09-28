// set providor
if(!web3.currentProvider) // make sure we don't overwrite a provider set by Mist later on
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
