// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AnemonethV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    struct User {
        address addr;
        string username;
        uint joinDate;
    }
    
    mapping(address => uint) balance;

    function initialize(string memory name, string memory symbol, uint256 initialSupply) public virtual initializer {
        __ERC20_init(name, symbol);
        __Ownable_init();
        _mint(msg.sender, initialSupply);
    }
}