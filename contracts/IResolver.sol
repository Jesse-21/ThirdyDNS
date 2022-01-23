//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IResolver {
    event AddrChanged(bytes32 indexed node, address _addr);
    event NameChanged(bytes32 indexed node, string newName);

    function addr(bytes32 node) external view returns (address);

    function name(bytes32 node) external view returns (string memory);

    function setAddr(bytes32 node, address _addr) external;

    function setName(bytes32 node, string calldata newName) external;
}
