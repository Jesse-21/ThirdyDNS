pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./ENS.sol";

contract SimpleENS is ENS {
  using Counters for Counters.Counter;
  Counters.Counter private _registeredCount;

  //Node to owner address
  mapping(bytes32 => address) records;

  //Owner address to Node
  mapping(address => bytes32) nodes;

  mapping(bytes32 => uint256) public expiryTimes;

  uint256 constant DEFAULT_EXPIRE_TIME = 4 weeks;
  bytes32 rootNode;

  constructor(bytes32 _rootNode) {
    rootNode = _rootNode;
    records[rootNode] = msg.sender;
  }

  function register(
    bytes32 node,
    bytes32 label,
    address owner
  ) external onlyOwner(node) {
    require(expiryTimes[label] < block.timestamp, "Name is already taken");
    bytes32 subNode = keccak256(abi.encodePacked(node, label));
    records[subNode] = owner;
    nodes[owner] = subNode;
    expiryTimes[label] = block.timestamp + DEFAULT_EXPIRE_TIME;
    _registeredCount.increment();
  }

  function getAddress(bytes32 node) external view returns (address) {
    return records[node];
  }

  function getName(address addr) external view returns (bytes32) {
    return nodes[addr];
  }

  function getRegisteredCount() external view returns (uint256) {
    return _registeredCount.current();
  }

  function recordExists(bytes32 node) external view returns (bool) {
    return records[node] != address(0);
  }

  modifier onlyOwner(bytes32 node) {
    require(records[node] == msg.sender || records[rootNode] == msg.sender, "Not the owner");
    _;
  }
}
