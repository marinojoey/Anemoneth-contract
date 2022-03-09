// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";


contract AnemonethV1 is ERC20CappedUpgradeable, OwnableUpgradeable {

    event Distribution(address indexed _addr, uint _amount);

    struct User {
        address addr;
        string username;
        uint joinDate;
        bool isUser;
    }
    User[] users;
    mapping(address => User) usersMap;

    // user weekNumber => address => weeklyEarning
    mapping(uint => mapping(address => uint)) historicalEarnings;

    struct WeeklyInfo {
        uint weekNumber;
        address[] weeksEarners;
        uint weeksNem;
    }

    // I would really like to not use this. Expensive.
    WeeklyInfo[] weeklyInfoArr;

    function initialize(
        string memory name_, 
        string memory symbol_,
        uint256 cap_,
        uint256 initSupply
        // uint256 _entryFee
        ) public initializer {
        __ERC20Capped_init(cap_);
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        _mint(address(this), initSupply);
    }

    function register(string memory _username) external payable {
        require(msg.value == 1 gwei);
        require(usersMap[msg.sender].isUser == false, "Account already registered!");
        _transfer(address(this), msg.sender, 1);
        User memory newUser = User({ addr: msg.sender, username: _username, joinDate: block.timestamp, isUser: true});
        users.push(newUser);
        usersMap[msg.sender] = newUser;
    }

    function getUser(uint256 index) external view returns(address) {
        return users[index].addr;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    // _weeksArr will be formulated based on only those THAT EARNED that week
    function weeksEarners(address _weeksArr) internal {
        WeeklyInfo memory thisWeek = WeeklyInfo(weeklyInfoArr.length, _weeksArr, 0);
        uint sum;
        for (uint i=0; i<_weeksArr; i++) {
            address userAddr = _weeksArr[i];
            historicalEarnings[thisWeek.weekNumber][userAddr] = thisWeekEarnings;
            sum += thisWeekEarnings;
        }
        thisWeek.weeksNem = sum;
        require( (thisWeek.weekNumber >= ( (weeklyInfoArr.length-1) + 1 weeks )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
        // we need to emit an event here and check for it in the mint function. 
        // Otherwise something might go wrong, it doesnt update weeklyInfoArr 
        // and mint() would mint last weeks amount again
    }
    function weeklyEarnings(uint256[] _clwn) internal {
        
    }

    function mintViaOwner() external onlyOwner {
        _mint(address(this), 10000);
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

    function settleUP() external onlyOwner {
        weeklyEarnings();
        mint();
        distribute();
    }

    // catch for Ether
    receive() external payable {}
    fallback() external payable {}
}