//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ENS {
    event Transfer(bytes32 indexed node, address owner);
    event NewResolver(bytes32 indexed node, address resolver);
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address _owner);
    event NewTTL(bytes32 indexed node, uint64 ttl);

    function owner(bytes32 node) external view returns (address);

    function resolver(bytes32 node) external view returns (address);

    function ttl(bytes32 node) external view returns (uint64);

    function setOwner(bytes32 node, address _owner) external;

    function setResolver(bytes32 node, address _resolver) external;

    function setTTL(bytes32 node, uint64 _ttl) external;

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external;

    function setRecord(
        bytes32 node,
        address _owner,
        address _resolver,
        uint64 _ttl
    ) external;

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner,
        address _resolver,
        uint64 _ttl
    ) external;

    /*     function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);
 */
    function recordExists(bytes32 node) external view returns (bool);
}
