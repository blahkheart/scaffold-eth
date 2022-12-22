//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./ToColor.sol";
import "./parts/Eye.sol";
import "./parts/Head.sol";
import "./parts/Mouth.sol";

/// @notice Helper to generate SVGs
library NFTDescriptor {
    using Strings for uint256;
    using Strings for uint160;
    using ToColor for bytes3;

    struct SVGParams {
        bytes3 color;
        uint256 level;
        uint256 chubbiness;
        uint256 mouth;
        address owner;
    }

        /// @dev generate SVG header
    function generateSVGHead() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">'
                )
            );
    }

  
    // function generateSVGImage(SVGParams memory _svgParams) public pure returns (string memory svg) {
    function generateSVGImage(SVGParams memory _svgParams) internal pure returns (string memory svg) {
        return string(
            abi.encodePacked(
                generateSVGHead(),
                Eye.loogieEye_1(),
                Head.loogieHead(_svgParams.color, _svgParams.chubbiness),
                Eye.loogieEye_2(),
                Mouth.loogieMouth(_svgParams.chubbiness, _svgParams.mouth),
                "</svg>"
            )
        );
  }

    /// @dev generate Json Metadata description
    function generateDescription(SVGParams memory params) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "This Loogie is at level #",
                    params.level.toString(),
                    " with color #",
                    params.color.toColor(),
                    " and chubbiness ",
                    params.chubbiness.toString()
                )
            );
    }

    /// @dev generate Json Metadata attributes
    function generateAttributes(SVGParams memory _svgParams) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "[",
                    getJsonAttribute("Color", _svgParams.color.toColor(), false),
                    getJsonAttribute("Level", _svgParams.level.toString(), false),
                    abi.encodePacked(
                        getJsonAttribute("Chubbiness", _svgParams.chubbiness.toString(), false),
                        getJsonAttribute("Mouth", _svgParams.mouth.toString(), false),
                        getJsonAttribute("Owner", uint160(_svgParams.owner).toHexString(20), true),
                        "]"
                    )
                    
                )
            );
    }
  

    /// @dev Get the json attribute as
    ///    {
    ///      "trait_type": "Skin",
    ///      "value": "Human"
    ///    }
    function getJsonAttribute(
        string memory trait,
        string memory value,
        bool end
    ) private pure returns (string memory json) {
        return string(abi.encodePacked('{ "trait_type" : "', trait, '", "value" : "', value, '" }', end ? "" : ","));
    }
}