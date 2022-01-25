import { ensAddress } from "./../constants";
import { ethers } from "ethers";
import { SimpleENS } from "../typechain-types";
import ens from "../artifacts/contracts/SimpleENS.sol/SimpleENS.json";

export const rpcProvider =
  process.env.NODE_ENV === "production"
    ? new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ROPSTEN_URL)
    : new ethers.providers.JsonRpcProvider();

export function getENS(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(ensAddress, ens.abi, provider) as SimpleENS;
}
