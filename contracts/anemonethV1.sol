// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


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

    function weeklyEarnings() public onlyOwner {
        // Calculate how much NEM to give to each EAO and how much total NEM to mint
        // This will be hard. Each post/comment/interaction cannot be an eth tx due to prohibitive
        // tx costs. We will have to aggregate IPFS data for each user and somehow get that data
        // into the contract... total mint hardcoded for now at 1000 and a fake user will be given 
        // it
        WeeklyInfo memory thisWeek = WeeklyInfo(weeklyInfoArr.length, 0);
        uint sum;
        for (uint i=0; i<users.length; i++) {
            address userAddr = users[i].addr;
            uint thisWeekEarnings = 1000; // this is going to hard. Probably will need to seperate into another function
            historicalEarnings[userAddr][thisWeek.weekNumber] = thisWeekEarnings;
            sum += thisWeekEarnings;
        }
        thisWeek.weeksNem = sum;
        require( (thisWeek.weekNumber >= ( (weeklyInfoArr.length-1) + 604800 )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
        // we need to emit an event here and check for it in the mint function. 
        // Otherwise something might go wrong, it doesnt update weeklyInfoArr 
        // and mint() would mint last weeks amount again
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
            uint weekNumber = weeklyInfoArr[weeklyInfoArr.length].weekNumber;
            uint amount = historicalEarnings[users[i].addr][weekNumber];
            _transfer(address(this), to, amount);
        }
    }
}