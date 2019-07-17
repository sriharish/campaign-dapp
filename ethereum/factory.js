import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';


const factoryInstance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x33255b982Af89fB70bD88f1ba86b2332bD6a1374'
);

export default factoryInstance;