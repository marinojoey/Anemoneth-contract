// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@nomiclabs/hardhat-ethers";


contract AnemonethV1 is ERC20CappedUpgradeable, OwnableUpgradeable {
    event Distribution(address indexed _addr, uint _amount);

    struct User {
        address addr;
        string username;
        uint joinDate;
    }
    User[] users;

    // user address => weekNumber => weeklyEarning
    mapping(address => mapping(uint => uint)) historicalEarnings;

    // Tracks weekly mints of NEM
    struct WeeklyInfo {
        uint weekNumber;
        uint weeksNem;
    }
    WeeklyInfo[] weeklyInfoArr;

    function initialize(
        string memory name_, 
        string memory symbol_,
        uint256 cap_,
        uint256 initSupply
        ) public initializer {
        __ERC20Capped_init(cap_);
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        _mint(address(this), initSupply);

    }

    function register(string memory _username) external {
        users.push(User({ addr: msg.sender, username: _username, joinDate: block.timestamp}));
    }

    function weeklyEarnings(User[] memory _userArr, uint amount_) public view onlyOwner {
        // Calculate how much NEM to give to each EAO and how much total NEM to mint
        // This will be hard. Each post/comment/interaction cannot be an eth tx due to prohibitive
        // tx costs. We will have to aggregate IPFS data for each user and somehow get that data
        // into the contract... total mint hardcoded for now at 1000 and a fake user will be given 
        // it
        thisWeek = WeeklyInfo(weeklyInfoArr.length, 1000);
        for (uint i=0; i<users.length; i++) {
            historicalEarnings[user[i].address][thisWeek.weekNumber] = 1000;
        }
        require( (thisWeek.weekNumber >= ( (weeklyInfoArr.length-1) + 1 week )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
        // we need to emit an event here and check for it in the mint function. Otherwise something might go wrong, it doesnt update weeklyInfoArr and mint() would mint last weeks amount again
    }

    function mint() internal {
        // mint enough NEM to cover weeklyEarnings() and possibly estimated tx fees
        // check that weeklyEarnings() completed already
        _mint(address(this), weeklyInfoArr[weeklyInfoArr.length].weeksNem);
    }
    function distribute() internal {
        // increase balance of user addresses
        // This is really poorly gas-optimized, we can find a better solution
        // reference ERC20Upgradable line 231
        for (uint i=0; i<users.length; i++) {
            address to = users[i].addr;
            uint amount = historicalEarnings[user[i].address][weeklyInfoArr[weeklyInfoArr.length]];
            _transfer(address(this), to, amount);
        }
    }
}