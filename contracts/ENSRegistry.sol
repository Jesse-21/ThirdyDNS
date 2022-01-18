//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ENS.sol";
import "./IResolver.sol";

contract ENSRegistry is ENS {
    struct Record {
        address owner;
        address resolver;
        uint64 ttl;
    }

    mapping(bytes32 => Record) records;

    address registrar;

    constructor() {
        registrar = msg.sender;
    }

    function setRecord(
        bytes32 node,
        address _owner,
        address _resolver,
        uint64 _ttl
    ) external override onlyRegistrar {
        records[node] = Record(_owner, _resolver, _ttl);
    }

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner,
        address _resolver,
        uint64 _ttl
    ) external override {
        bytes32 subNode = keccak256(abi.encodePacked(node, label));
        records[subNode] = Record(_owner, _resolver, _ttl);
    }

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external override {
        bytes32 subNode = keccak256(abi.encodePacked(node, label));
        records[subNode].owner = _owner;
        emit NewOwner(node, label, _owner);
    }

    function setOwner(bytes32 node, address _owner)
        external
        override
        onlyOwner(node)
    {
        records[node].owner = _owner;
        emit Transfer(node, _owner);
    }

    function setResolver(bytes32 node, address _resolver)
        external
        override
        onlyOwner(node)
    {
        records[node].resolver = _resolver;
        emit NewResolver(node, _resolver);
    }

    function setTTL(bytes32 node, uint64 _ttl)
        external
        override
        onlyOwner(node)
    {
        records[node].ttl = _ttl;
        emit NewTTL(node, _ttl);
    }

    /*     function setApprovalForAll(address operator, bool approved) external {}

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool)
    {
        return true;
    } */

    function recordExists(bytes32 node) external view override returns (bool) {
        return records[node].owner == address(0) ? false : true;
    }

    function owner(bytes32 node) external view override returns (address) {
        return records[node].owner;
    }

    function resolver(bytes32 node) external view override returns (address) {
        return records[node].resolver;
    }

    function ttl(bytes32 node) external view override returns (uint64) {
        return records[node].ttl;
    }

    modifier onlyOwner(bytes32 node) {
        require(records[node].owner == msg.sender, "Not the owner");
        _;
    }

    modifier onlyRegistrar() {
        require(
            registrar == msg.sender,
            "Only registrar can create new record"
        );
        _;
    }
}
