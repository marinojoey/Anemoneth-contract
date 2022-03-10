require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  solidity: "0.8.4",
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKET_KEY,
    gasPriceApi: process.env.ETHERSCAN_KEY
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.METAMASK_PRIVATE_KEY]
    }
  },
  etherscan: { 
    apiKey: {
      rinkeby: process.env.ETHERSCAN_KEY
    }
  }
};