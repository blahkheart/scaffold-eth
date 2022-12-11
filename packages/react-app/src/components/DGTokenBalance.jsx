import React, { useState } from "react";
import { Statistic } from "antd";
import { useBalance } from "eth-hooks";
const { utils } = require("ethers");

/*
  ~ What it does? ~

  Displays a balance of given address

  ~ How can I use? ~
  <Balance
    title={"MyTokenName"}
    balance={tokenBalance}
  />

  ~ Features ~
  - Provide balance={tokenBalance} and get DGToken balance corresponding to given address

*/

export default function DGTokenBalance(props) {
  const balance = useBalance(props.provider, props.address);
  let floatBalance = parseFloat("0.00");

  let usingBalance = balance;

  if (typeof props.balance !== "undefined") {
    usingBalance = props.balance;
  }
  if (typeof props.value !== "undefined") {
    usingBalance = props.value;
  }

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  return (
    <>
      <Statistic title={props.title} value={displayBalance} precision={2} />
    </>
  );
}
