import React, { useState } from "react";
import { ethers } from "ethers";
import PaymentRecord from "./contracts/PaymentRecord.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = "0x123..."; // Address of the deployed PaymentRecord contract
const contractABI = PaymentRecord.abi;
const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());

function App() {
  const [paymentDetails, setPaymentDetails] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleAddPaymentRecord = async () => {
    try {
      const tx = await contract.addPaymentRecord(paymentDetails);
      setTransactionHash(tx.hash);
      await tx.wait();
      setTransactionHash("");
      setPaymentDetails("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Add Payment Record</h1>
      <label>
        Payment Details:
        <input type="text" value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} />
      </label>
      <button onClick={handleAddPaymentRecord}>Add Record</button>
      {transactionHash && (
        <p>
          Transaction submitted:{" "}
          <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            {transactionHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
