import { registrarAddress, ensRegistryAddress, resolverAddress } from "./../constants";
import { ethers } from "ethers";
import Registrar from "../artifacts/contracts/FIFSRegistrar.sol/FIFSRegistrar.json";
import Registry from "../artifacts/contracts/ENSRegistry.sol/ENSRegistry.json";
import Resolver from "../artifacts/contracts/Resolver.sol/Resolver.json";
import { ENS, FIFSRegistrar, IResolver } from "../typechain-types";

export const rpcProvider =
  process.env.NODE_ENV === "production"
    ? new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ROPSTEN_URL)
    : new ethers.providers.JsonRpcProvider();

export function getRegistrar(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(registrarAddress, Registrar.abi, provider) as FIFSRegistrar;
}

export function getENS(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(ensRegistryAddress, Registry.abi, provider) as ENS;
}

export function getResolver(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(resolverAddress, Resolver.abi, provider) as IResolver;
}
