// SPDX-License-Identifier: MIT

// Amended by Dannithomx
/**
    !Disclaimer!
    please review this code on your own before using any of
    the following code for production.
    Dannithomx will not be liable in any way if for the use 
    of the code. That being said, the code has been tested 
    to the best of the developers' knowledge to work as intended.
*/

// Change Log

// TODO:

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPublicLockV10.sol";
import "./interfaces/IDreadGang.sol";
import "./DGToken.sol";

/**
  @title DreadGang NFT State Contract
  @author Danny Thomx
  @notice Explain to an end user what this does
  @dev Explain to a developer any extra details
*/

contract DreadGangState is Ownable {
    DGToken dgToken;
    uint8 public baseLevelUpFee = 40; // @notice Determines the % of fee paid to level up (charged in DGTokens)
    uint8 public baseLevelUpReward = 1; // @notice The number which is multiplied with the current level to determine the level up reward (in DGTokens)
    uint32 public baseLevelNoob = 10; // @notice Determines the base level for the Noob class
    uint32 public baseLevelHustler = 40; // @notice Determines the base level for the Hustler class
    uint32 public baseLevelOG = 100; // @notice Deternmines the base level for the OG class
    uint256 public gatePassNoob = 0.001 ether; // @notice Fee for creating levels for class Noob (charged in ETH)
    uint256 public gatePassHustler = 0.01 ether; // @notice Fee for creating levels for class Hustler (charged in ETH)
    uint256 public gatePassOG = 0.1 ether; // @notice Fee for creating levels for class OG (charged in ETH)

    address public vendor;
    address dev = 0xCA7632327567796e51920F6b16373e92c7823854;

    bool public isDreadGangInit;
    IDreadGang public dreadGang;
    IPublicLock public publicLock;

    struct LevelUnlockData {
        address lockAddress;
        bool init;
        uint minTargetLevel;
        address creator;
    }

    mapping(address => bool) allLevels;
    mapping(address => LevelUnlockData) levelData;
    event CreateLevel(
        address indexed levelLock,
        uint256 indexed minAllowedLevel,
        address creator
    );

    constructor(DGToken _dgToken) {
        dgToken = _dgToken;
    }

    modifier onlyMember() {
        if (msg.sender != owner()) {
            require(
                dreadGang.isSquadMember(msg.sender) == true,
                "members only"
            );
        }
        _;
    }

    receive() external payable {}

    // @notice initializes dreadGang address
    function initDreadGang(IDreadGang _dreadGangAddress) external onlyOwner {
        require(!isDreadGangInit, "DG already init");
        dreadGang = _dreadGangAddress;
        isDreadGangInit = true;
    }

    // @notice Checks whether an address is a level
    function isLevel(address _levelAddress) public view returns (bool) {
        return allLevels[_levelAddress];
    }

    //@Dev Sets the level threshold which determines the current class of the NFT
    function setBaseLevel(
        uint32 _targetBaseLevel,
        uint32 _newBaseLevel
    ) public onlyOwner returns (uint32) {
        if (_targetBaseLevel == baseLevelNoob) {
            baseLevelNoob = _newBaseLevel;
            return baseLevelNoob;
        } else if (_targetBaseLevel == baseLevelHustler) {
            baseLevelHustler = _newBaseLevel;
            return baseLevelHustler;
        } else if (_targetBaseLevel == baseLevelOG) {
            baseLevelOG = _newBaseLevel;
            return baseLevelOG;
        }
    }

    //@Dev Sets the fee charged for creating a level at the current class of the NFT
    function setBaseGatePass(
        uint256 _targetBaseGatePass,
        uint256 _newBaseGatePass
    ) public onlyOwner returns (uint256) {
        if (_targetBaseGatePass == gatePassNoob) {
            gatePassNoob = _newBaseGatePass;
            return gatePassNoob;
        } else if (_targetBaseGatePass == gatePassHustler) {
            gatePassHustler = _newBaseGatePass;
            return gatePassHustler;
        } else if (_targetBaseGatePass == gatePassOG) {
            gatePassOG = _newBaseGatePass;
            return gatePassOG;
        }
    }

    //@Dev Sets the DGToken reward multiplier for level ups
    function setBaseLevelUpReward(
        uint8 _newBaseLevelUpReward
    ) public onlyOwner {
        baseLevelUpReward = _newBaseLevelUpReward;
    }

    //@Dev Sets the base % of DGTokens charged against the current level for leveling up the NFT
    function setBaseLevelUpFee(uint8 _newBaseLevelUpFee) public onlyOwner {
        baseLevelUpFee = _newBaseLevelUpFee;
    }

    //@Dev Sets DGTokens vendor address;
    function setVendorAddress(address _vendor) public onlyOwner {
        vendor = _vendor;
    }

    //@Dev Get the level data of a specific level
    function getLevelData(
        address _levelAddress
    ) public view returns (LevelUnlockData memory _levelData) {
        require(isLevel(_levelAddress), "Not a level");
        return _levelData = levelData[_levelAddress];
    }

    // @dev To create a new level lock
    function createLevelUpLock(
        IPublicLock _levelLock,
        uint _minTargetLevel
    ) public payable onlyMember {
        IPublicLock levelToUnlock = _levelLock;
        address levelToUnlockAddr = address(levelToUnlock);
        require(_minTargetLevel >= 0, "Number greater >= 0");
        require(_hasValidKey(msg.sender, levelToUnlock), "invalid key");
        require(allLevels[levelToUnlockAddr] == false, "Already created");
        uint duesOption = _getOptionId(_minTargetLevel);
        uint levelDuesOption;
        if (duesOption == 0) {
            levelDuesOption = gatePassNoob;
        } else if (duesOption == 1) {
            levelDuesOption = gatePassHustler;
        } else if (duesOption == 2) {
            levelDuesOption = gatePassOG;
        } else {
            levelDuesOption = 0;
        }
        if (msg.sender != owner()) {
            require(msg.value >= levelDuesOption, "Insufficient dues");
            // require(payable(address(this)).send(cost), "Failed to transfer level Up fees");
        }

        allLevels[levelToUnlockAddr] = true;
        _setLevelUnLockData(levelToUnlockAddr, true, _minTargetLevel);
        emit CreateLevel(levelToUnlockAddr, _minTargetLevel, msg.sender);
    }

    // @dev set the level to unlock data
    function _setLevelUnLockData(
        address _levelToUnlockAddr,
        bool _init,
        uint _minTargetLevel
    ) private {
        levelData[_levelToUnlockAddr] = LevelUnlockData(
            _levelToUnlockAddr,
            _init,
            _minTargetLevel,
            msg.sender
        );
    }

    // @dev select different options based on number input
    function _getOptionId(
        uint256 _option
    ) internal view returns (uint256 _optionId) {
        if (_option >= baseLevelNoob && _option < baseLevelHustler) {
            _optionId = 0;
        } else if (_option >= baseLevelHustler && _option < baseLevelOG) {
            _optionId = 1;
        } else if (_option >= baseLevelOG) {
            _optionId = 2;
        } else {
            _optionId = 3;
        }
        return _optionId;
    }

    function getOptionId(uint256 _option) external view returns (uint256) {
        return _getOptionId(_option);
    }

    function _hasValidKey(
        address _account,
        IPublicLock _publicLock
    ) internal view returns (bool) {
        IPublicLock pubLock = _publicLock;
        bool hasKey = pubLock.getHasValidKey(_account);
        return hasKey;
    }

    function withdraw() public payable onlyOwner {
        address buidlguidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

        // This will send 36% of ETH balance to BuidlGuidl
        (bool bg, ) = payable(buidlguidl).call{
            value: (address(this).balance * 36) / 100
        }("");
        require(bg);

        // This will send 44% of ETH balance to the token vendor.
        if (vendor != address(0)) {
            (bool v, ) = payable(vendor).call{
                value: (address(this).balance * 44) / 100
            }("");
            require(v);
        }

        // This will payout the dev the rest.
        (bool d, ) = payable(dev).call{value: address(this).balance}("");
        require(d);
    }

    function withdrawToken() public payable onlyOwner {
        uint256 dgTokenBalance = dgToken.balanceOf(address(this));
        dgToken.transfer(dev, (dgTokenBalance * 10) / 100);
        dgToken.transfer(owner(), dgTokenBalance);
    }
}
