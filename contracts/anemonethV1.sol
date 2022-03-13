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
        uint256 currRedeemable;
    }
    // user weekNumber => address => weeklyEarning
    mapping(uint => mapping(address => uint)) historicalEarnings; // Must be immutable, So we need a seperate tally for curr redeemable
    mapping(address => User) usersMap;

    struct WeeklyInfo {
        uint weekNumber;
        uint weeksNem;
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
        User memory newUser = User({ addr: msg.sender, username: _username, joinDate: block.timestamp, isUser: true, currRedeemable: 1 });
        usersMap[msg.sender] = newUser;
    }
    function getTotalEarned(address _addr) external view returns(uint) {
        uint256 weekCount = weeklyInfoArr.length;
        uint256 sum;
        for (uint i=0; i<weekCount; i++) {
           sum += historicalEarnings[i][_addr];
        }
        return sum;
    }
    function getCurrRedeemable(address _addr) external view returns(uint) {
        return usersMap[_addr].currRedeemable;
    }
    function getUserName(address _addr) external view returns(string memory) {
        return usersMap[_addr].username;
    }
    function gethistoricalEarnings(uint _week, address _addr) external view returns(uint) {
        return historicalEarnings[_week][_addr];
    }
    function getWeekCount() external view returns(uint) {
        return weeklyInfoArr.length;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    // _weeksArr will be formulated based on only those THAT EARNED that week
    function weeklyEarnings(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners) internal {
        uint256 _sum = 0;
        for (uint256 i=0; i<_weeksLowEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksLowEarners[i]] = 1;
            usersMap[_weeksLowEarners[i]].currRedeemable += 1;
            _sum += 1;
        }
        for (uint256 i=0; i<_weeksMidEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksMidEarners[i]] = 2;
            usersMap[_weeksMidEarners[i]].currRedeemable += 2;
            _sum += 2;
        }
        for (uint256 i=0; i<_weeksHighEarners.length; i++) {
            historicalEarnings[weeklyInfoArr.length][_weeksHighEarners[i]] = 3;
            usersMap[_weeksHighEarners[i]].currRedeemable += 3;
            _sum += 3;
        }
        WeeklyInfo memory thisWeek = WeeklyInfo(weeklyInfoArr.length, _sum);
        // require( (thisWeek.weekNumber >= ( (weeklyInfoArr[weeklyInfoArr.length-1].weekNumber) + 1 weeks )) || weeklyInfoArr.length == 0);
        weeklyInfoArr.push(thisWeek);
    }

    function weeklyMint() internal {
        // mint enough NEM to cover weeklyEarnings() and possibly estimated tx fees
        // check that weeklyEarnings() completed already
        _mint(address(this), weeklyInfoArr[weeklyInfoArr.length-1].weeksNem);
    }

    function settleUp(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners) external onlyOwner {
        weeklyEarnings(_weeksLowEarners, _weeksMidEarners, _weeksHighEarners);
        weeklyMint();
    }

    function redeem(address _addr) external {
        require(msg.sender == _addr); // Is this necessary? Is it bad to let user 1 redeem for and give to user 2?
        uint256 _amount = usersMap[_addr].currRedeemable;
        usersMap[_addr].currRedeemable -= _amount;
        _transfer(address(this), _addr, _amount);
    }
    function mintViaOwner(uint256 _num) external onlyOwner {
        _mint(address(this), _num);
    }
    // catch for Ether
    receive() external payable {}
    fallback() external payable {}
}