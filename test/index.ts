import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ENSRegistry, FIFSRegistrar, Resolver } from "../typechain-types";

const namehash = require("eth-ens-namehash");

const labelhash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

const rootNode = namehash.hash("awesome");

let ensRegistry: ENSRegistry;
let registrar: FIFSRegistrar;
let resolver: Resolver;

let deployer: SignerWithAddress;
let account1: SignerWithAddress;
let accounts: SignerWithAddress[];

describe("ENS", function () {
  beforeEach(async function () {
    [deployer, account1, ...accounts] = await ethers.getSigners();

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

  it("can register a new name, and set a resolver", async function () {
    const newENSName = "sercan";
    await registerNewName(newENSName, deployer, account1.address);
    const registeredName = namehash.hash(`${newENSName}.awesome`);

    let tx = await ensRegistry.connect(account1).setResolver(registeredName, resolver.address);
    await tx.wait();

    expect(await ensRegistry.owner(registeredName)).equal(account1.address);
    expect(await ensRegistry.resolver(registeredName)).equal(resolver.address);
  });

  it("can add subdomain", async function () {
    const newENSName = "sercan";

    const label = labelhash("yektas");
    const expectedHash = namehash.hash("yektas.sercan.awesome");
    const subRoot = namehash.hash("sercan.awesome");

    //Create sercan.world
    await registerNewName(newENSName, deployer, account1.address);

    //Create yektas.sercan.world
    let tx = await ensRegistry
      .connect(account1)
      .setSubnodeRecord(subRoot, label, account1.address, resolver.address, 5);
    await tx.wait();

    expect(await ensRegistry.owner(expectedHash)).equal(account1.address);
    expect(await ensRegistry.resolver(expectedHash)).equal(resolver.address);
    expect((await ensRegistry.ttl(expectedHash)).toNumber()).equal(5);
    expect(await ensRegistry.recordExists(expectedHash)).equal(true);
    expect(await ensRegistry.recordExists(namehash.hash("wrong.awesome"))).equal(false);
  });

  it("can register a name, set a resolver and, assign the account address", async function () {
    const newENSName = "sercan";
    await registerNewName(newENSName, deployer, account1.address);
    const registeredName = namehash.hash(`${newENSName}.awesome`);

    let tx = await ensRegistry.connect(account1).setResolver(registeredName, resolver.address);
    await tx.wait();

    tx = await resolver.connect(account1).setAddr(registeredName, account1.address);
    await tx.wait();

    expect(await resolver.addr(registeredName)).equal(account1.address);
  });
});

async function registerNewName(name: string, signer: SignerWithAddress, account: string) {
  const label = labelhash(name);
  let tx = await registrar.connect(signer).register(label, account);
  await tx.wait();
}
