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
        uint numComments;
    }

    struct PostComment {
        uint id;
        string text;
        address user;
        uint timestamp;
    }

    // Mapping of Posts
    mapping(uint => Post) public posts;

    // Mapping of PostComments
    mapping(uint => PostComment[]) public postComments;

    // Event Declarations
    event NewPost(string title, string description, address user);
    event LikeRegistered(uint postId, address user);
    event CommentRegistered(uint postId, uint commentId, string comment, address user);

    constructor() ERC20("SafeCoin", "SAFE") ERC20Permit("SafeCoin") {
        contractOwner = msg.sender;
        numPosts = 0;    

        _mint(msg.sender, 3 * 10 ** 24);
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

        _mint(msg.sender, 180); 

        emit NewPost(_title, _description, msg.sender);       
    }

    // Function to get all the posts
    function getAllPosts(uint page, uint perPage) public view returns (PostData[] memory) {
        require(page > 0, "Page number should be greater than zero");
        require(perPage > 0, "PerPage number should be greater than zero");
        
        uint startIndex = (page - 1) * perPage;
        uint endIndex = startIndex + perPage > numPosts ? numPosts : startIndex + perPage;
        
        PostData[] memory postDataArray = new PostData[](endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            Post storage post = posts[i];
            PostData memory postData = PostData({
                id: post.id,
                title: post.title,
                description: post.description,
                user: post.user,
                numLikes: post.numLikes,
                timestamp: post.timestamp,
                tags: post.tags,
                numComments: postComments[i].length
            });
            postDataArray[i - startIndex] = postData;
        }
        return postDataArray;
    }

    // Function to register a new like
    function registerLike(uint _postId) public {
        require(!posts[_postId].likes[msg.sender], "You have already registered a like for this post");

        posts[_postId].likes[msg.sender] = true;
        posts[_postId].numLikes++;

        _mint(msg.sender, 20);

        emit LikeRegistered(_postId, msg.sender);
    }

    function registerComment(uint _postId, string memory _comment) public {  
        PostComment memory comment = PostComment({
            id: postComments[_postId].length,
            text: _comment,
            user: msg.sender,
            timestamp: block.timestamp
        });
        postComments[_postId].push(comment);

        _mint(msg.sender, 60);

        emit CommentRegistered(_postId, comment.id, _comment, msg.sender);
    }

    function getPostComments(uint _postId) public view returns (PostComment[] memory) {
        return postComments[_postId];
    }
}