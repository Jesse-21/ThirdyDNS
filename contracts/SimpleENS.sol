// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract SimpleENS {
    event DomainRegistered(bytes32 indexed label, address owner);

    using Counters for Counters.Counter;
    Counters.Counter private _registeredCount;

    bytes32 rootNode;

    uint256 constant DEFAULT_EXPIRE_TIME = 4 weeks;
    mapping(bytes32 => uint256) public expiryTimes;

    //Node to owner address
    mapping(bytes32 => address) private records;

    //Owner address to ens node
    mapping(address => bytes32) private nodes;

    constructor(bytes32 _rootNode) {
        rootNode = _rootNode;
        records[_rootNode] = msg.sender;
    }

    function register(bytes32 label, address owner) external {
        require(expiryTimes[label] < block.timestamp, "Name is already taken");
        expiryTimes[label] = block.timestamp + DEFAULT_EXPIRE_TIME;
        _createSubnode(rootNode, label, owner);
    }

    function createSubnode(
        bytes32 _node,
        bytes32 label,
        address owner
    ) external onlyOwner(_node) {
        _createSubnode(_node, label, owner);
    }

    function _createSubnode(
        bytes32 _node,
        bytes32 label,
        address owner
    ) internal {
        bytes32 subNode = keccak256(abi.encodePacked(_node, label));
        records[subNode] = owner;
        nodes[owner] = subNode;

        _registeredCount.increment();
        emit DomainRegistered(label, owner);
    }

    function getAddress(bytes32 _node) external view returns (address) {
        return records[_node];
    }

    function node(address addr) external view returns (bytes32) {
        return nodes[addr];
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
