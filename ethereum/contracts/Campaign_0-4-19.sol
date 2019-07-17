pragma solidity ^0.4.19;

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
        require(msg.value > minimumContribution);
        _;
    }

    modifier isManagerRestriction() {
        require(msg.sender == manager);
        _;
    }

    modifier approverRestriction(uint requestIndex) {
        require(approvers[msg.sender]);
        require(!requests[requestIndex].approvals[msg.sender]);
        _;
    }

    function Campaign(uint minContribution, address owner) public {
        require(minContribution > 0);
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

        require(request.approvalCount * 2 > approverCount);
        require(!request.complete);
        require(request.value < address(this).balance);

        // send money
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}