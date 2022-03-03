// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract AnemonethV1 is ERC20CappedUpgradeable, OwnableUpgradeable {
    event Distribution(address indexed _addr, uint _amount);

    struct User {
        address addr;
        string username;
        uint joinDate;
    }

    mapping(address => mapping(uint => uint)) historicalEarnings;

    // Tracks weekly mints of NEM
    mapping(uint => uint) weeklyNemTotals;
    
    User[] users;

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

    function weeklyEarnings(User[] memory _userArr, uint amount_) public view onlyOwner returns(uint) {
        // Calculate how much NEM to give to each EAO
        // Calculate how much NEM to mint
        // This will be hard. Each post/comment/interaction cannot be an eth tx due to prohibitive
        // tx costs. We will have to aggregate IPFS data for each user and somehow get that data
        // into the contract...
        weeklyNemTotals[block.timestamp]
        return uint totalNem;
    }

    function mint() internal {
        // mint enough NEM to cover weeklyEarnings()
    }
    function distribute(address to, uint256 amount) internal {
        // increase balance of user addresses
        // reference ERC20Upgradable line 231
        _transfer(address(this), to, amount);
    }

}