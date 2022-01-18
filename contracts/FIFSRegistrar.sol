//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ENS.sol";

contract FIFSRegistrar {
    ENS private ens;
    bytes32 private rootNode;

    uint256 constant defaultExpireTime = 4 weeks;
    mapping(bytes32 => uint256) public expiryTimes;

    event Mama();

    /**
     * Constructor.
     * @param ensRegistryAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    constructor(address ensRegistryAddr, bytes32 node) {
        ens = ENS(ensRegistryAddr);
        rootNode = node;
    }

    /**
     * Register a new name
     * @param label The hash of the label to register
     * @param owner The address of the new owner
     */
    function register(bytes32 label, address owner) public {
        require(expiryTimes[label] < block.timestamp, "Name is already taken");
        expiryTimes[label] = block.timestamp + defaultExpireTime;
        ens.setSubnodeOwner(rootNode, label, owner);
    }
}
