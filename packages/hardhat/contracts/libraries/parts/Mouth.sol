// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Loogie Mouth SVG generator
library Mouth {
    using Strings for uint256;

    /// @dev Mouth 
    // function loogieMouth(uint256 _chubbiness ,uint256 _mouthLength) public pure returns (string memory) {
    function loogieMouth(uint256 _chubbiness ,uint256 _mouthLength) internal pure returns (string memory) {
        return
            base(
                _chubbiness,
                _mouth(_mouthLength)
            );
    }

    function _mouth( uint256 _mouthLength) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<path d="M 130 240 Q 165 250 ',_mouthLength.toString(),' 235" stroke="black" stroke-width="3" fill="transparent"/>'
                )
            );
    }


    /// @dev The base SVG for the mouth
    // the translate function for the mouth is based on the curve y = 810/11 - 9x/11
    function base(uint256 chubbiness, string memory children) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<g class="mouth" transform="translate(',uint256((810-9*chubbiness)/11).toString(),',0)">', children, "</g>"
            )
        );
    }
}