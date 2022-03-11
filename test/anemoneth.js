const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);


// VISIBILIITY OF WEEKLYEARNINGS/WEEKLYMINT/DISTRIBUTE/SETTLEUP MUST BE ALTERED TO PASS 1,2 AND 3

// CURRENT VISIBILITY WILL ONLY WORK FOR 4



describe.skip("Anemoneth contract instance 1, register and weeklyEarnings", function () {
  // Keeping so that we can de-bug specific functions more easily
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let AnemonethContract;

  before(async function() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

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
  })
  describe("WeeksEarners for 5 users", function() {
    before( async function() { 
      const tx2 = await AnemonethContract.connect(user2).register('test', {value: 1000000000}); // 1 Gwei
      await tx2.wait(); 
      const tx3 = await AnemonethContract.connect(user3).register('test', {value: 1000000000}); // 1 Gwei
      await tx3.wait(); 
      const tx4 = await AnemonethContract.connect(user4).register('test', {value: 1000000000}); // 1 Gwei
      await tx4.wait(); 
      const tx5 = await AnemonethContract.connect(user5).register('test', {value: 1000000000}); // 1 Gwei
      await tx5.wait();
    });
    it("Should have 5 people register", async function () {        
        const userCount = await AnemonethContract.getUserCount();
        expect(userCount).to.equal(5);
    });    
    it("Should push earnings into weeklyInfoAr for the first time", async function () {    
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address], [user3.address, user4.address], [user5.address]);    
      const weeklyInfoArr = await AnemonethContract.getWeeklyInfoArrLength();
      expect(weeklyInfoArr).to.equal(1);
    });
    // it("Should allow for one tier to be empty", async function () {    
    //   await AnemonethContract.connect(owner).weeklyEarnings([user1.address]);    
    //   const weeklyInfoArr = await AnemonethContract.getWeeklyInfoArrLength();
    //   expect(weeklyInfoArr).to.equal(1);
    // });
    it("Should distribute correctly for LOW tier", async function () {    
      const historicalEarnings = await AnemonethContract.gethistoricalEarnings(0, user1.address);
      expect(historicalEarnings).to.equal(1);
    });
    it("Should distribute correctly for HIGH tier", async function () {
      const historicalEarnings = await AnemonethContract.gethistoricalEarnings(0, user5.address);
      expect(historicalEarnings).to.equal(3);
    });
    it("Should push earnings into weeklyInfoArr for the second time", async function () {    
      await AnemonethContract.connect(owner).weeklyEarnings([user5.address, user2.address], [user3.address, user4.address], [user1.address]);    
      const weeklyInfoArr = await AnemonethContract.getWeeklyInfoArrLength();
      expect(weeklyInfoArr).to.equal(2);
    });
    it("Should distribute the second round correctly", async function () {    
      const historicalEarnings = await AnemonethContract.gethistoricalEarnings(1, user1.address);
      expect(historicalEarnings).to.equal(3);
    });
  })
});

describe.skip("Anemoneth contract instance 2, minting", function () { 
  // Keeping so that we can de-bug specific functions more easily
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let AnemonethContract;
  
  before(async function() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000]);

    await AnemonethContract.deployed();

    const tx = await AnemonethContract.connect(user1).register('test', {value: 1000000000}); // 1 Gwei
    await tx.wait();
    const tx2 = await AnemonethContract.connect(user2).register('test', {value: 1000000000}); // 1 Gwei
    await tx2.wait(); 
    const tx3 = await AnemonethContract.connect(user3).register('test', {value: 1000000000}); // 1 Gwei
    await tx3.wait(); 
    const tx4 = await AnemonethContract.connect(user4).register('test', {value: 1000000000}); // 1 Gwei
    await tx4.wait(); 
    const tx5 = await AnemonethContract.connect(user5).register('test', {value: 1000000000}); // 1 Gwei
    await tx5.wait();

  });

  describe("Minting", function() { 
    it("Contract address should have 9995 CLWN before weekly mint", async function () {       
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(9995);
    });
    it("Contract address should have 10004 CLWN after first weekly mint", async function () {    
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address], [user3.address, user4.address], [user5.address]);
      await AnemonethContract.connect(owner).weeklyMint();   
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(10004);
    });
    it("Contract address should handle second weekly mint", async function () {    
      await AnemonethContract.connect(owner).weeklyEarnings([user5.address, user2.address], [user3.address, user4.address], [user1.address]);
      await AnemonethContract.connect(owner).weeklyMint();   
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(10013);
    });
  })
})

describe.skip("Anemoneth contract instance 3, distribution", function () { 
  // Keeping so that we can de-bug specific functions more easily
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let AnemonethContract;
  
  before(async function() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000]);

    await AnemonethContract.deployed();

    const tx = await AnemonethContract.connect(user1).register('test', {value: 1000000000}); // 1 Gwei
    await tx.wait();
    const tx2 = await AnemonethContract.connect(user2).register('test', {value: 1000000000}); // 1 Gwei
    await tx2.wait(); 
    const tx3 = await AnemonethContract.connect(user3).register('test', {value: 1000000000}); // 1 Gwei
    await tx3.wait(); 
    const tx4 = await AnemonethContract.connect(user4).register('test', {value: 1000000000}); // 1 Gwei
    await tx4.wait(); 
    const tx5 = await AnemonethContract.connect(user5).register('test', {value: 1000000000}); // 1 Gwei
    await tx5.wait();

  });

  describe.skip("Distribution", function() { 
    it("Contract address should have 9995 CLWN before weekly mint", async function () {       
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(9995);
    });
    it("Contract address should have 10004 CLWN after first weekly mint", async function () {    
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address], [user3.address, user4.address], [user5.address], [user1.address, user2.address, user3.address, user4.address, user5.address]);
      await AnemonethContract.connect(owner).weeklyMint();   
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(10004);
    });
    it("CLWN should be distributed to those who earned in week 1 from Contract", async function () {    
      await AnemonethContract.connect(owner).distribute();
      const contractClWNBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClWNBalance).to.equal(9995);
    });
    it("User5 should have the expected increase of CLWN", async function () {
      const user5Balance = await AnemonethContract.balanceOf(user5.address);
      expect(user5Balance).to.equal(4);
    });
    it("User1 should have the expected increase of CLWN", async function () {
      const user1Balance = await AnemonethContract.balanceOf(user1.address);
      expect(user1Balance).to.equal(2);
    });
  })
})

describe.only("Anemoneth contract instance 4, settleUp", function () { 
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let user6;
  let AnemonethContract;
  
  before(async function() {
    [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000]);

    await AnemonethContract.deployed();

    const tx = await AnemonethContract.connect(user1).register('test', {value: 1000000000}); // 1 Gwei
    await tx.wait();
    const tx2 = await AnemonethContract.connect(user2).register('CANIGETTHIS', {value: 1000000000}); // 1 Gwei
    await tx2.wait(); 
    const tx3 = await AnemonethContract.connect(user3).register('test', {value: 1000000000}); // 1 Gwei
    await tx3.wait(); 
    const tx4 = await AnemonethContract.connect(user4).register('test', {value: 1000000000}); // 1 Gwei
    await tx4.wait(); 
    const tx5 = await AnemonethContract.connect(user5).register('test', {value: 1000000000}); // 1 Gwei
    await tx5.wait();
    await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], [user5.address], [user1.address, user2.address, user3.address, user4.address, user5.address]);

  });
  describe("First week", function() {
    it("Should not allow user to register twice", async function () {        
      await expect(AnemonethContract.connect(user1).register('test', {value: 1000000000})).to.be.revertedWith("Account already registered!");
    });
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyInfoArrLength();
      expect(weekNumber).to.equal(1);
    });
    it("Users should have a correct distribution", async function () {
      const user1Balance = await AnemonethContract.balanceOf(user1.address);
      expect(user1Balance).to.equal(2);
    });
    it("Users should have a correct distribution", async function () {
      const user5Balance = await AnemonethContract.balanceOf(user5.address);
      expect(user5Balance).to.equal(4);
    });
    it("Contract CLWN balance should not change", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(9995);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(9996);
    });
    it("mintViaOwner should work for the owner for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(10996);
    });
    it("should be able to return userNames", async function () {
      const userName = await AnemonethContract.connect(user2).getUserName(user2.address)
      expect(userName).to.equal("CANIGETTHIS");
    });
    it("should be able to return userNames", async function () {
      const userName = await AnemonethContract.connect(user1).getUserName(user1.address)
      expect(userName).to.equal("test");
    });
  })

  describe("Second week", function() {
    before(async function() {
      const tx6 = await AnemonethContract.connect(user6).register('test', {value: 1000000000}); // 1 Gwei
      await tx6.wait();
      await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], [user5.address, user6.address], [user1.address, user2.address, user3.address, user4.address, user5.address, user6.address]);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyInfoArrLength();
      expect(weekNumber).to.equal(2);
    });
    it("User 6 should be properly added and distributed to", async function () {
      const user6Balance = await AnemonethContract.balanceOf(user6.address);
      expect(user6Balance).to.equal(4);
    });
    it("User 5 should be properly distributed to", async function () {
      const user5Balance = await AnemonethContract.balanceOf(user5.address);
      expect(user5Balance).to.equal(7);
    });
    it("Contract CLWN balance should only be one less as a result of user6", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(10995);
    });
  })
  describe("Working w/ empty earning tier + non-earning users", function() {
    before(async function() {
      await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], [], [user1.address, user2.address, user3.address, user4.address]);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyInfoArrLength();
      expect(weekNumber).to.equal(3);
    });
    it("Only those that earned should be processed in settleUp", async function () {
      // Note: must be removed from _allEarners and _weeklyTierEarners arrays in settleUp
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyEarnersCount();
      expect(weekNumber).to.equal(4);
    });
  })
  describe("Non-Active week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).settleUp([], [], [], []);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyInfoArrLength();
      expect(weekNumber).to.equal(4);
    });
    it("Only those that earned should be processed in settleUp", async function () {
      // Note: must be removed from _allEarners and _weeklyTierEarners arrays in settleUp
      const weekNumber = await AnemonethContract.connect(owner).getWeeklyEarnersCount();
      expect(weekNumber).to.equal(0);
    });
    it("Contract CLWN balance should not change", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(10995);
    });
  })
});