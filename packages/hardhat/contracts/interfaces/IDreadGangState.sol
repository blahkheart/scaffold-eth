// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/// @dev Struct to store the level to be unlocked information.
/// @param lockAddress The address of the level to be unlocked
/// @param init The boolean that specifies whether or not a level is initalized
/// @param minAllowedLevel The minimum allowed level that can unlock the level
/// @param creator The address of the level creator
struct LevelUnlockData {
    address lockAddress;
    bool init;
    uint256 minTargetLevel;
    address creator;
}

interface IDreadGangState {
    /**
     * @dev Emitted when a `member` creates a new level.
     */
    event CreateLevel(
        address indexed levelLock,
        uint256 indexed minAllowedLevel,
        address creator
    );

    /*
     * @Dev Sets the level threshold which determines the current class of the NFT
     *
     * @param _targetBaseLevel The current minimum benchmark for a particular NFT class.
     *
     * @param _newBaseLevel The new minimum benchmark for a particular NFT class
     *
     * @Notice `_targetBaseLevel` must match an existing base level NFT class, this determines
     * the class on which the `_newBaseLevel` is applied to.
     *
     */
    function setBaseLevel(
        uint32 _targetBaseLevel,
        uint32 _newBaseLevel
    ) external returns (uint32);

    /*
     * @Dev Sets the fee charged in ETH for creating a level for the specified class of NFT
     *
     * @param _targetBaseGatePass The current fee for charged for creating a level for a particular NFT class.
     *
     * @param _newBaseGatePass The new fee to be charged for creating a level
     *
     * @Notice `_targetBaseGatePass` must match an existing fee for a class, this determines
     * the class on which the `_newBaseGatePass` fee is applied to.
     *
     */
    function setBaseGatePass(
        uint256 _targetBaseGatePass,
        uint256 _newBaseGatePass
    ) external returns (uint256);

    /*
     * @Dev Sets the Token reward multiplier for level ups
     *
     * @param _newBaseLevelUpReward New level up reward (tokens) multiplier.
     *
     */
    function setBaseLevelUpReward(uint8 _newBaseLevelUpReward) external;

    /**
     * Sets the base % of DGTokens charged against the currentlevel for leveling up the NFT
     * @param _newBaseLevelUpFee New percentage of DG Tokens relative to NFT level charged for leveling up NFT.
     *
     */
    function setBaseLevelUpFee(uint8 _newBaseLevelUpFee) external;

    /**
     * @dev Creates a new level lock
     *
     * @param _levelLockAddress The lock address used to create the level.
     *
     * @param _minAllowedLevel The lowest level of NFT allowed to level up using this level.
     *
     * Emits an CreateLevel event.
     */
    function createLevelUpLock(
        address _levelLockAddress,
        uint256 _minAllowedLevel
    ) external payable;

    /**
     * @dev Selects different options based on number `_option` input
     *
     * @notice Returns a number which determines the outcome based on preterdermined values
     * Example if `_option` > 5 return 0 (option 1) else if `_option == 5` return 1 (option 2).
     * else return 2 (option 3)
     *
     * @param `_option` Number input used to determine the option returned.
     *
     */
    function getOptionId(uint256 _option) external view returns (uint256);

    /**
     * @dev Checks whether an `address` is a level
     *
     * @notice Returns a boolean
     *
     * @param `_LevelAddress` Address to be checked.
     *
     */
    function isLevel(address _LevelAddress) external view returns (bool);

    /**
     * Get the level data of a specific level
     *
     * @notice Returns a struct containing Level information
     *
     * @param `_LevelAddress` Level address.
     *
     * Requirements
     * `_levelAddress` must be an existing level
     */
    function getLevelData(
        address _levelAddress
    ) external view returns (LevelUnlockData memory);

    ///===================================================================
    /// Auto-generated getter functions from public state variables

    function baseLevelUpFee() external view returns (uint8);

    function baseLevelUpReward() external view returns (uint8);

    function baseLevelNoob() external view returns (uint32);

    function baseLevelHustler() external view returns (uint32);

    function baseLevelOG() external view returns (uint32);

    function gatePassNoob() external view returns (uint256);

    function gatePassHustler() external view returns (uint256);

    function gatePassOG() external view returns (uint256);

    function isDreadGangInit() external view returns (bool);
}
