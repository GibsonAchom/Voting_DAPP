// Import Web3 library
const web3 = new Web3("http://127.0.0.1:8545");

// Connect to contract
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Populate candidate select options
async function populateCandidates() {
  try {
    const candidateCount = await contract.methods.getCandidateCount().call();
    const select = document.getElementById("candidateSelect");
    for (let i = 0; i < candidateCount; i++) {
      const candidate = await contract.methods.candidates(i).call();
      const option = document.createElement("option");
      option.text = candidate.name;
      option.value = i.toString(); // Use candidate index as value
      select.appendChild(option);
    }
  } catch (error) {
    console.error("Error occurred while fetching candidates:", error);
    alert("Canidate has already voted. See console for details.");
  }
}
// Populate candidates table
async function populateCandidatesTable() {
  try {
    const candidateCount = await contract.methods.getCandidateCount().call();
    const tableBody = document.querySelector("#candidatesTable tbody");
    for (let i = 0; i < candidateCount; i++) {
      const candidate = await contract.methods.candidates(i).call();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${candidate.name}</td>
        <td><img src="${candidate.imageUrl}" alt="Candidate Image"></td>
      `;
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error("Error occurred while fetching candidates:", error);
    alert("Error occurred while fetching candidates. See console for details.");
  }
}
populateCandidates();
populateCandidatesTable();
// Vote form submission event listener
document
  .getElementById("voteForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const candidateIndex = document.getElementById("candidateSelect").value;
    try {
      const accounts = await web3.eth.getAccounts();
      const VoterAccount = accounts[1];
      console.log(VoterAccount);
      await contract.methods.vote(candidateIndex).send({ from: VoterAccount });
      alert("Vote cast successfully!");
    } catch (error) {
      console.error(error);
      alert("Vote not started or Already voted");
    }
  });
