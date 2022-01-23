import { ENS } from "./../typechain-types/ENS";
import { utils } from "ethers";
import { DeployedContract } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const ROOT_NODE = "awesome";

const namehash = require("eth-ens-namehash");
const labelhash = (label: string) => utils.keccak256(utils.toUtf8Bytes(label));

module.exports = async ({ getNamedAccounts, deployments, ethers }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const ens = await deploy("SimpleENS", {
    from: deployer,
    args: [namehash.hash(ROOT_NODE)],
    log: true,
    waitConfirmations: 5,
  });

  const deployedENS = (await ethers.getContractAt("SimpleENS", ens.address, deployer)) as ENS;
};

module.exports.tags = ["ENS"];
