//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ENS {
  event DomainRegistered(bytes32 indexed node, address owner);

  function register(
    bytes32 node,
    bytes32 label,
    address owner
  ) external;

  function getAddress(bytes32 node) external view returns (address);

  function getName(address addr) external view returns (bytes32);

  function getRegisteredCount() external view returns (uint256);

  function recordExists(bytes32 node) external view returns (bool);
}
