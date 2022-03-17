const { ethers, upgrades } = require("hardhat");

// TO DO: Place the address of your proxy here!
const proxyAddress = "";

async function main() {
  const AnemonethV2 = await ethers.getContractFactory("AnemonethV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, AnemonethV2);
  console.log(`View Proxy at: https://rinkeby.etherscan.io/address/${proxyAddress}`)
  console.log("----------")
  console.log("Verification command below: USE V2 IMPLEMENTATION ADDRESS")
  console.log("npx hardhat verify --network rinkeby  -----")
  console.log((await upgraded.getWeekCount()), "weeks old!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});