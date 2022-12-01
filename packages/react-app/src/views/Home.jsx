import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { CenterContent, ContentRow, ContentCol } from "../components";
import { useHistory } from "react-router-dom";

function Home({ loadWeb3Modal, injectedProvider }) {
  let history = useHistory();
  const getStarted = route => {
    if (injectedProvider) {
      history.push(route);
    } else {
      loadWeb3Modal();
    }
  };

  return (
    <div className="home">
      <CenterContent left={320} right={320}>
        <ContentRow justifyContent={"center"} margin={"0 0 250px 0"}>
          <ContentCol>
            <div>
              <h1 style={{ fontSize: 50, fontWeight: 700, margin: "50px 0px 40px" }}>
                🏗️ <span style={{ color: "#319795" }}> Scaffold</span> ETH
              </h1>
              <p style={{ fontSize: 21, fontWeight: 400, margin: "0 0px 25px 0" }}> This is Your App Home. 🏠</p>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>📝</span>
                You can start editing it in{" "}
                <span
                  className="highlight"
                  style={{
                    marginLeft: 4,
                    /* backgroundColor: "#f9f9f9", */ padding: 4,
                    borderRadius: 4,
                    fontWeight: "bolder",
                  }}
                >
                  packages/react-app/src/views/Home.jsx
                </span>
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>✏️</span>
                Edit your smart contract{" "}
                <span
                  className="highlight"
                  style={{
                    marginLeft: 4,
                    /* backgroundColor: "#f9f9f9", */ padding: 4,
                    borderRadius: 4,
                    fontWeight: "bolder",
                  }}
                >
                  YourContract.sol
                </span>{" "}
                in{" "}
                <span
                  className="highlight"
                  style={{
                    marginLeft: 4,
                    /* backgroundColor: "#f9f9f9", */ padding: 4,
                    borderRadius: 4,
                    fontWeight: "bolder",
                  }}
                >
                  packages/hardhat/contracts
                </span>
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>🔔</span>
                Tinker with Push protocol (EPNS) UI embed sidebar config to set up push notifications for your dapp in{" "}
                <span
                  className="highlight"
                  style={{
                    marginLeft: 4,
                    /* backgroundColor: "#f9f9f9", */ padding: 4,
                    borderRadius: 4,
                    fontWeight: "bolder",
                  }}
                >
                  packages/react-app/components/Account.jsx.
                </span>
                Check out their{" "}
                <a href="https://docs.push.org/developers/" target="_blank" rel="noreferrer">
                  docs
                </a>{" "}
                for more info.
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>🔗</span>
                Connect your wallet to access the dashboard
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>💭</span>
                Edit dashboard content in{" "}
                <span
                  className="highlight"
                  style={{
                    marginLeft: 4,
                    /* backgroundColor: "#f9f9f9", */ padding: 4,
                    borderRadius: 4,
                    fontWeight: "bolder",
                  }}
                >
                  packages/react-app/src/views/DashboardLayout.jsx
                </span>
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>💭</span>
                Check out the <Link to="dashboard/hints">"Hints"</Link> tab on the dashboard for more tips.
              </div>
              <div style={{ margin: 20 }}>
                <span style={{ marginRight: 8 }}>🛠</span>
                Tinker with your smart contract using the <Link to="dashboard/debug">"Debug Contract"</Link> tab.
              </div>
              <Button
                onClick={() => {
                  getStarted("/dashboard");
                }}
                style={{ marginTop: 13 }}
                shape="round"
                size={"large"}
              >
                {injectedProvider ? "Dashboard" : "Connect Wallet"}
              </Button>
            </div>
          </ContentCol>
        </ContentRow>
      </CenterContent>
    </div>
  );
}

export default Home;
