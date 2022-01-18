//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IResolver {
    event AddrChanged(bytes32 indexed node, address _addr);

    function addr(bytes32 node) external view returns (address);

    function setAddr(bytes32 node, address _addr) external;

    function supportsInterface(bytes4 interfaceID) external returns (bool);
}
