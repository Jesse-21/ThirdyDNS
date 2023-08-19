import { SimpleENS } from "./../typechain-types/SimpleENS";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

const namehash = require("eth-ens-namehash");

const labelhash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

const rootNode = namehash.hash("thirdy");

let ens: SimpleENS;

let deployer: SignerWithAddress;
let account1: SignerWithAddress;
let account2: SignerWithAddress;

describe("ENS", function () {
  beforeEach(async function () {
    [deployer, account1, account2] = await ethers.getSigners();

    const ENS = await ethers.getContractFactory("SimpleENS");
    ens = (await ENS.deploy(rootNode)) as SimpleENS;
    await ens.deployed();
  });

  it("can register a new name", async function () {
    const newName = "yourname";
    const registeredNode = namehash.hash(`${newName}.thirdy`);

    //Register yourname.thirdy
    let tx = await ens.connect(account1).register(newName, account1.address);
    await tx.wait();

    expect(await ens.getAddress(registeredNode)).equal(account1.address);
    const names = await ens.getNames(account1.address);
    expect(names[0]).equal(newName);
  });

  it("can add subdomain", async function () {
    const newName = "sercan";
    const hashedNewName = labelhash(newName);
    const node = namehash.hash(`${newName}.thirdy`);

    const subDomain = "yourname";
    const expectedHash = namehash.hash("yourname.sercan.thirdy");

    //Create sercan.awesome
    let tx = await ens.connect(account1).register(newName, account1.address);
    await tx.wait();

    //Create yektas.sercan.awesome
    tx = await ens.connect(account1).createSubnode(node, subDomain, account1.address);
    await tx.wait();

    expect(await ens.getAddress(expectedHash)).equal(account1.address);
    expect(await ens.getNames(account1.address)).to.eql(["sercan", "yektas.sercan"]);
    expect(await ens.recordExists(expectedHash)).equal(true);
    expect(await ens.recordExists(namehash.hash("wrong.thirdy"))).equal(false);
    expect((await ens.totalRegisteredCount()).toNumber()).equal(2);
  });

  it("cannot register existing name", async function () {
    const newName = "sercan";
    const hashedNewName = labelhash(newName);

    //Register sercan.thirdy
    let tx = await ens.connect(account1).register(hashedNewName, account1.address);
    await tx.wait();

    expect(ens.connect(account1).register(hashedNewName, account1.address)).to.be.revertedWith("Name is already taken");
  });

  it("non-owner cannot register subnode ", async function () {
    const newName = "sercan";
    const hashedNewName = labelhash(newName);
    const node = namehash.hash(`${newName}.thirdy`);

    //Register sercan.awesome
    let tx = await ens.connect(account1).register(hashedNewName, account1.address);
    await tx.wait();

    expect(ens.connect(account2).createSubnode(node, newName, account2.address)).to.be.revertedWith("Not the owner");
    expect(ens.connect(account2).createSubnode(node, "haha", account2.address)).to.emit(ens, "DomainRegistered");
  });
});
