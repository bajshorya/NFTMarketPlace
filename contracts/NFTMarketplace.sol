// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    uint256 public tokenCounter;
    address public owner;

    event NFTCreated(uint256 indexed tokenId, string tokenURI, address owner);

    constructor() ERC721("NFTMarketplace", "NFTM") {
        tokenCounter = 0;
        owner = msg.sender;
    }

    function createNFT(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit NFTCreated(newItemId, tokenURI, msg.sender);
        tokenCounter++;
        return newItemId;
    }
    
}