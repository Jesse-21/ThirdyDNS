//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IResolver.sol";
import "./ENS.sol";

contract Resolver is IResolver {
    mapping(bytes32 => address) addresses;
    mapping(bytes32 => string) names;

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

    //Sets the name associated with an ENS node, for reverse records.
    function setName(bytes32 node, string calldata newName) external virtual {
        names[node] = newName;
        emit NameChanged(node, newName);
    }

    //Returns the name associated with an ENS node, for reverse records.
    function name(bytes32 node) external view virtual returns (string memory) {
        return names[node];
    }

    modifier onlyOwner(bytes32 node) {
        require(ens.owner(node) == msg.sender, "Not the owner");
        _;
    }

    fallback() external {
        revert();
    }
}
