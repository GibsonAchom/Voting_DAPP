// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.7.6;

contract Ballot {
    address public admin;
    bool public votingStarted;
    bool public votingStopped;

    struct Voter {
        uint id;
        bool hasVoted;
        string name;
    }
    mapping(address => Voter) public voters;

    uint public lastVoterId;

    struct Candidate {
        string name;
        string imageUrl;
        uint voteCount;
    }
    Candidate[] public candidates;

    event VoteCast(address indexed  voter, string candidate, uint timestamp);
    event VoteStarted();
    event VoteStopped();

    constructor() {
        admin = msg.sender;
        lastVoterId = 0;
        votingStarted = false;
        votingStopped = false;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not Authorized");
        _;
    }

    modifier onlyVoter() {
        require(votingStarted && !votingStopped && !voters[msg.sender].hasVoted, "Voting not active or already voted");
        _;
    }

    modifier votingActive() {
        require(votingStarted && !votingStopped, "Voting not active");
        _;
    }

    function startVote() public onlyAdmin {
        require(!votingStarted, "Voting already started");
        votingStarted = true;
        emit VoteStarted();
    }

    function stopVote() public onlyAdmin {
        require(votingStarted && !votingStopped, "Voting not active or already stopped");
        votingStopped = true;
        emit VoteStopped();
    }

    function addVoter(address _voterAddress, string memory _name) public onlyAdmin {
        lastVoterId++;
        voters[_voterAddress] = Voter(lastVoterId, false, _name);
    }

    function addCandidate(string memory _name, string memory _imageUrl) public onlyAdmin {
        candidates.push(Candidate(_name, _imageUrl, 0));
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    function vote(uint _candidateNo) public onlyVoter votingActive {
        require(_candidateNo < candidates.length, "Invalid Candidate");
        candidates[_candidateNo].voteCount++;
        voters[msg.sender].hasVoted = true;
        emit VoteCast(msg.sender, candidates[_candidateNo].name, block.timestamp);
    }

    function tallyVotes() public view onlyAdmin returns (string memory) {
        require(votingStopped, "Voting still active");
        
        uint winningVoteCount = 0;
        uint winningCandidateNo = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateNo = i;
            }
        }

        return candidates[winningCandidateNo].name;
    }
}
