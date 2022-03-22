// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";


contract AnemonethV1 is ERC20CappedUpgradeable, OwnableUpgradeable {

    bool oneSpecial;
    bool fiveSpecial;

    struct User {
        address addr;
        bool isUser;
        uint256 lastWeekNumberRedeemed;
    }
    mapping(address => User) usersMap;

    // user weekNumber => address => weeklyEarnings/currRedeemable
    mapping(uint => mapping(address => uint)) historicalEarnings; 

    // 1 indexed because of initializer
    uint256[] weeklyTimestampsArr;

    function initialize(
        string memory name_, 
        string memory symbol_,
        uint256 cap_,
        uint256 initSupply,
        bool _oneSpecial,
        bool _fiveSpecial
        ) public initializer {
        __ERC20Capped_init(cap_ * (uint256(10) ** uint8(18)) );
        __ERC20_init(name_, symbol_);
        __Ownable_init();
        _mint(address(this), initSupply * (uint256(10) ** uint8(18)) );
        oneSpecial = _oneSpecial;
        fiveSpecial = _fiveSpecial;
        weeklyTimestampsArr.push(0);
    }

    function register() external payable {
        require(msg.value == 1 gwei);
        require(usersMap[msg.sender].isUser == false, "Account already registered!");
        historicalEarnings[weeklyTimestampsArr.length][msg.sender] = ( 1 * (uint256(10) ** uint8(18)) );
        User memory newUser = User({ addr: msg.sender, isUser: true, lastWeekNumberRedeemed: weeklyTimestampsArr.length-1 });
        usersMap[msg.sender] = newUser;
    }
    // By pushing to weekly Arr at the end, we are ensuring that tokens earned in week n are allocated to week n instead of week n+1
    function weeklyEarnings(address[] memory _weeksLowEarners, address[] memory _weeksMidEarners, address[] memory _weeksHighEarners) external onlyOwner {
        // require( block.timestamp >= weeklyTimestampsArr[weeklyTimestampsArr.length] + 1 weeks );
        for (uint256 i=0; i<_weeksLowEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksLowEarners[i]] += ( 1 * (uint256(10) ** uint8(18)) );
        }
        for (uint256 i=0; i<_weeksMidEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksMidEarners[i]] += ( 5 * (uint256(10) ** uint8(18)) );
        }
        for (uint256 i=0; i<_weeksHighEarners.length; i++) {
            historicalEarnings[weeklyTimestampsArr.length][_weeksHighEarners[i]] += ( 10 * (uint256(10) ** uint8(18)) );
        }
        weeklyTimestampsArr.push(block.timestamp);
    }

    function redeem() external payable {
        require(usersMap[msg.sender].isUser == true);
        uint256 _sum;
        uint256 _iterationCount = 0;
        require((weeklyTimestampsArr.length > (usersMap[msg.sender].lastWeekNumberRedeemed + 1)), "Already redeemed this week!");
        if(oneSpecial) {_iterationCount = ( 1 * (uint256(10) ** uint8(18)));}
        else if(fiveSpecial) {_iterationCount = ( 5 * (uint256(10) ** uint8(18)));}
        for (uint i=weeklyTimestampsArr.length; i>usersMap[msg.sender].lastWeekNumberRedeemed; i--) {
            _iterationCount += ( 1 * (uint256(10) ** uint8(18) ));
            if( historicalEarnings[i][msg.sender] <= 0 ) {
                _sum += ( historicalEarnings[i][msg.sender] + _iterationCount );
            }
        }
        require(msg.value == 1 gwei);
        _mint(msg.sender, _sum);
        usersMap[msg.sender].lastWeekNumberRedeemed = weeklyTimestampsArr.length-1;
    }

    function getCurrRedeemable() external view returns(uint256) {
        require(usersMap[msg.sender].isUser == true);
        uint256 _sum;
        uint256 _iterationCount = 0;
        require((weeklyTimestampsArr.length > (usersMap[msg.sender].lastWeekNumberRedeemed + 1)), "Already redeemed this week!");
        if(oneSpecial) {_iterationCount = ( 1 * (uint256(10) ** uint8(18)));}
        else if(fiveSpecial) {_iterationCount = ( 5 * (uint256(10) ** uint8(18)));}
        for (uint i=weeklyTimestampsArr.length; i>usersMap[msg.sender].lastWeekNumberRedeemed; i--) {
            _sum += ( historicalEarnings[i][msg.sender] + _iterationCount );
            _iterationCount += ( 1 * (uint256(10) ** uint8(18)));
        }
        return _sum;
    }
    function gethistoricalEarnings(uint _week, address _addr) external view returns(uint) {
        return historicalEarnings[_week][_addr];
    }
    function getLastWeekNumberRedeemed(address _addr) external view returns(uint) {
        return usersMap[_addr].lastWeekNumberRedeemed;
    }
    function getHistoricalEarningsWeek(uint256 _week, address _addr) external view returns(uint) {
        return historicalEarnings[_week][_addr];
    }
    function getWeekCount() external view returns(uint) {
        return weeklyTimestampsArr.length;
    }
    function isRegistered(address addr) external view returns(bool) {
        return usersMap[addr].isUser;
    }
    function mintViaOwner(uint256 _num) external onlyOwner {
        _mint(address(this), ( _num * (uint256(10) ** uint8(18)) ));
    }
    function toggleFiveSpecial() external onlyOwner {
        fiveSpecial = !fiveSpecial;
    }
    function toggleOneSpecial() external onlyOwner {
        oneSpecial = !oneSpecial;
    }
    // Ether functionality
    receive() external payable {}
    fallback() external payable {}
    function getBalance() public view onlyOwner returns(uint) {
        return address(this).balance;
    }
    function withdraw(address payable _owner) external payable onlyOwner {
        _owner.transfer(address(this).balance);
    }
}