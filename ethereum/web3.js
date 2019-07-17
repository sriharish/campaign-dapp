import Web3 from 'Web3';
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};
let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    const getProvider = async () => {
        await window.web3.currentProvider.enable(); // request authentication
    };
    getProvider();
    web3 = new Web3(window.web3.currentProvider, null, OPTIONS);
} else {
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/8425a14e866b41f3a282b8311091e034"
    );
    web3 = new Web3(provider, null, OPTIONS);
}

export default web3;