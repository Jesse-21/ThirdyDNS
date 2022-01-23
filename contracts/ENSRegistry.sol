//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ENS.sol";
import "./IResolver.sol";

contract ENSRegistry is ENS {
    struct Record {
        address owner;
        address resolver;
    }

    mapping(bytes32 => Record) records;

    constructor() {
        records[0x0].owner = msg.sender;
    }

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external override {
        bytes32 subNode = keccak256(abi.encodePacked(node, label));
        _setOwner(subNode, _owner);
        emit NewOwner(node, label, _owner);
    }

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner,
        address _resolver
    ) external override onlyOwner(node) {
        bytes32 subNode = keccak256(abi.encodePacked(node, label));
        records[subNode] = Record(_owner, _resolver);
        emit NewOwner(subNode, label, _owner);
    }

    function setOwner(bytes32 node, address _owner)
        external
        override
        onlyOwner(node)
    {
        _setOwner(node, _owner);
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

    function _setOwner(bytes32 node, address _owner) internal virtual {
        records[node].owner = _owner;
    }

    function recordExists(bytes32 node) external view override returns (bool) {
        return records[node].owner == address(0) ? false : true;
    }

    function owner(bytes32 node) external view override returns (address) {
        return records[node].owner;
    }

    function resolver(bytes32 node) external view override returns (address) {
        return records[node].resolver;
    }

    modifier onlyOwner(bytes32 node) {
        require(
            records[node].owner == msg.sender ||
                records[0x0].owner == msg.sender,
            "Not the owner"
        );

        _;
    }
}
