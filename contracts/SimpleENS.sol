// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract SimpleENS {
    event DomainRegistered(string indexed label, address indexed owner);

    using Counters for Counters.Counter;
    Counters.Counter private _registeredCount;

    bytes32 rootNode;

    uint256 constant DEFAULT_EXPIRE_TIME = 4 weeks;
    mapping(bytes32 => uint256) public expiryTimes;

    //Node to owner address
    mapping(bytes32 => address) private records;

    mapping(bytes32 => string) private names;

    //Owner address to ens nodes
    mapping(address => bytes32[]) private userNodes;

    constructor(bytes32 _rootNode) {
        rootNode = _rootNode;
        records[_rootNode] = msg.sender;
    }

    function register(string calldata label, address owner) external {
        bytes32 hashedLabel = keccak256(abi.encodePacked(label));
        require(
            expiryTimes[hashedLabel] < block.timestamp,
            "Name is already taken"
        );
        expiryTimes[hashedLabel] = block.timestamp + DEFAULT_EXPIRE_TIME;
        bytes32 subNode = _createSubnode(rootNode, hashedLabel, owner);
        names[subNode] = label;
    }

    function createSubnode(
        bytes32 _node,
        string calldata label,
        address owner
    ) external onlyOwner(_node) {
        bytes32 hashedLabel = keccak256(abi.encodePacked(label));
        bytes32 subNode = _createSubnode(_node, hashedLabel, owner);
        names[subNode] = string(abi.encodePacked(label, ".", names[_node]));
    }

    function _createSubnode(
        bytes32 _node,
        bytes32 labelHash,
        address owner
    ) internal returns (bytes32) {
        bytes32 subNode = keccak256(abi.encodePacked(_node, labelHash));
        records[subNode] = owner;
        userNodes[owner].push(subNode);
        _registeredCount.increment();
        emit DomainRegistered(names[subNode], owner);
        return subNode;
    }

    function getAddress(bytes32 _node) external view returns (address) {
        return records[_node];
    }

    function nodes(address addr) external view returns (bytes32[] memory) {
        return userNodes[addr];
    }

    function getNames(address addr) external view returns (string[] memory) {
        uint256 totalNodes = userNodes[addr].length;
        string[] memory userDomains = new string[](totalNodes);
        for (uint256 i = 0; i < totalNodes; i++) {
            userDomains[i] = names[userNodes[addr][i]];
        }
        return userDomains;
    }

    function recordExists(bytes32 _node) external view returns (bool) {
        return records[_node] != address(0);
    }

    function totalRegisteredCount() external view returns (uint256) {
        return _registeredCount.current();
    }

    modifier onlyOwner(bytes32 _node) {
        require(
            records[_node] == msg.sender || records[rootNode] == msg.sender,
            "Not the owner"
        );
        _;
    }
}
