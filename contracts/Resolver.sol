//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IResolver.sol";
import "./ENS.sol";

contract Resolver is IResolver {
    mapping(bytes32 => address) addresses;

    ENS ens;

    constructor(address ensRegistry) {
        ens = ENS(ensRegistry);
    }

    function addr(bytes32 node) external view override returns (address) {
        return addresses[node];
    }

    function setAddr(bytes32 node, address _addr)
        external
        override
        onlyOwner(node)
    {
        addresses[node] = _addr;
        emit AddrChanged(node, _addr);
    }

    function supportsInterface(bytes4 interfaceID)
        external
        pure
        override
        returns (bool)
    {
        // 0x3b3b57de interface ID of addr
        // 0x01ffc9a7 interface ID of supportsInterface itself
        return interfaceID == 0x3b3b57de || interfaceID == 0x01ffc9a7;
    }

    modifier onlyOwner(bytes32 node) {
        require(ens.owner(node) == msg.sender, "Not the owner");
        _;
    }

    fallback() external {
        revert();
    }
}
