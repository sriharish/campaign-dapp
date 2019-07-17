pragma solidity ^0.4.25;

contract CampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        deployedCampaigns.push(new Campaign(minimum, msg.sender));
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approverCount;
    Request[] public requests;

    modifier isMinContributionRestriction() {
        require(msg.value > minimumContribution,
            'insufficient contribution');
            _;
    }

    modifier isManagerRestriction() {
        require(msg.sender == manager,
            'unauthorized transaction');
            _;
    }

    modifier approverRestriction(uint requestIndex) {
        require(approvers[msg.sender],
            'unauthorized transaction');
        require(!requests[requestIndex].approvals[msg.sender],
            'only one approval allowed per approver');
            _;
    }

    constructor(uint minContribution, address owner) public {
        require(minContribution > 0,
            'minimum contribution must be greater than 0 Wei');
        minimumContribution = minContribution;
        manager = owner;
        approverCount = 0;
    }

    function contribute() public payable isMinContributionRestriction {
        approvers[msg.sender] = true;
        approverCount++;
    }

    function createRequest(uint requestedAmount, string reason, address vendor) public isManagerRestriction {
        Request memory newRequest = Request({
            description: reason,
            value: requestedAmount,
            recipient: vendor,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public approverRestriction(index) {
        Request storage request = requests[index];

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public isManagerRestriction {
        Request storage request = requests[index];

        require(request.approvalCount * 2 > approverCount,
            'request not yet approved');
        require(!request.complete,
            'request is already complete');
        require(request.value < address(this).balance,
            'insufficient funds');

        // send money
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approverCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}