import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
const buidlBuxxAbi = require("../contracts/erc20.json");
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // const provider = new ethers.providers.WebSocketProvider(`wss://zksync2-mainnet.zksync.io/ws`);
  const provider = new ethers.providers.WebSocketProvider(`wss://zksync2-testnet.zksync.dev/ws`); // testnet

  // const buidlBuxxAddress = "0x1bbA25233556a7C3b41913F35A035916DbeD1664"; // replace with your contract address
  const buidlBuxxAddress = "0x0faf6df7054946141266420b43783387a78d82a9"; // replace with your contract address

  const [transferEvents, setTransferEvents] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const buidlBuxxContract = new ethers.Contract(buidlBuxxAddress, buidlBuxxAbi, provider);
  console.log("test buildBux", buidlBuxxContract);

  buidlBuxxContract.on("Transfer", (from, to, value, event) => {
    setTransferEvents(prevEvents => [...prevEvents, event.args]);
  });

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const filteredEvents = transferEvents.filter(event => {
    // return event.timestamp.includes(searchValue) || event.from.includes(searchValue) || event.to.includes(searchValue);
    try {
      return event.timestamp.includes(searchValue) || event.to.includes(searchValue);
    } catch (e) {
      console.log(e);
    }
  });
  const loadMore = async () => {
    const fromBlock = transferEvents.length === 0 ? 0 : transferEvents[transferEvents.length - 1].blockNumber + 1;
    const toBlock = fromBlock + 99;

    const events = await buidlBuxxContract.queryFilter("Transfer", fromBlock, toBlock);
    setTransferEvents(prevEvents => [...prevEvents, ...events]);

    // if (events.length < 100) {
    if (events.length > 10) {
      setHasMore(false);
    }
  };
  console.log("test", transferEvents);
  return (
    <div>
      <h1>ETH Denver Admin | BackUp</h1>
      <InfiniteScroll dataLength={transferEvents.length} next={loadMore} hasMore={hasMore} loader={<h4>Loading...</h4>}>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transferEvents && transferEvents.length
              ? transferEvents.map(event => (
                  <tr key={event.transactionHash}>
                    <td>{event.timestamp}</td>
                    <td>{event.from}</td>
                    <td>{event.to}</td>
                    <td>{event.value.toString()}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}

export default Home;
