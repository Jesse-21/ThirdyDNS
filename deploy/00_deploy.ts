import { HardhatRuntimeEnvironment } from "hardhat/types";

const ROOT_NODE = "awesome";

const namehash = require("eth-ens-namehash");

module.exports = async ({ getNamedAccounts, deployments, ethers }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("SimpleENS", {
    from: deployer,
    args: [namehash.hash(ROOT_NODE)],
    log: true,
    waitConfirmations: 5,
  });
};

module.exports.tags = ["ENS"];
