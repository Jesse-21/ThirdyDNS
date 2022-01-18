import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ENSRegistry, FIFSRegistrar, Resolver } from "../typechain-types";

const namehash = require("eth-ens-namehash");

const labelhash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

let ensRegistry: ENSRegistry;
let registrar: FIFSRegistrar;
let resolver: Resolver;

let deployer: SignerWithAddress;
let account1: SignerWithAddress;
let accounts: SignerWithAddress[];

describe("ENS", function () {
  beforeEach(async function () {
    [deployer, account1, ...accounts] = await ethers.getSigners();
    console.log("deployer ", deployer.address);
    console.log("account1 ", account1.address);

    const rootNode = namehash.hash("world");

    const ENSRegistry = await ethers.getContractFactory("ENSRegistry");
    ensRegistry = (await ENSRegistry.deploy()) as ENSRegistry;
    await ensRegistry.deployed();

    const FIFSRegistrar = await ethers.getContractFactory("FIFSRegistrar");
    registrar = (await FIFSRegistrar.deploy(ensRegistry.address, rootNode)) as FIFSRegistrar;
    await registrar.deployed();

    const PublicResolver = await ethers.getContractFactory("Resolver");
    resolver = (await PublicResolver.deploy(ensRegistry.address)) as Resolver;
    await resolver.deployed();
  });

  it("Register a new name", async function () {
    const label = labelhash("world");

    const tx = await registrar.connect(deployer).register(label, account1.address);
    await tx.wait();

    ensRegistry.on("NewOwner", (args) => {
      console.log(args);
    });

    //expect(await ensRegistry.owner("0x0")).equal(deployer.address);
    expect(await ensRegistry.owner(namehash.hash("world"))).equal(account1.address);
  });
});
