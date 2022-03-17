// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";


contract AnemonethV1 is ERC20CappedUpgradeable, OwnableUpgradeable {

    bool special;

    struct User {
        address addr;
        uint joinDate;
        bool isUser;
        uint256 lastWeekNumberRedeemed;
    }
    mapping(address => User) usersMap;

    // user weekNumber => address => weeklyEarning
    mapping(uint => mapping(address => uint)) historicalEarnings; 

    // 1 indexed because of initializer
    uint256[] weeklyTimestampsArr;

    function initialize(
        string memory name_, 
        string memory symbol_,
        uint256 cap_,
        uint256 initSupply,
        bool _special
        ) public initializer {
        __ERC20Capped_init(cap_);
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        _mint(address(this), initSupply);
        special = _special;
        weeklyTimestampsArr.push(0);
    }

    function register() external payable {
        require(msg.value == 1 gwei);
        require(usersMap[msg.sender].isUser == false, "Account already registered!");
        historicalEarnings[weeklyTimestampsArr.length][msg.sender] = 1;
        User memory newUser = User({ addr: msg.sender, joinDate: block.timestamp, isUser: true, lastWeekNumberRedeemed: weeklyTimestampsArr.length-1 });
        usersMap[msg.sender] = newUser;
    }
    function getTotalEarned(address _addr) external view returns(uint) {
        uint256 sum;
        for (uint i=0; i<weeklyTimestampsArr.length; i++) {
           sum += historicalEarnings[i][_addr];
        }
        return sum;
    }
    function gethistoricalEarnings(uint _week, address _addr) external view returns(uint) {
        return historicalEarnings[_week][_addr];
    }
    function getWeekCount() external view returns(uint) {
        return weeklyTimestampsArr.length;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    // _weeksArr will be formulated based on only those THAT EARNED that week
    function weeklyEarnings(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners) external onlyOwner {
        // require( block.timestamp >= weeklyTimestampsArr[weeklyTimestampsArr.length] + 1 weeks );
        weeklyTimestampsArr.push(block.timestamp);
        for (uint256 i=0; i<_weeksLowEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksLowEarners[i]] = 1;
        }
        for (uint256 i=0; i<_weeksMidEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksMidEarners[i]] = 5;
        }
        for (uint256 i=0; i<_weeksHighEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksHighEarners[i]] = 10;
        }
    }

    function toggleSpecial() external onlyOwner {
        special = !special;
    }

    function getCurrRedeemable() public view returns(uint256) {
        require(usersMap[msg.sender].isUser == true);
        address _addr = msg.sender;
        uint256 _sum;
        uint256 _iterationCount = 0;
        if(special) {_iterationCount = 5;}
        for (uint i=weeklyTimestampsArr.length; i>usersMap[_addr].lastWeekNumberRedeemed; i--) {
            _sum += ( historicalEarnings[i][_addr] + _iterationCount );
            _iterationCount++;
        }
        return _sum;
    }

    function redeem(address _addr) external {
        require(usersMap[msg.sender].isUser == true);
        require(msg.sender == _addr);
        uint256 _sum;
        uint256 _iterationCount = 0;
        if(special) {_iterationCount = 5;}
        for (uint i=weeklyTimestampsArr.length; i>usersMap[_addr].lastWeekNumberRedeemed; i--) {
            _sum += ( historicalEarnings[i][_addr] + _iterationCount );
            _iterationCount++;
        }
        _mint( _addr, _sum);
        usersMap[_addr].lastWeekNumberRedeemed = weeklyTimestampsArr.length;
    }

    function mintViaOwner(uint256 _num) external onlyOwner {
        _mint(address(this), _num);
    }
    // catch for Ether
    receive() external payable {}
    fallback() external payable {}
}