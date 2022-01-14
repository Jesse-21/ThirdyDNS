import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from "../typechain-types";

let greeter: Greeter;
let deployer: SignerWithAddress;
let account1: SignerWithAddress;
let accounts: SignerWithAddress[];

describe("Greeter", function () {
  beforeEach(async function () {
    [deployer, account1, ...accounts] = await ethers.getSigners();

    const Greeter = await ethers.getContractFactory("Greeter");
    greeter = (await Greeter.deploy("Hello, world!")) as Greeter;
    await greeter.deployed();
  });

  it("Should deploy Greeter", async function () {
    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Merhaba Dünya!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Merhaba Dünya!");
  });
});
