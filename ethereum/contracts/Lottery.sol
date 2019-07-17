pragma solidity ^0.4.19;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public playerRestriction {
        players.push(msg.sender);
    }

    function getRandomPlayer() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players))) % players.length;
    }

    function pickWinner() public managerRestriction {
        uint index = getRandomPlayer();
        address winner = players[index];
        winner.transfer(address(this).balance);
        players = new address[](0);
    }

    function returnPlayers() public managerRestriction view returns (address[]) {
        return players;
    }

    modifier managerRestriction() {
        require(msg.sender == manager,
            "Sender not authorized");
        _;
    }

    modifier playerRestriction {
        require(msg.value > 0.01 ether,
            "Insufficient funds");
        _;
    }
}