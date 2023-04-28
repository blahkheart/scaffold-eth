import React, { useState } from "react";
import Web3 from "web3";
import { abi, address } from "./contracts/PaymentContract.json";

const web3 = new Web3(Web3.givenProvider);

const contract = new web3.eth.Contract(abi, address);

function PaymentRecord() {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState(0);
  const [payerSig, setPayerSig] = useState("");
  const [vendorSig, setVendorSig] = useState("");

  const handleCreatePaymentRecord = async () => {
    const message = `${amount},${web3.eth.defaultAccount}`;
    const { signature } = await web3.eth.personal.sign(message, web3.eth.defaultAccount);
    setPayerSig(signature);

    await contract.methods.createPaymentRecord(vendor, amount, payerSig).send({ from: web3.eth.defaultAccount });
  };

  const handleSignPaymentRecord = async index => {
    const message = `${amount},${web3.eth.defaultAccount}`;
    const { signature } = await web3.eth.personal.sign(message, web3.eth.defaultAccount);
    setVendorSig(signature);

    await contract.methods.signPaymentRecord(index, vendorSig).send({ from: web3.eth.defaultAccount });
  };

  const handleGetPaymentRecord = async index => {
    const [payer, vendor, amount, payerSig, vendorSig] = await contract.methods.getPaymentRecord(index).call();

    const isVerified = await contract.methods.verifyPaymentRecord(index).call();

    console.log({
      payer,
      vendor,
      amount: web3.utils.fromWei(amount),
      payerSig,
      vendorSig,
      isVerified,
    });
  };

  return (
    <div>
      <h1>Payment Record</h1>
      <label>
        Vendor:
        <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} />
      </label>
      <br />
      <label>
        Amount:
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      </label>
      <br />
      <button onClick={handleCreatePaymentRecord}>Create Payment Record</button>
      <br />
      <button onClick={() => handleSignPaymentRecord(0)}>Sign Payment Record</button>
      <br />
      <button onClick={() => handleGetPaymentRecord(0)}>Get Payment Record</button>
    </div>
  );
}

export default PaymentRecord;
