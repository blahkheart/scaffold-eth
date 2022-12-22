// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../ToColor.sol";

/// @title Loogie Head SVG generator
library Head {
    using Strings for uint256;
    using ToColor for bytes3;

    /// @dev Head 
    // function loogieHead(bytes3 _color, uint256 _chubbiness) public pure returns (string memory) {
    function loogieHead(bytes3 _color, uint256 _chubbiness) internal pure returns (string memory) {
        return
            base(
                _head(_color, _chubbiness)
            );
    }

    function _head(bytes3 _color, uint256 _chubbiness) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<ellipse fill="#',
                    _color.toColor(),
                    '" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="',
                    _chubbiness.toString(),
                    '" ry="51.80065" stroke="#000"/>'
                )
            );
    }


    /// @dev The base SVG for the head
    function base(string memory children) private pure returns (string memory) {
        return string(abi.encodePacked('<g id="head">', children, "</g>"));
    }
}