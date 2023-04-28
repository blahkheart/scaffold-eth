// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuidlBux is ERC20, Ownable {
    mapping(address => bool) public allowList;

    modifier onlyAllowListedOrOwner() {
        require(allowList[msg.sender] || owner() == _msgSender(), "Not allowlisted or owner");
        _;
    }

    constructor() ERC20("BUIDLBux", "BUIDL") {
        _mint(address(this), 400000 * 10 ** decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function claim(address to, uint256 amount) public onlyAllowListedOrOwner {
        _transfer(address(this), to, amount);
    }

    function addToAllowList(address[] calldata addresses) public onlyOwner {
        for (uint256 i = 0; i < addresses.length; ++i) {
            allowList[addresses[i]] = true;
        }
    }

    function removeFromAllowList(address[] calldata addresses) public onlyOwner {
        for (uint256 i = 0; i < addresses.length; ++i) {
            allowList[addresses[i]] = false;
        }
    }
}
