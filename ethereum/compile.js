const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// delete existing build directory
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// get contract source
const contractPath = path.resolve(__dirname, 'contracts', 'Campaign_0-4-25.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// compile contract
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath);

for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}