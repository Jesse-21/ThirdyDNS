//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ENS.sol";

contract FIFSRegistrar is Ownable {
    ENS private ens;
    bytes32 rootNode;

    uint256 constant defaultExpireTime = 4 weeks;
    mapping(bytes32 => uint256) public expiryTimes;

    // A map of addresses that are authorised to register and renew names.
    mapping(address => bool) public controllers;

    /**
     * Constructor.
     * @param ensRegistryAddr The address of the ENS registry.
     * @param node The node that this registrar administers.
     */
    constructor(address ensRegistryAddr, bytes32 node) {
        ens = ENS(ensRegistryAddr);
        rootNode = node;
        controllers[msg.sender] = true; //Add contract owner to the controller
    }

    /**
     * Register a new name
     * @param label The hash of the label to register
     * @param owner The address of the new owner
     */
    function register(bytes32 label, address owner) public onlyController {
        require(expiryTimes[label] < block.timestamp, "Name is already taken");
        expiryTimes[label] = block.timestamp + defaultExpireTime;
        ens.setSubnodeOwner(rootNode, label, owner);
    }

    // Authorises a controller, who can register and renew domains.
    function addController(address controller) external onlyOwner {
        controllers[controller] = true;
    }

    // Revoke controller permission for an address.
    function removeController(address controller) external onlyOwner {
        controllers[controller] = false;
    }

    modifier onlyController() {
        require(
            controllers[msg.sender] == true,
            "Only registered controllers can call this function"
        );
        _;
    }
}
