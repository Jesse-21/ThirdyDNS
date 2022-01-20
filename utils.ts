import { ethers } from "ethers";
const namehash = require("eth-ens-namehash");

export const nameHash = (name: string) => namehash.hash(name);

export const labelHash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
