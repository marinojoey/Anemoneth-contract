// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AnemonethV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    uint public test1;
    uint public test2;

    function initialize(uint _test1, uint _test2) external initializer {
        __ERC20_init("AnemonEth", "NEM");
        __Ownable_init();
        test1 = _test1;
        test2 = _test2;
    }

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }

    function add() public view returns(uint) {
        return test1 + test2;
    }
}