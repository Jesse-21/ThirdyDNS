import { FIFSRegistrar } from "./../typechain-types/FIFSRegistrar";
import { ENS } from "./../typechain-types/ENS";
import { utils } from "ethers";
import { DeployedContract } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { IResolver } from "../typechain-types";

const ROOT_NODE = "awesome";
let ZERO_ADDRESS: string;
const namehash = require("eth-ens-namehash");
const labelhash = (label: string) => utils.keccak256(utils.toUtf8Bytes(label));

module.exports = async ({ getNamedAccounts, deployments, ethers }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  ZERO_ADDRESS = ethers.utils.formatBytes32String("0");

  const registry = await deploy("ENSRegistry", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  //Deploy the resolver
  const resolver = await deploy("Resolver", {
    from: deployer,
    args: [registry.address],
    log: true,
    waitConfirmations: 5,
  });

  //Deploy FIFSRegistrar
  const registrar = await deploy("FIFSRegistrar", {
    from: deployer,
    args: [registry.address, namehash.hash(ROOT_NODE)],
    log: true,
    waitConfirmations: 5,
  });

  const deployedRegistry = (await ethers.getContractAt("ENSRegistry", registry.address, deployer)) as ENS;
  const deployedResolver = (await ethers.getContractAt("Resolver", resolver.address, deployer)) as IResolver;
  const deployedRegistrar = (await ethers.getContractAt("FIFSRegistrar", registrar.address, deployer)) as FIFSRegistrar;

  //await setupResolver(deployedRegistry, deployedRegistrar, deployedResolver, deployer);

  deployedRegistry.setSubnodeOwner(ZERO_ADDRESS, labelhash(ROOT_NODE), registrar.address);
};

async function setupResolver(ens: ENS, registrar: FIFSRegistrar, resolver: IResolver, account: string) {
  const resolverNode = namehash.hash("resolver");
  const resolverLabel = labelhash("resolver");

  await ens.connect(registrar.signer).setSubnodeOwner(ZERO_ADDRESS, resolverLabel, account);
  await ens.connect(registrar.signer).setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);
}

module.exports.tags = ["ENS"];
