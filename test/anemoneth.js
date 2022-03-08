const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Anemoneth contract", function () {

  let AnemonethV1;
  let owner;
  let user;
  let AnemonethContract;

  before(async function() {
    [owner, user] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000]);

    await AnemonethContract.deployed();
  });
  describe("Deployment", function() {

    it("Should mint 10000 CLWN to the contract address", async function () {        
        const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
        expect(parseInt(contractClWNBalance)).to.equal(10000);
      });
      it("Should set the token name to anemoneth", async function () {    
        const contractName = await AnemonethContract.name();
        expect(contractName).to.equal("anemoneth");
      });
      it("Should set the token symbol to CLWN", async function () {    
        const contractSymbol = await AnemonethContract.symbol();
        expect(contractSymbol).to.equal("CLWN");
      });
      it("Should set a cap of 9,000,000,000,000 CLWN (9 Trillion)", async function () {    
        const clwnCap = await AnemonethContract.cap();
        expect(parseInt(clwnCap)).to.equal(9000000000000);
      });
  })

  describe("Registration", function() {

    it("Registering should give the user 1 CLWN per Gwei sent", async function () {        
        const tx = await AnemonethContract.connect(user).register('test', {value: 1000000000}); // 1 Gwei
        
        await tx.wait();
    
        expect(parseInt(await AnemonethContract.balanceOf(user.address))).to.equal(1);
      });
      it("Registering should add the user to the users array", async function () {        
        const tx = await AnemonethContract.connect(user).register('test', {value: 1000000000}); // 1 Gwei
        await tx.wait();
        const user1ArrayCheck = await AnemonethContract.getUser(0);
        expect(user1ArrayCheck).to.equal(user.address);
      });
  })





});
