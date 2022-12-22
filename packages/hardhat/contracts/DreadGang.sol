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
// Modify Mint function
// Modify method of membership from mint

pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "./interfaces/IPublicLockV10.sol";
import "./interfaces/IDreadGangState.sol";
import "./interfaces/IDreadGang.sol";
import "./libraries//ToColor.sol";
import "./libraries/NFTDescriptor.sol";
import "./DGToken.sol";

/**
  @title LevelLoogies NFT Contract
  @author Danny Thomx
  @notice Explain to an end user what this does
  @dev Explain to a developer any extra details
*/

// contract LevelLoogies is ERC721Enumerable,IDreadGang, IERC721Receiver, Ownable {
contract DreadGang is ERC721Enumerable, IDreadGang, Ownable {
    using Address for address;
    using Strings for uint256;
    using Strings for uint160;
    using ToColor for bytes3;
    using Counters for Counters.Counter;

    DGToken dgToken;
    IDreadGangState public dreadGangState;
    uint256 public maxSupply = 2000;
    bool initialRevenue = false;
    address public vendor;
    address constant dev = 0xCA7632327567796e51920F6b16373e92c7823854;

    Counters.Counter private _tokenIdCounter;

    IPublicLock public publicLock;
    bool public isPublicLockAddressSet = false; // tracks whether publicLock address has been set.
    IPublicLock public mintLock;
    bool public isDGStateSet;

    mapping(uint256 => uint256) private level;
    mapping(address => bool) private squadMember;
    mapping(address => mapping(uint256 => bool)) private unlockedLevels;
    mapping(uint256 => bytes3) public color;
    mapping(uint256 => uint256) public chubbiness;
    mapping(uint256 => uint256) public mouthLength;
    mapping(address => mapping(uint256 => uint256)) nftById;

    constructor(
        string memory _name,
        string memory _symbol,
        IPublicLock _mintLockAddress,
        DGToken _dgToken
    ) ERC721(_name, _symbol) {
        _setMintLockAddr(_mintLockAddress);
        dgToken = _dgToken;
    }

    modifier onlyMember() {
        if (msg.sender != owner()) {
            require(squadMember[msg.sender] == true, "members only");
        }
        _;
    }

    receive() external payable {}

    //@Dev Sets DGTokens vendor address;
    function setVendorAddress(address _vendor) public onlyOwner {
        vendor = _vendor;
    }

    function _levelUp(uint256 _tokenId) private returns (uint256) {
        uint256 currentLevel = level[_tokenId];
        uint256 newLevel = currentLevel + 1;
        level[_tokenId] = newLevel;
        return newLevel;
    }

    // @dev To get the level of an nft
    function getLevel(uint256 _tokenId) public view override returns (uint256) {
        require(_exists(_tokenId), "Non existent token");
        return level[_tokenId];
    }

    // @dev Check if an address is a DreadGang member
    function isSquadMember(
        address _account
    ) public view override returns (bool) {
        bool dadaG = squadMember[_account];
        return dadaG;
    }

    // @dev To level up an nft
    function levelUp(
        IPublicLock _levelLock,
        uint256 _tokenId
    ) public payable override onlyMember returns (uint256) {
        require(_exists(_tokenId), "Nonexistent token");
        require(address(dreadGangState) != address(0), "State not set");
        require(msg.sender == ownerOf(_tokenId), "Not owner");
        IPublicLock levelLock = _levelLock;
        address levelLockAddress = address(levelLock);
        uint256 currentLevel = level[_tokenId];
        uint8 baseLevelUpFee = dreadGangState.baseLevelUpFee();
        uint8 baseLevelUpReward = dreadGangState.baseLevelUpReward();
        uint256 minTargetLevel = dreadGangState
            .getLevelData(levelLockAddress)
            .minTargetLevel;
        uint256 levelUpDues = (currentLevel * baseLevelUpFee) / 100;
        uint256 baseLevelUpRewardFee = dreadGangState.getOptionId(currentLevel);

        require(dreadGangState.isLevel(levelLockAddress), "Nonexistent level");
        require(_hasValidKey(msg.sender, levelLock), "Invalid key");
        require(currentLevel >= minTargetLevel, "Meet the minimum level");
        require(currentLevel <= (minTargetLevel + 5), "Not within 5 levels");
        require(
            unlockedLevels[levelLockAddress][_tokenId] == false,
            "Already unlocked"
        );

        if (msg.sender != owner()) {
            require(
                msg.sender !=
                    dreadGangState.getLevelData(levelLockAddress).creator,
                "level created by you"
            );
        }
        if (baseLevelUpRewardFee != 3) {
            bool sent = dgToken.transferFrom(
                msg.sender,
                address(this),
                levelUpDues * 1e18
            );
            require(sent, "Insufficient DGTokens");
        }
        uint256 newLevel = _levelUp(_tokenId);
        unlockedLevels[levelLockAddress][_tokenId] = true;
        dgToken.mintToken(msg.sender, (newLevel * baseLevelUpReward) * 1e18);

        emit LevelUp(levelLockAddress, _tokenId, newLevel);
        return newLevel;
    }

    // @notice sets publicLock to a specific lock address which is used to create levels for DreadGang community
    function setDreadGangState(
        IDreadGangState _dreadGangStateAddress
    ) external onlyOwner {
        dreadGangState = _dreadGangStateAddress;
        isDGStateSet = true;
    }

    // unlock protocol
    // @notice sets publicLock to a specific lock address which is used to create levels for DreadGang community
    function setPublicLockAddr(
        IPublicLock _publicLockAddress
    ) external onlyOwner {
        publicLock = _publicLockAddress;
        isPublicLockAddressSet = true;
    }

    function _setMintLockAddr(
        IPublicLock _publicLockAddress
    ) private onlyOwner {
        mintLock = _publicLockAddress;
    }

    function _hasValidMintKey(address _account) internal view returns (bool) {
        bool isMember = mintLock.getHasValidKey(_account);
        return isMember;
    }

    function _hasValidKey(
        address _account,
        IPublicLock _publicLock
    ) internal view returns (bool) {
        IPublicLock pubLock = _publicLock;
        bool hasKey = pubLock.getHasValidKey(_account);
        return hasKey;
    }

    function grantKeys(
        IPublicLock _publicLock,
        address[] calldata _accounts,
        uint256[] calldata _expiration,
        address[] calldata _managers
    ) public onlyMember returns (uint256[] memory) {
        IPublicLock pubLock = _publicLock;
        pubLock.grantKeys(_accounts, _expiration, _managers);
    }

    // @notice Mint single nft
    function mintItem() public returns (uint256 tokenId) {
        uint256 supply = totalSupply();
        require(supply < maxSupply, "Minting over");
        require(squadMember[msg.sender] == false, "Already member");
        // require(_hasValidMintKey(msg.sender) == true, "only members");

        if (msg.sender != owner()) {
            squadMember[msg.sender] = true;
        }
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);

        bytes32 predictableRandom = keccak256(
            abi.encodePacked(
                tokenId,
                blockhash(block.number - 1),
                msg.sender,
                address(this)
            )
        );
        color[tokenId] =
            bytes2(predictableRandom[0]) |
            (bytes2(predictableRandom[1]) >> 8) |
            (bytes3(predictableRandom[2]) >> 16);
        chubbiness[tokenId] =
            35 +
            ((55 * uint256(uint8(predictableRandom[3]))) / 255);
        // small chubiness loogies have small mouth
        mouthLength[tokenId] =
            180 +
            ((uint256(chubbiness[tokenId] / 4) *
                uint256(uint8(predictableRandom[4]))) / 255);
        return tokenId;
    }

    function tokenURI(
        uint256 id
    ) public view override returns (string memory _tokenURI) {
        require(_exists(id), "not exist");
        string memory name = string(
            abi.encodePacked("Loogie #", id.toString())
        );
        NFTDescriptor.SVGParams memory _svgParams;
        _svgParams.color = color[id];
        _svgParams.level = level[id];
        _svgParams.chubbiness = chubbiness[id];
        _svgParams.mouth = mouthLength[id];
        _svgParams.owner = ownerOf(id);
        string memory image = Base64.encode(
            bytes(NFTDescriptor.generateSVGImage(_svgParams))
        );
        string memory description = NFTDescriptor.generateDescription(
            _svgParams
        );
        string memory attributes = NFTDescriptor.generateAttributes(_svgParams);
        _tokenURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name,
                            '", "description":"',
                            description,
                            '", "external_url":"https://burnyboys.com/token/',
                            id.toString(),
                            '", "attributes": "',
                            attributes,
                            '", "image": "',
                            "data:image/svg+xml;base64,",
                            image,
                            '"}'
                        )
                    )
                )
            )
        );
        return _tokenURI;
    }

    function setmaxMintAmount(uint8 _newmaxMintAmount) public onlyOwner {
        maxSupply = _newmaxMintAmount;
    }

    function withdraw() public payable onlyOwner {
        address hashlips = 0x943590A42C27D08e3744202c4Ae5eD55c2dE240D; // The Creator who's work inspired the original DreadGang (Not SVG) Project.
        address buidlguidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

        if (!initialRevenue) {
            // This will pay HashLips 3% of the initial sale.
            // You can remove this if you want, or keep it in to support HashLips and his channel.
            // =============================================================================
            (bool hl, ) = payable(hashlips).call{
                value: (address(this).balance * 3) / 100
            }("");
            require(hl);

            (bool pg, ) = payable(buidlguidl).call{
                value: (address(this).balance * 13) / 100
            }("");
            require(pg);

            (bool v, ) = payable(vendor).call{
                value: (address(this).balance * 44) / 100
            }("");
            require(v);

            // This will payout the dev the rest of the initial Revenue.
            (bool d, ) = payable(dev).call{value: address(this).balance}("");
            require(d);

            initialRevenue = true;
        } else {
            (bool v, ) = payable(vendor).call{
                value: (address(this).balance * 70) / 100
            }("");
            require(v);

            (bool d, ) = payable(dev).call{
                value: (address(this).balance * 10) / 100
            }("");
            require(d);

            (bool o, ) = payable(owner()).call{value: address(this).balance}(
                ""
            );
            require(o);
        }
    }

    function withdrawToken() public payable onlyOwner {
        uint256 dgTokenBalance = dgToken.balanceOf(address(this));
        if (!initialRevenue) {
            dgToken.transfer(vendor, (dgTokenBalance * 20) / 100);
            dgToken.transfer(dev, (dgTokenBalance * 20) / 100);
            bool dg = dgToken.transfer(owner(), dgTokenBalance);
            require(dg);
            initialRevenue = true;
        } else {
            dgToken.transfer(vendor, (dgTokenBalance * 20) / 100);
            dgToken.transfer(dev, (dgTokenBalance * 10) / 100);
            dgToken.transfer(owner(), dgTokenBalance);
        }
    }
}
