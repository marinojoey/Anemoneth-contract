const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);


describe.only("Anemoneth simple earnings", function () { 
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

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000, false]);

    await AnemonethContract.deployed();

    const tx = await AnemonethContract.connect(user1).register({value: 1000000000}); // 1 Gwei
    await tx.wait();
    const tx2 = await AnemonethContract.connect(user2).register({value: 1000000000}); // 1 Gwei
    await tx2.wait(); 
    const tx3 = await AnemonethContract.connect(user3).register({value: 1000000000}); // 1 Gwei
    await tx3.wait(); 
    const tx4 = await AnemonethContract.connect(user4).register({value: 1000000000}); // 1 Gwei
    await tx4.wait(); 
    const tx5 = await AnemonethContract.connect(user5).register({value: 1000000000}); // 1 Gwei
    await tx5.wait();
  });
  describe("First week", function() {
    it("Should not allow user to register twice", async function () {        
      await expect(AnemonethContract.connect(user1).register({value: 1000000000})).to.be.revertedWith("Account already registered!");
    });
    it("weeklyTimeStampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(1);
    });
    it("User1 should have a correct currRedeemable", async function () {
      const user1Balance = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1Balance).to.equal(1);
    });
    it("Contract FISH balance should equal initial mint", async function () {
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(10000);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(10001);
    });
    it("mintViaOwner should work for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 0", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(0);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(1);
    });
  });
  describe("Second week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address], [], []);
      const tx6 = await AnemonethContract.connect(user6).register({value: 1000000000}); // 1 Gwei
      await tx6.wait();
    })
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(2);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6Balance = await AnemonethContract.connect(user6).getCurrRedeemable();
      expect(user6Balance).to.equal(1);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1Balance = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1Balance).to.equal(3);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = await AnemonethContract.connect(user3).getCurrRedeemable();
      expect(user3Balance).to.equal(3);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(3);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11001);
    });
  });
  describe("Third week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address, user6.address], [], []);
    })
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(3);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6Balance = await AnemonethContract.connect(user6).getCurrRedeemable();
      expect(user6Balance).to.equal(3);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1Balance = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1Balance).to.equal(6);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = await AnemonethContract.connect(user3).getCurrRedeemable();
      expect(user3Balance).to.equal(6);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(6);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11001);
    });
  });
  describe("All users redeem at end of third week", function() {
    before(async function() {
      await AnemonethContract.connect(user1).redeem(user1.address);
      await AnemonethContract.connect(user2).redeem(user2.address);
      await AnemonethContract.connect(user3).redeem(user3.address);
      await AnemonethContract.connect(user4).redeem(user4.address);
      await AnemonethContract.connect(user5).redeem(user5.address);
      await AnemonethContract.connect(user6).redeem(user6.address);
    })
    it("User 1 should have a correct currRedeemable", async function () {
      const user1CurrRedeemable = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1CurrRedeemable).to.equal(0);
    });
    it("User 2 should have a correct currRedeemable", async function () {
      const user2CurrRedeemable = await AnemonethContract.connect(user2).getCurrRedeemable();
      expect(user2CurrRedeemable).to.equal(0);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3CurrRedeemable = await AnemonethContract.connect(user3).getCurrRedeemable();
      expect(user3CurrRedeemable).to.equal(0);
    });
    it("User 4 should have a correct currRedeemable", async function () {
      const user4CurrRedeemable = await AnemonethContract.connect(user4).getCurrRedeemable();
      expect(user4CurrRedeemable).to.equal(0);
    });
    it("User 5 should have a correct currRedeemable", async function () {
      const user5CurrRedeemable = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5CurrRedeemable).to.equal(0);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6CurrRedeemable = await AnemonethContract.connect(user6).getCurrRedeemable();
      expect(user6CurrRedeemable).to.equal(0);
    });
    it("User1 should have a correct balance", async function () {
      const user1Balance = await AnemonethContract.balanceOf(user1.address);
      expect(user1Balance).to.equal(6);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(11001);
    });
  });
  describe("Fourth week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address, user6.address], [], []);
    })
    it("weeklyTimeStampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(4);
    });
    it("User1 should have a correct currRedeemable", async function () {
      const user1CurrRedeemable = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1CurrRedeemable).to.equal(1);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 6", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(6);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(1);
    });
  });
});





describe("Anemoneth ", function () { 
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

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000, false]);

    await AnemonethContract.deployed();

    const tx = await AnemonethContract.connect(user1).register({value: 1000000000}); // 1 Gwei
    await tx.wait();
    const tx2 = await AnemonethContract.connect(user2).register({value: 1000000000}); // 1 Gwei
    await tx2.wait(); 
    const tx3 = await AnemonethContract.connect(user3).register({value: 1000000000}); // 1 Gwei
    await tx3.wait(); 
    const tx4 = await AnemonethContract.connect(user4).register({value: 1000000000}); // 1 Gwei
    await tx4.wait(); 
    const tx5 = await AnemonethContract.connect(user5).register({value: 1000000000}); // 1 Gwei
    await tx5.wait();
  });
  describe("First week", function() {
    it("Should not allow user to register twice", async function () {        
      await expect(AnemonethContract.connect(user1).register({value: 1000000000})).to.be.revertedWith("Account already registered!");
    });
    it("weeklyTimeStampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(1);
    });
    it("User1 should have a correct currRedeemable", async function () {
      const user1Balance = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1Balance).to.equal(1);
    });
    it("Contract FISH balance should equal initial mint", async function () {
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(10000);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractFISHBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractFISHBalance).to.equal(10001);
    });
    it("mintViaOwner should work for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 0", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(0);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(1);
    });
  });

  describe("User 5's first redeem", function() {
    before(async function() {
      await AnemonethContract.connect(user5).redeem(user5.address);
    });
    it("User 5 balanceOf should be 1", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(1);
    });
    it("User 5 should have a currRedeemable of 0", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(0);
    });
  });

  describe("Second week, first earnings", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address], [user3.address, user4.address], [user5.address]);
      const tx6 = await AnemonethContract.connect(user6).register({value: 1000000000}); // 1 Gwei
      await tx6.wait();
    })
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(2);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6Balance = await AnemonethContract.connect(user6).getCurrRedeemable();
      expect(user6Balance).to.equal(1);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1Balance = await AnemonethContract.connect(user1).getCurrRedeemable();
      expect(user1Balance).to.equal(3);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = await AnemonethContract.connect(user3).getCurrRedeemable();
      expect(user3Balance).to.equal(7);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = await AnemonethContract.connect(user5).getCurrRedeemable();
      expect(user5Balance).to.equal(10);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = await AnemonethContract.balanceOf(AnemonethContract.address);
      expect(contractClwnBalance).to.equal(11001);
    });
  });

  describe("Working w/ empty earning tier + non-earning users", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address], [user3.address, user4.address], []);
    })
    it("weeklyInfoArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(3);
    });
  });

  describe.skip("Non-Active week", function() {
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

  describe.skip("Allocation", function() {
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

  describe.skip("Redemption", function() {
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

  describe.skip("User1 tipping User2 1 CLWN", async function() {
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