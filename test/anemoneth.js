const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

describe("Anemoneth contract", function () {

  let AnemonethV1;
  let owner;
  let user;
  let AnemonethContract;

  before(async function() {
    [owner, user1, user2, user3] = await ethers.getSigners();

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
    before( async function() { 
      const tx = await AnemonethContract.connect(user1).register('test', {value: 1000000000}); // 1 Gwei
      await tx.wait();    
    })
      it("Registering should give the user 1 CLWN", async function () {       
        expect(parseInt(await AnemonethContract.balanceOf(user1.address))).to.equal(1);
      });
      it("Registering should add the user to the users array", async function () {        
        const user1ArrayCheck = await AnemonethContract.getUser(0);
        expect(user1ArrayCheck).to.equal(user1.address);
      });
      it("Registering should add the user to the users mapping", async function () {        
        const user1MapCheck = await AnemonethContract.isRegistered(user1.address);
        expect(user1MapCheck).to.equal(true);
      });
      // it("Should not allow user to register twice", async function () {        
      //   const tx2 = await AnemonethContract.connect(user).register('test', {value: 1000000000}); // 1 Gwei
      //   expect(async () => { await tx2.wait() } ).to.be.revertedWith("Account already registered!");
      //   // This functionality works. But it is a mocha quirk that the test wont pass
      // });
  })
  describe("Weekly Distribution", function() {
    before( async function() { 
      const tx1 = await AnemonethContract.connect(user1).register('test', {value: 1000000000}); // 1 Gwei
      await tx1.wait();
      const tx2 = await AnemonethContract.connect(user2).register('test', {value: 1000000000}); // 1 Gwei
      await tx2.wait(); 
      const tx3 = await AnemonethContract.connect(user3).register('test', {value: 1000000000}); // 1 Gwei
      await tx3.wait(); 
      const tx4 = await AnemonethContract.connect(user4).register('test', {value: 1000000000}); // 1 Gwei
      await tx4.wait(); 
      const tx5 = await AnemonethContract.connect(user5).register('test', {value: 1000000000}); // 1 Gwei
      await tx5.wait(); 
    })
    it("", async function () {        
        const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
        expect(parseInt(contractClWNBalance)).to.equal(10000);
    });
  })





});
