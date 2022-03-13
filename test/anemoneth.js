const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

describe("Anemoneth contract instance 4, settleUp", function () { 
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
    await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], [user5.address]);

  });
  describe("First week", function() {
    it("Should not allow user to register twice", async function () {        
      await expect(AnemonethContract.connect(user1).register('test', {value: 1000000000})).to.be.revertedWith("Account already registered!");
    });
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(1);
    });
    it("Users should have a correct allocation", async function () {
      const user1Balance = await AnemonethContract.getCurrRedeemable(user1.address);
      expect(user1Balance).to.equal(2);
    });
    it("Users should have a correct distribution", async function () {
      const user5Balance = await AnemonethContract.getCurrRedeemable(user5.address);
      expect(user5Balance).to.equal(4);
    });
    it("Contract CLWN balance should increase due to settleUp's mint", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(10004);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(10005);
    });
    it("mintViaOwner should work for the owner for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11005);
    });
    it("should be able to return userNames", async function () {
      const userName = await AnemonethContract.connect(user2).getUserName(user2.address)
      expect(userName).to.equal("CANIGETTHIS");
    });
    it("should be able to return userNames", async function () {
      const userName = await AnemonethContract.connect(user1).getUserName(user1.address)
      expect(userName).to.equal("test");
    });
  });

  describe("Second week", function() {
    before(async function() {
      const tx6 = await AnemonethContract.connect(user6).register('test', {value: 1000000000}); // 1 Gwei
      await tx6.wait();
      await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], [user5.address, user6.address]);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(2);
    });
    it("User 6 should be properly added and allocated to", async function () {
      const user6Balance = await AnemonethContract.getCurrRedeemable(user6.address);
      expect(user6Balance).to.equal(4);
    });
    it("User 5 should be properly distributed to", async function () {
      const user5Balance = await AnemonethContract.getCurrRedeemable(user5.address);
      expect(user5Balance).to.equal(7);
    });
    it("Contract CLWN balance should only be one less as a result of user6", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11016);
    });
  });

  describe("Working w/ empty earning tier + non-earning users", function() {
    before(async function() {
      await AnemonethContract.connect(owner).settleUp([user1.address, user2.address], [user3.address, user4.address], []);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(3);
    });
  });

  describe("Non-Active week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).settleUp([], [], []);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(4);
    });
    it("Contract CLWN balance should increase w/ allocations", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11022);
    });
  })
  describe("Allocation", function() {
    it("Should be correct for user1", async function () {
      const user1Allocation = await AnemonethContract.getCurrRedeemable(user1.address);
      expect(user1Allocation).to.equal(4);
    });
    it("Should be correct for user5", async function () {
      const user5Allocation = await AnemonethContract.getCurrRedeemable(user5.address);
      expect(user5Allocation).to.equal(7);
    });
    it("Should be correct for user6", async function () {
      const user6Allocation = await AnemonethContract.getCurrRedeemable(user6.address);
      expect(user6Allocation).to.equal(4);
    });
  })
  describe("Redemption", function() {
    it("Balance before redemption should be one (from registration)", async function () {
      const user1Redeemed = await AnemonethContract.balanceOf(user1.address)
      expect(user1Redeemed).to.equal(1);
    });
    it("By user 1 should give them all of their tokens", async function () {
      await AnemonethContract.connect(user1).redeem(user1.address);
      const user1Redeemed = await AnemonethContract.balanceOf(user1.address)
      expect(user1Redeemed).to.equal(5);
    });
    it("By user 1 should adjust their current redeemable value", async function () {
      const user1Allocation = await AnemonethContract.getCurrRedeemable(user1.address);
      expect(user1Allocation).to.equal(0);
    });
    it("By user 1 should accordingly decrease contract's balance", async function () {
      const user1Allocation = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(user1Allocation).to.equal(11018);
    });
  })
  describe("User1 tipping User2 1 CLWN", async function() {
    before(async function() {
      await AnemonethContract.connect(user1).transfer(user2.address, 1)
    });
    it("Should decrease User1 balance by 1", async function () {
      const balanceOfUser1 = await AnemonethContract.balanceOf(user1.address)
      expect(balanceOfUser1).to.equal(4);
    });
    it("Should increase User2 balance by 1 (before their redemption)", async function () {
      const balanceOfUser2 = await AnemonethContract.balanceOf(user2.address)
      expect(balanceOfUser2).to.equal(2);
    });
    it("After redemption User2 should have 7 tokens", async function () {
      await AnemonethContract.connect(user2).redeem(user2.address);
      const user2Redeemed = await AnemonethContract.balanceOf(user2.address)
      expect(user2Redeemed).to.equal(6);
    });
  });
});