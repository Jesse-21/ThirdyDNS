import { ethers } from "ethers";
import { ensAddress } from "./constants";
import { SimpleENS } from "./typechain-types";
import ens from "./artifacts/contracts/SimpleENS.sol/SimpleENS.json";

const namehash = require("eth-ens-namehash");

export const nameHash = (name: string) => namehash.hash(name);

export const labelHash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

export const getEnsContract = (ethereum: any) => {
  if (!ethereum) return null;

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(ensAddress, ens.abi, signer);
};

export default function addressesEqual(addr1: string, addr2: string) {
  if (!addr1 || !addr2) return false;
  return addr1.toUpperCase() === addr2.toUpperCase();
}
