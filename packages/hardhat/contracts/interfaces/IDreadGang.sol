// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IPublicLockV10.sol";

interface IDreadGang {
    /**
     * @dev Emitted when `holder` levels up NFT with tokenId of `tokenId`.
     */
    event LevelUp(
        address levelLock,
        uint256 indexed tokenId,
        uint256 indexed newLevel
    );

    /**
     * @dev Returns the level of the NFT with `_tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getLevel(uint _tokenId) external view returns (uint256);

    /**
     * @dev Checks whether an address `_account` is a member.
     */
    function isSquadMember(address _account) external view returns (bool);


    /**
     * @dev Increases the level of the NFT with `tokenId` by +1.
     * @notice This implementation uses Unlock Protocol contracts to create locks 
     * @param _levelLock Unlock Protocol lock address (serves as the level to be unlocked)
     * which serves as levels, to which NFT holders must obtain a `key` to unlock and level up
     *
     * Requirements:
     *
     * - `msg.sender` must have a valid key to unlock the level.
     * - `tokenId` token must exist and be owned by `msg.sender`.
     * - The level being unlocked must not have been previously unlocked by `msg.sender`.
     *
     * Emits a LevelUp event.
     */
    function levelUp(IPublicLock _levelLock, uint256 _tokenId)external payable returns (uint256);
}
