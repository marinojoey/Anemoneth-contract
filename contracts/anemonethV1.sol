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
        uint256 weeksEarnersCount;
        uint weeksNem;
        address[] payableAddr;
    }
    // I would really like to not use this. Expensive. Does historicalEarnings mapping accomplish
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
    function getUserCount() external view returns(uint) {
        return users.length;
    }
    function gethistoricalEarnings(uint _week, address _addr) external view returns(uint) {
        return historicalEarnings[_week][_addr];
    }
    function getWeeklyInfoArrLength() external view returns(uint) {
        return weeklyInfoArr.length;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    // _weeksArr will be formulated based on only those THAT EARNED that week
    function weeklyEarnings(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners) external {
        uint256 _sum;
        address[] memory _weeksArr;
        uint256 _totalEarners = _weeksLowEarners.length + _weeksMidEarners.length + _weeksHighEarners.length;
        WeeklyInfo memory thisWeek = WeeklyInfo(weeklyInfoArr.length, _totalEarners, 0, _weeksArr);
        for (uint256 i=0; i<_weeksLowEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksLowEarners[i]] = 1;
            _sum += 1;
            _weeksArr.push(_weeksLowEarners[i]);
        }
        for (uint256 i=0; i<_weeksMidEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksMidEarners[i]] = 2;
            _sum += 2;
            _weeksArr.push(_weeksMidEarners[i]);
        }
        for (uint256 i=0; i<_weeksHighEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksHighEarners[i]] = 3;
            _sum += 3;
            _weeksArr.push(_weeksHighEarners[i]);
        }
        thisWeek.weeksNem = _sum;
        // require( (thisWeek.weekNumber >= ( (weeklyInfoArr[weeklyInfoArr.length-1].weekNumber) + 1 weeks )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
    }

    function weeklyMint() external {
        // mint enough NEM to cover weeklyEarnings() and possibly estimated tx fees
        // check that weeklyEarnings() completed already
        _mint(address(this), weeklyInfoArr[weeklyInfoArr.length-1].weeksNem);
    }
    function distribute() internal {
        uint256 _totalEarners = weeklyInfoArr[weeklyInfoArr.length-1].weeksEarnersCount;
        for (uint i=0; i<_totalEarners; i++) {
            address to = users[i].addr;
            uint weekNumber = weeklyInfoArr[weeklyInfoArr.length].weekNumber;
            uint amount = historicalEarnings[weekNumber][users[i].addr];
            _transfer(address(this), to, amount);
        }
    }

    function settleUP() external onlyOwner {
        // weeklyEarnings(address[] memory, uint8[] memory);
        // weeklyMint();
        distribute();
    }
    function mintViaOwner() external onlyOwner {
        _mint(address(this), 10000);
    }
    // catch for Ether
    receive() external payable {}
    fallback() external payable {}
}