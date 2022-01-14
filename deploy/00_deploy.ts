import { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const result = await deploy("Greeter", {
    from: deployer,
    args: ["Hello world!"],
    log: true,
    waitConfirmations: 5,
  });

  /*   await deploy("AnotherContract", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 5,
  }); */
};
module.exports.tags = ["Greeter"];
