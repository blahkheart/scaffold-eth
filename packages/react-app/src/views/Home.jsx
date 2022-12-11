import { Button, List, Card } from "antd";
import React, { useState, useEffect } from "react";
import { useUnlockState } from "../hooks";
import { Address, AddressInput, Level, UnlockPaywall, CreateLock, GrantKey } from "../components";
import { useContractReader } from "eth-hooks";
// import { purchaseMembership } from "../helpers";
const { ethers } = require("ethers");
/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({
  userSigner,
  injectedProvider,
  readContracts,
  writeContracts,
  targetNetwork,
  collectibles,
  tx,
  isSquadMember,
  hasMintKey,
  loadWeb3Modal,
  blockExplorer,
  mainnetProvider,
  address,
  mintLock,
}) {
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [actionDurationBlocks, setActionDurationBlocks] = useState();
  const [minting, setMinting] = useState(false);

  // const hasValidMintKey = useUnlockState(mintLock, address);

  const mintItem = async () => {
    const result = tx(writeContracts && writeContracts.DreadGang && writeContracts.DreadGang.mintItem(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
  };

  return (
    <div>
      <div className="how-to-play" style={{ maxWidth: 820, margin: "auto" }}>
        <h3>How to get started?</h3>
        <ul style={{ textAlign: "left" }}>
          <li>Mint NFT 🏗️</li>
          <li>Register tokens to the state to initialize Loogie stats on Actions tab 📜</li>
          <li>Get approved to take actions i.e slap or cast ✏️</li>
          <li>
            Start having some fun 🎉 and slap or cast spells on any Loogie. 🕹️
            <br />
            <b>Hints 💡</b>
            <p>💎Dead Loogies i.e Loogies with zero (0) strength can't send or receive actions</p>
            <p>💎Winning slaps makes the winner stronger and the loser weaker</p>
            <p>💎Stronger loogies may counter slaps</p>
            <p>💎Loogies on immune spell can't be slapped or cast</p>
            <p>💎Casting immune spell increases the strength of the sender</p>
            <p>
              💎Only members can cast immune spell.{" "}
              {!hasMintKey ? (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    // purchaseMembership(userSigner, address, actionLockAddress);
                  }}
                >
                  Join now
                </Button>
              ) : (
                <Button size="small" disabled>
                  Member
                </Button>
              )}
            </p>
            <p>💎Effect of actions lasts for {actionDurationBlocks} blocks</p>
            <p>
              💎Use <code style={{ background: "#dedede", padding: 2 }}>healAfterExpiry()</code> on Smart contracts tab
              or 'Heal after action' button on Actions tab to restore dead loogies or strength when less than 10, works
              after action effect wears off. <br /> Note: This resets loogie state, and vibes to default and chill
              respectively, and strength to 10 if its less than 10 but only resets the state and vibes if strength is
              greater than 10
            </p>
            <p className="active-loogie-color">
              💎Loogie active state colors: <span className="slapped">Slapped</span> <span className="lust">Lust</span>{" "}
              <span className="rage">Rage</span> <span className="dead">Dead</span>
            </p>
          </li>
        </ul>
      </div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        {injectedProvider ? (
          <Button
            type={"primary"}
            onClick={() => {
              tx(writeContracts.DreadGang.mintItem());
            }}
          >
            MINT
          </Button>
        ) : (
          <Button type={"primary"} onClick={loadWeb3Modal}>
            CONNECT WALLET
          </Button>
        )}
      </div>

      <div style={{ width: 820, margin: "auto", paddingBottom: 256 }}>
        <List
          bordered
          dataSource={collectibles}
          renderItem={item => {
            const id = item.id.toNumber();

            console.log("IMAGE", item.image);

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                    </div>
                  }
                >
                  <a
                    href={
                      "https://opensea.io/assets/" +
                      (readContracts && readContracts.DreadGang && readContracts.DreadGang.address) +
                      "/" +
                      item.id
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={item.image} />
                  </a>
                  <div>{item.description}</div>
                </Card>

                <div>
                  owner:{" "}
                  <Address
                    address={item.owner}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize={16}
                  />
                  <AddressInput
                    ensProvider={mainnetProvider}
                    placeholder="transfer to address"
                    value={transferToAddresses[id]}
                    onChange={newValue => {
                      const update = {};
                      update[id] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update });
                    }}
                  />
                  <Button
                    onClick={() => {
                      console.log("writeContracts", writeContracts);
                      tx(writeContracts.DreadGang.transferFrom(address, transferToAddresses[id], id));
                    }}
                  >
                    Transfer
                  </Button>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
      <div style={{ width: 850, margin: "auto", marginTop: 32 }}>
        {!isSquadMember ? (
          <Button
            disabled={minting || !hasMintKey}
            style={{ marginBottom: 8 }}
            shape="round"
            size="large"
            onClick={() => {
              mintItem();
            }}
          >
            MINT NFT
          </Button>
        ) : (
          ""
        )}
        {!hasMintKey ? (
          // <UnlockPaywall
          //   shape="round"
          //   size="large"
          //   displayText="Get a membership key 🗝️ to unlock mint"
          //   targetNetwork={targetNetwork}
          //   publicLock={mintLock}
          // />
          <span>Get membership</span>
        ) : (
          ""
        )}
      </div>
      <div style={{ width: 850, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <List
          bordered
          dataSource={collectibles}
          renderItem={item => {
            const id = item.id.toNumber();
            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                    </div>
                  }
                >
                  <div style={{ marginBottom: 25 }}>
                    <img src={item.image} style={{ maxWidth: 250 }} />
                  </div>
                  <div>{item.description}</div>
                </Card>

                <div>
                  <div style={{ marginBottom: 15 }}>
                    owner:{" "}
                    <Address
                      address={item.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
                  </div>
                  <AddressInput
                    ensProvider={mainnetProvider}
                    placeholder="transfer to address"
                    value={transferToAddresses[id]}
                    onChange={newValue => {
                      const update = {};
                      update[id] = newValue;
                      setTransferToAddresses({ ...transferToAddresses, ...update });
                    }}
                  />
                  <br />
                  <Button
                    onClick={() => {
                      console.log("writeContracts", writeContracts);
                      tx(writeContracts.DreadGang.transferFrom(address, transferToAddresses[id], id));
                    }}
                  >
                    Transfer
                  </Button>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
      {/* <div style={{ width: 850, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <CreateLock price={price} unlock={unlock} />
        <GrantKey abis={abis} userSigner={userSigner} address={address} />
      </div> */}
    </div>
  );
}

export default Home;
