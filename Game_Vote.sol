// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract GameVote {
    address public owner;
    uint public totalVotes;
    bool public pollOpen;

    mapping(address => bool) public hasVoted;

    struct Game {
        string name;
        uint voteCount;
    }

    Game[] public games;   

    constructor() {
        owner = msg.sender;
        pollOpen = true;
        totalVotes = 0;
        games.push(Game("Rainbow 6 Siege", 0));
        games.push(Game("League of Legends", 0));
        games.push(Game("Apex Legends", 0));
    }

    function vote(uint gameIndex) public {
        require(pollOpen, "Poll is closed");
        require(!hasVoted[msg.sender], "You have already voted");
        require(gameIndex < games.length, "Invalid game");

        hasVoted[msg.sender] = true;
        games[gameIndex].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, gameIndex);
    }

    event Voted(address voter, uint gameIndex);

    function getGames() public view returns (Game[] memory) {
        return games;
    }

    function getVoteCount(uint gameIndex) public view returns (uint) {
        require(gameIndex < games.length, "Invalid game");
        return games[gameIndex].voteCount;
    }

    function closePoll() public {
        require(msg.sender == owner, "Only owner can call this function");
        pollOpen = false;
        emit PollClosed();
    }

    event PollClosed();
}