// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Loogie Eyes SVG generator
library Eye {
    using Strings for uint256;
   
    /// @dev Eyes N°1
    // function loogieEye_1() public pure returns (string memory) {
    function loogieEye_1() internal pure returns (string memory) {
        return
            base(
                1,
                _eye_1()
            );
    }

    /// @dev Eyes N°2
    //  function loogieEye_2() public pure returns (string memory) {
     function loogieEye_2() internal pure returns (string memory) {
        return
            base(
                2,
                _eye_2()
            );
    }

    function _eye_1() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>',
                    '<ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>'
                )
            );
    }

    function _eye_2() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>',
                    '<ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>'                
                )
            );
    }


    /// @dev The base SVG for the eyes
    function base(uint256 id, string memory children) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<g id="eye',
                id.toString(),'">',
                children, 
                "</g>"
            )
        );
    }
}