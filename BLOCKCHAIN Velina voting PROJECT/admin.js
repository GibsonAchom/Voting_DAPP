// admin.js

document.addEventListener("DOMContentLoaded", function () {
  // Create a Web3 instance
  const web3 = new Web3("http://localhost:8545"); // Replace with your local Ethereum node URL

  // Connect to contract
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Add candidate form submission event listener
  document
    .getElementById("addCandidateForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const candidateName = document.getElementById("candidateName").value;
      const candidateImage = document.getElementById("candidateImage").value;
      try {
        const accounts = await web3.eth.getAccounts();
        const SuperAdminAccount = accounts[0];
        await contract.methods
          .addCandidate(candidateName, candidateImage)
          .send({ from: SuperAdminAccount, gas: "3000000" }); // Replace with the actual admin account address
        alert("Candidate added successfully!");
      } catch (error) {
        console.error(error);
        alert("Error occurred while adding candidate.");
      }
    });

  // Add voter form submission event listener
  document
    .getElementById("addVoterForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const voterName = document.getElementById("voterName").value;
      try {
        const accounts = await web3.eth.getAccounts();
        const SuperAdminAccount = accounts[0];
        const voterAddress = accounts[1];
        await contract.methods
          .addVoter(voterAddress, voterName)
          .send({ from: SuperAdminAccount }); // Replace with the actual admin account address
        alert("Voter added successfully!");
      } catch (error) {
        console.error(error);
        alert("Error occurred while adding voter.");
      }
    });

  // Tally votes button event listener
  document
    .getElementById("tallyVotesBtn")
    .addEventListener("click", async function () {
      try {
        const winner = await contract.methods.tallyVotes().call();
        alert(`The winning candidate is: ${winner}`);
      } catch (error) {
        console.error(error);
        alert("Vote is currently ongoing");
      }
    });

  document
    .getElementById("startVotesBtn")
    .addEventListener("click", async function () {
      try {
        const accounts = await web3.eth.getAccounts();
        const SuperAdminAccount = accounts[0];
        await contract.methods.startVote().send({ from: SuperAdminAccount });
        alert("Vote has started");
      } catch (error) {
        console.error(error);
        alert("Vote already started or error occurred");
      }
    });

  // Stop vote button event listener
  document
    .getElementById("stopVotesBtn")
    .addEventListener("click", async function () {
      try {
        const accounts = await web3.eth.getAccounts();
        const SuperAdminAccount = accounts[0];
        await contract.methods.stopVote().send({ from: SuperAdminAccount });
        alert("Vote has stopped");
      } catch (error) {
        console.error(error);
        alert("Vote already stopped or error occurred");
      }
    });
});
