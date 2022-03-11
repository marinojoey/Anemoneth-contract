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
        uint256 weeksEarnersCount; // TODO: delete
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
    function getUserName(address _addr) external view returns(string memory) {
        return usersMap[_addr].username;
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
    function getWeeklyEarnersCount() external view returns(uint) {
        return weeklyInfoArr[weeklyInfoArr.length-1].payableAddr.length;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    // _weeksArr will be formulated based on only those THAT EARNED that week
    function weeklyEarnings(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners, address[] memory _allEarners) internal {
        uint256 _sum;
        for (uint256 i=0; i<_weeksLowEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksLowEarners[i]] = 1;
            _sum += 1;
        }
        for (uint256 i=0; i<_weeksMidEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksMidEarners[i]] = 2;
            _sum += 2;
        }
        for (uint256 i=0; i<_weeksHighEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksHighEarners[i]] = 3;
            _sum += 3;
        }
        WeeklyInfo memory thisWeek = WeeklyInfo(weeklyInfoArr.length, _allEarners.length, _sum, _allEarners);
        // require( (thisWeek.weekNumber >= ( (weeklyInfoArr[weeklyInfoArr.length-1].weekNumber) + 1 weeks )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
    }

    function weeklyMint() internal {
        // mint enough NEM to cover weeklyEarnings() and possibly estimated tx fees
        // check that weeklyEarnings() completed already
        _mint(address(this), weeklyInfoArr[weeklyInfoArr.length-1].weeksNem);
    }
    function distribute() internal {
        WeeklyInfo memory _thisWeeks = weeklyInfoArr[weeklyInfoArr.length-1];
        for (uint i=0; i<_thisWeeks.payableAddr.length; i++) {
            address to = _thisWeeks.payableAddr[i];
            uint amount = historicalEarnings[_thisWeeks.weekNumber][to];
            _transfer(address(this), to, amount);
        }
    }

    function settleUp(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners, address[] memory _allEarners) external onlyOwner {
        weeklyEarnings(_weeksLowEarners, _weeksMidEarners, _weeksHighEarners, _allEarners);
        weeklyMint();
        distribute();
    }
    function mintViaOwner(uint256 _num) external onlyOwner {
        _mint(address(this), _num);
    }
    // catch for Ether
    receive() external payable {}
    fallback() external payable {}
}