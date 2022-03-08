const { ethers, upgrades } = require("hardhat");


async function main() {
  const AnemonethV1 = await ethers.getContractFactory("AnemonethV1");
  const proxy = await upgrades.deployProxy(AnemonethV1, ["anemoneth", "CLWN", 9000000000000, 10000]);
  await proxy.deployed();

  console.log(proxy.address);
}

main();