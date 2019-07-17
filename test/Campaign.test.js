const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
}
const web3 = new Web3(ganache.provider(), null, OPTIONS);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    // deploy new factory contract
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // store address of first deployed campaign (only one needed for tests)
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // get existing contract
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('contract creator set as manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    
    it('approver added to list after contribution', async () => {
        let isApprover = await campaign.methods.approvers(accounts[1]).call();
        let approverCount = await campaign.methods.approverCount().call();

        assert(!isApprover);
        assert.equal(approverCount, 0);

        await campaign.methods.contribute().send({
            value: '10000',
            from: accounts[1]
        });

        isApprover = await campaign.methods.approvers(accounts[1]).call();
        approverCount = await campaign.methods.approverCount().call();

        assert(isApprover);
        assert.equal(approverCount, 1);
    });

    it('request added to list', async () => {
        await campaign.methods.createRequest(1000, 'tires', accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });
        
        const request = await campaign.methods.requests(0).call();
        assert.equal('tires', request.description);
    });

    it('request fulfilled', async () => {
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: accounts[1]
        });

        await campaign.methods.createRequest(web3.utils.toWei('5', 'ether'), 'tires', accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        const request = await campaign.methods.requests(0).call();
        assert.equal(1, request.approvalCount);
        assert(request.complete);
        assert(balance > 104);
    });
});