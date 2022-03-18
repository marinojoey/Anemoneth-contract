# AnemonEth
We are a **Decentralized** social media platform that allows users to retain the value they create

## Ropsten testnet addresses

Proxy: 0xf69BEB25fAd2D18141895b056C3c2CcDbaa9E0f4

implementation: 0xfEDc47Ba87FeB52829ad9198B533FE3B10C9c18A

## Rop-scan Links

Proxy: https://ropsten.etherscan.io/address/0xf69BEB25fAd2D18141895b056C3c2CcDbaa9E0f4

Implementation: https://ropsten.etherscan.io/address/0xfedc47ba87feb52829ad9198b533fe3b10c9c18a#readContract
 
 ------------------
### DEPENDENCIES

─ @nomiclabs/hardhat-ethers@2.0.5   
─ @nomiclabs/hardhat-etherscan@3.0.1   
─ @nomiclabs/hardhat-waffle@2.0.3   
─ @openzeppelin/contracts-upgradeable@4.5.2   
─ @openzeppelin/contracts@4.5.0   
─ @openzeppelin/hardhat-upgrades@1.15.0   
─ chai@4.3.6   
─ dotenv@16.0.0   
─ ethereum-waffle@3.4.0   
─ hardhat-gas-reporter@1.0.8   
─ hardhat@2.8.4   

### create .env and place the following variables inside

RINKEBY_URL= https://www.alchemy.com/         

RINKEBY_PRIVATE_KEY= https://metamask.io/   

ETHERSCAN_KEY= https://etherscan.io/      

COINMARKET_KEY= https://pro.coinmarketcap.com/  

## Notes on V0 => V1  
  
Contract functionality in this version has changed from **Contract distributing tokens** to the **users distributing** their own tokens. The contract will still mint the amount needed to cover allocations, but that too could be offloaded to the user if required.   

─User[] deleted   
─getUser changed to a mapping   
─distribute() deletes   
─getWeeklyearnersCount deleted   
─struct WeeklyInfo 1) address[] payableAddr deleted 2) uint weeksEarners count deleted   
─deleted getUser()   
─added GetTotalEarned()   
─renamed getWeeklyInfoArrLength => getWeekCount   
─in weeklyEarnings() 1) removed _allEarners[] param becuase we no longer need to iterate over those who earned 2) increment totalRedeemable in UsersMap
