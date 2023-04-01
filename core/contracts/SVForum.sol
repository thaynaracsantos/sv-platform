// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

/// @custom:security-contact thaynaracsantos@gmail.com
contract SVForum is ERC20, Ownable, ERC20Permit {
    address public contractOwner;
    uint public numPosts;

    struct Post {
        uint id;
        string title;
        string description;
        address user;
        uint numLikes;
        uint timestamp;
        string tags;
        mapping(address => bool) likes;
    }

    struct PostData {
        uint id;
        string title;
        string description;
        address user;
        uint numLikes;
        uint timestamp;
        string tags;
    }

    // Mapping of Posts
    mapping(uint => Post) public posts;

    // Event Declarations
    event NewPost(string title, string description, address user);
    event LikeRegistered(uint postId, address user);

    constructor() ERC20("SafeCoin", "SAFE") ERC20Permit("SafeCoin") {
        contractOwner = msg.sender;
        numPosts = 0;    

        _mint(msg.sender, 1000000 * 10 ** decimals());    
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to create a new post
    function newPost(string memory _title, string memory _description, string memory _tags) public {        
        Post storage post = posts[numPosts];
        post.id = numPosts;
        post.title = _title;
        post.description = _description;
        post.user = msg.sender;
        post.numLikes = 0;
        post.timestamp = block.timestamp;
        post.tags = _tags;
        numPosts++;

        _mint(msg.sender, 10); 

        emit NewPost(_title, _description, msg.sender);       
    }

    // Function to get all the posts
    function getAllPosts() public view returns (PostData[] memory) {
        PostData[] memory postDataArray = new PostData[](numPosts);
        for (uint i = 0; i < numPosts; i++) {
            Post storage post = posts[i];
            PostData memory postData = PostData({
                id: post.id,
                title: post.title,
                description: post.description,
                user: post.user,
                numLikes: post.numLikes,
                timestamp: post.timestamp,
                tags: post.tags
            });
            postDataArray[i] = postData;
        }
        return postDataArray;
    }

    // Function to register a new like
    function registerLike(uint _postId) public {
        posts[_postId].likes[msg.sender] = true;
        posts[_postId].numLikes++;

        _mint(msg.sender, 10);

        emit LikeRegistered(_postId, msg.sender);
    }

}