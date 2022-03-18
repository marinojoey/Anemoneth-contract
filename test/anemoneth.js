const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { assert, expect } = chai;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);



describe("Anemoneth SPECIAL earnings", function () {
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let user6;
  let AnemonethContract;

  function readable(num) {
    return parseInt(ethers.utils.formatEther(num))
  }
  
  before(async function() {
    [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "FISH", 9000000000000, 10000, false, false]);

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
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("Contract FISH balance should equal initial mint", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(10000);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(10001);
    });
    it("mintViaOwner should work for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractClwnBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 0", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(0);
    });
    it("User5 should have a correct currRedeemable", async function () {
      await expect(AnemonethContract.connect(user5).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
  });
  describe("Second week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).toggleFiveSpecial();
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address], [], []);
      const tx6 = await AnemonethContract.connect(user6).register({value: 1000000000}); // 1 Gwei
      await tx6.wait();
    })
    it("User 6 should have a correct currRedeemable", async function () {
      await expect(AnemonethContract.connect(user6).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(2);
    });
    it("User 1 should have a correct lastWeekNumberRedeemed", async function () {
      const user1lastWeekNumberRedeemed = await AnemonethContract.getLastWeekNumberRedeemed(user1.address);
      expect(user1lastWeekNumberRedeemed).to.equal(0);
    });
    it("User1 historicalEarnings for week 1 should be accurate", async function () {
      const weekNumber1 = readable(await AnemonethContract.getHistoricalEarningsWeek(1, user1.address));
      expect(weekNumber1).to.equal(2);
    });
    it("User1 historicalEarnings for week 2 should be accurate", async function () {
      const weekNumber2 = readable(await AnemonethContract.getHistoricalEarningsWeek(2, user1.address));
      expect(weekNumber2).to.equal(0);
    });
    it("User1 historicalEarnings for week 3 should be accurate", async function () {
      const weekNumber3 = readable(await AnemonethContract.getHistoricalEarningsWeek(3, user1.address));
      expect(weekNumber3).to.equal(0);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1CurrRedeemable = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1CurrRedeemable).to.equal(13); // 3 without special
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = readable(await AnemonethContract.connect(user3).getCurrRedeemable());
      expect(user3Balance).to.equal(13);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(13);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
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
    it("User1 historicalEarnings for week 1 should be accurate", async function () {
      const weekNumber1 = readable(await AnemonethContract.getHistoricalEarningsWeek(1, user1.address));
      expect(weekNumber1).to.equal(2);
    });
    it("User1 historicalEarnings for week 2 should be accurate", async function () {
      const weekNumber2 = readable(await AnemonethContract.getHistoricalEarningsWeek(2, user1.address));
      expect(weekNumber2).to.equal(1);
    });
    it("User1 historicalEarnings for week 3 should be accurate", async function () {
      const weekNumber3 = readable(await AnemonethContract.getHistoricalEarningsWeek(3, user1.address));
      expect(weekNumber3).to.equal(0);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6CurrRedeemable = readable(await AnemonethContract.connect(user6).getCurrRedeemable());
      expect(user6CurrRedeemable).to.equal(13);
    });
    it("User 6 balanceOf = 0", async function () {
      const user6CurrRedeemable = readable(await AnemonethContract.balanceOf(user6.address));
      expect(user6CurrRedeemable).to.equal(0);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1Balance = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1Balance).to.equal(21);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = readable(await AnemonethContract.connect(user3).getCurrRedeemable());
      expect(user3Balance).to.equal(21);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(21);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractClwnBalance).to.equal(11001);
    });
  });
  describe("All users redeem at end of third week", function() {
    before(async function() {
      await AnemonethContract.connect(user1).redeem({value: 1000000000});
      await AnemonethContract.connect(user2).redeem({value: 1000000000});
      await AnemonethContract.connect(user3).redeem({value: 1000000000});
      await AnemonethContract.connect(user4).redeem({value: 1000000000});
      await AnemonethContract.connect(user5).redeem({value: 1000000000});
      await AnemonethContract.connect(user6).redeem({value: 1000000000});
    })
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(3);
    });
    it("User 1 should have a correct lastWeekNumberRedeemed", async function () {
      const user1lastWeekNumberRedeemed = await AnemonethContract.getLastWeekNumberRedeemed(user1.address);
      expect(user1lastWeekNumberRedeemed).to.equal(2);
    });
    it("User 1 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 1 balanceOf = 21", async function () {
      const user1CurrRedeemable = readable(await AnemonethContract.balanceOf(user1.address));
      expect(user1CurrRedeemable).to.equal(21);
    });
    it("User 2 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 2 balanceOf = 21", async function () {
      const user2CurrRedeemable = readable(await AnemonethContract.balanceOf(user2.address));
      expect(user2CurrRedeemable).to.equal(21);
    });
    it("User 6 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user6).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 6 balanceOf = 13", async function () {
      const user6CurrRedeemable = readable(await AnemonethContract.balanceOf(user6.address));
      expect(user6CurrRedeemable).to.equal(13);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(11001);
    });
  });
  describe("Fourth week and turning special off", function() {
    before(async function() {
      await AnemonethContract.connect(owner).toggleFiveSpecial();
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address, user6.address], [], []);
    })
    it("weeklyTimeStampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.connect(owner).getWeekCount();
      expect(weekNumber).to.equal(4);
    });
    it("User1 should have a correct currRedeemable", async function () {
      const user1CurrRedeemable = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1CurrRedeemable).to.equal(2);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 21", async function () {
      let user5Balance = readable(await AnemonethContract.balanceOf(user5.address));
      expect(user5Balance).to.equal(21);
    });
    it("User5 currRedeemable = 1", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(2);
    });
  });
});



describe("Anemoneth simple earnings", function () {
  let AnemonethV1;
  let owner;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;
  let user6;
  let AnemonethContract;

  function readable(num) {
    return parseInt(ethers.utils.formatEther(num))
  }
  
  before(async function() {
    [owner, user1, user2, user3, user4, user5, user6] = await ethers.getSigners();

    AnemonethV1 = await ethers.getContractFactory("AnemonethV1");

    AnemonethContract = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "FISH", 9000000000000, 10000, false, false]);

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
      await expect(AnemonethContract.connect(user1).register({value: 1000000000})).to.be.revertedWith("Account already registered!");
    });
    it("Contract FISH balance should equal initial mint", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(10000);
    });
    it("mintViaOwner function should work for only the owner", async function () {
      await expect(AnemonethContract.connect(user1).mintViaOwner(1)).to.be.reverted;
    });
    it("mintViaOwner should work for the owner", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1)
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(10001);
    });
    it("mintViaOwner should work for a big number", async function () {
      await AnemonethContract.connect(owner).mintViaOwner(1000)
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractClwnBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 0", async function () {
      let user5Balance = await AnemonethContract.connect(user5).balanceOf(user5.address);
      expect(user5Balance).to.equal(0);
    });
    it("User5 should have a correct currRedeemable", async function () {
      await expect(AnemonethContract.connect(user5).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
  });
  describe("Second week", function() {
    before(async function() {
      await AnemonethContract.connect(owner).weeklyEarnings([user1.address, user2.address, user3.address, user4.address, user5.address], [], []);
      const tx6 = await AnemonethContract.connect(user6).register({value: 1000000000}); // 1 Gwei
      await tx6.wait();
    })
    it("User 6 should have a correct currRedeemable", async function () {
      await expect(AnemonethContract.connect(user6).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("weeklyTimestampsArr should have one week added", async function () {
      const weekNumber = await AnemonethContract.getWeekCount();
      expect(weekNumber).to.equal(2);
    });
    it("User 1 should have a correct lastWeekNumberRedeemed", async function () {
      const user1lastWeekNumberRedeemed = await AnemonethContract.getLastWeekNumberRedeemed(user1.address);
      expect(user1lastWeekNumberRedeemed).to.equal(0);
    });
    it("User1 historicalEarnings for week 1 should be accurate", async function () {
      const weekNumber1 = readable(await AnemonethContract.getHistoricalEarningsWeek(1, user1.address));
      expect(weekNumber1).to.equal(2);
    });
    it("User1 historicalEarnings for week 2 should be accurate", async function () {
      const weekNumber2 = readable(await AnemonethContract.getHistoricalEarningsWeek(2, user1.address));
      expect(weekNumber2).to.equal(0);
    });
    it("User1 historicalEarnings for week 3 should be accurate", async function () {
      const weekNumber3 = readable(await AnemonethContract.getHistoricalEarningsWeek(3, user1.address));
      expect(weekNumber3).to.equal(0);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1CurrRedeemable = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1CurrRedeemable).to.equal(3);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = readable(await AnemonethContract.connect(user3).getCurrRedeemable());
      expect(user3Balance).to.equal(3);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(3);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
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
    it("User1 historicalEarnings for week 1 should be accurate", async function () {
      const weekNumber1 = readable(await AnemonethContract.getHistoricalEarningsWeek(1, user1.address));
      expect(weekNumber1).to.equal(2);
    });
    it("User1 historicalEarnings for week 2 should be accurate", async function () {
      const weekNumber2 = readable(await AnemonethContract.getHistoricalEarningsWeek(2, user1.address));
      expect(weekNumber2).to.equal(1);
    });
    it("User1 historicalEarnings for week 3 should be accurate", async function () {
      const weekNumber3 = readable(await AnemonethContract.getHistoricalEarningsWeek(3, user1.address));
      expect(weekNumber3).to.equal(0);
    });
    it("User 6 should have a correct currRedeemable", async function () {
      const user6CurrRedeemable = readable(await AnemonethContract.connect(user6).getCurrRedeemable());
      expect(user6CurrRedeemable).to.equal(3);
    });
    it("User 1 should have a correct currRedeemable", async function () {
      const user1Balance = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1Balance).to.equal(6);
    });
    it("User 3 should have a correct currRedeemable", async function () {
      const user3Balance = readable(await AnemonethContract.connect(user3).getCurrRedeemable());
      expect(user3Balance).to.equal(6);
    });
    it("User5 should have a correct currRedeemable", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(6);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractClwnBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractClwnBalance).to.equal(11001);
    });
  });
  describe("All users redeem at end of third week", function() {
    before(async function() {
      await AnemonethContract.connect(user1).redeem({value: 1000000000});
      await AnemonethContract.connect(user2).redeem({value: 1000000000});
      await AnemonethContract.connect(user3).redeem({value: 1000000000});
      await AnemonethContract.connect(user4).redeem({value: 1000000000});
      await AnemonethContract.connect(user5).redeem({value: 1000000000});
      await AnemonethContract.connect(user6).redeem({value: 1000000000});
    })
    it("User 1 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 1 balanceOf = 6", async function () {
      const user1CurrRedeemable = readable(await AnemonethContract.balanceOf(user1.address));
      expect(user1CurrRedeemable).to.equal(6);
    });
    it("User 2 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 2 balanceOf = 3", async function () {
      const user2CurrRedeemable = readable(await AnemonethContract.balanceOf(user2.address));
      expect(user2CurrRedeemable).to.equal(6);
    });
    it("User 6 currRedeemable = 0", async function () {
      await expect(AnemonethContract.connect(user1).getCurrRedeemable()).to.be.revertedWith("Already redeemed this week!");
    });
    it("User 6 balanceOf = 6", async function () {
      const user6CurrRedeemable = readable(await AnemonethContract.balanceOf(user6.address));
      expect(user6CurrRedeemable).to.equal(3);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
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
      const user1CurrRedeemable = readable(await AnemonethContract.connect(user1).getCurrRedeemable());
      expect(user1CurrRedeemable).to.equal(2);
    });
    it("Contract FISH balance should be the same", async function () {
      const contractFISHBalance = readable(await AnemonethContract.balanceOf(AnemonethContract.address));
      expect(contractFISHBalance).to.equal(11001);
    });
    it("User 5 balanceOf should be 6", async function () {
      let user5Balance = readable(await AnemonethContract.balanceOf(user5.address));
      expect(user5Balance).to.equal(6);
    });
    it("User5 currRedeemable = 1", async function () {
      const user5Balance = readable(await AnemonethContract.connect(user5).getCurrRedeemable());
      expect(user5Balance).to.equal(2);
    });
  });
});