//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SVForum  is ERC1155 {

    address public contractOwner;
    uint public numPosts;

    struct Post {
        string title;
        string description;
        address user;
        uint numLikes;
        uint timestamp;
        mapping(address => bool) likes;
    }

    struct PostData {
        string title;
        string description;
        address user;
        uint numLikes;
        uint timestamp;
    }

    // Mapping of Posts
    mapping(uint => Post) public posts;

    // Event Declarations
    event NewPost(string title, string description, address user);
    event LikeRegistered(uint postId, address user);

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/{id}.json") {
        contractOwner = msg.sender;
        numPosts = 0;
    }

    // Function to create a new post
    function newPost(string memory _title, string memory _description) public {        
        Post storage post = posts[numPosts];
        post.title = _title;
        post.description = _description;
        post.user = msg.sender;
        post.numLikes = 0;
        post.timestamp = block.timestamp;
        numPosts++;
        emit NewPost(_title, _description, msg.sender);
    }

    // Function to get all the posts
    function getAllPosts() public view returns (PostData[] memory) {
        PostData[] memory postDataArray = new PostData[](numPosts);
        for (uint i = 0; i < numPosts; i++) {
            Post storage post = posts[i];
            PostData memory postData = PostData({
                title: post.title,
                description: post.description,
                user: post.user,
                numLikes: post.numLikes,
                timestamp: post.timestamp
            });
            postDataArray[i] = postData;
        }
        return postDataArray;
    }

    // Function to register a new like
    function registerLike(uint _postId) public {
        require(posts[_postId].likes[msg.sender] == false, "You have already liked on this post.");

        posts[_postId].likes[msg.sender] = true;
        posts[_postId].numLikes++;

        emit LikeRegistered(_postId, msg.sender);
    }

}