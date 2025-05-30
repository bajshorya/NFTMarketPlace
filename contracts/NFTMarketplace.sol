// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "../contracts/Counter.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counter for Counter.Counter;

    Counter.Counter private _tokenIdCounter;
    Counter.Counter private _itemsSold;

    uint256 listingPrice= 0.025 ether;
    address payable owner;
    mapping(uint256 => MarketItem) private idToMarketItem;
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    event MarketItemCreated(
        uint256 indexed tokenId,
        address  seller,
        address  owner,
        uint256 price,
        bool sold
    );
    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }
    function udateListingPrice(uint256 _listingPrice) public payable{
        require(owner == msg.sender, "Only owner can update the listing price");
        listingPrice = _listingPrice;
    }
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    
}