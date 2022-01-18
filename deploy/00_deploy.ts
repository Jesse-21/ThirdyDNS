import { HardhatRuntimeEnvironment } from "hardhat/types";
const namehash = require("eth-ens-namehash");

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const registry = await deploy("ENSRegistry", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  await deploy("FIFSRegistrar", {
    from: deployer,
    args: [registry.address, namehash.hash("awesome")],
    log: true,
    waitConfirmations: 5,
  });

  await deploy("Resolver", {
    from: deployer,
    args: [registry.address],
    log: true,
    waitConfirmations: 5,
  });
};
module.exports.tags = ["ENS"];
