const { ethers, upgrades } = require("hardhat");


async function main() {
  const AnemonethV1 = await ethers.getContractFactory("AnemonethV1");
  const proxy = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "FISH", 9000000000000, 10000, false, false]);
  await proxy.deployed();

  console.log(proxy.address);
  console.log("----------")
  console.log("Verification command below: USE IMPLEMENTATION ADDRESS")
  console.log("npx hardhat verify --network rinkeby")
}

main();