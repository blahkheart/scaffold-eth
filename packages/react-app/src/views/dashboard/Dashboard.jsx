import { Button, Card, Col, Space, Spin, Input, Row, Divider } from "antd";
import "antd/dist/antd.css";
import { DGTokenBalance } from "../../components";
import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { useEffect } from "react";
const { ethers } = require("ethers");

const Dashboard = ({ address, yourCollectibles, tx, readContracts, writeContracts, tokenBalance }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [creatingLevel, setCreatingLevel] = useState(false);
  const [nftData, setNftData] = useState({});
  const [levelLockAddress, setLevelLockAddress] = useState();
  const [levelUpAddress, setLevelUpAddress] = useState();
  const [levelingUp, setLevelingUp] = useState();
  const [tokenId, setTokenId] = useState();
  const [tokenToLoadId, setTokenToLoadId] = useState();
  const [minTargetLevel, setMinTargetLevel] = useState();
  const [levelUpCost, setLevelUpCost] = useState({});

  const { Meta } = Card;

  useEffect(() => {
    const loadLevelUpCost = async () => {
      let _levelUpCost = {};
      let _createLevelFee;
      let _levelingUpFee;
      if (tokenId) {
        try {
          const currentLevel = await readContracts.DreadGang.getLevel(tokenId);
          const baseLevelUpfee = await readContracts.DreadGang.baseLevelUpFee();
          _levelingUpFee = (currentLevel * baseLevelUpfee) / 100;
        } catch (e) {
          console.log(e);
        }
      }
      if (minTargetLevel) {
        const noob = await readContracts.DreadGang.baseLevelNoob();
        const hustler = await readContracts.DreadGang.baseLevelHustler();
        const OG = await readContracts.DreadGang.baseLevelOG();
        if (minTargetLevel >= noob && minTargetLevel <= hustler) {
          _createLevelFee = await readContracts.DreadGang.gatePassNoob();
        } else if (minTargetLevel >= hustler && minTargetLevel <= OG) {
          _createLevelFee = await readContracts.DreadGang.gatePassHustler();
        } else if (minTargetLevel >= OG) {
          _createLevelFee = await readContracts.DreadGang.gatePassOG();
        } else {
          _createLevelFee = 0;
        }
      }
      _levelUpCost = {
        createLevelCost: _createLevelFee,
        levelingUpCost: _levelingUpFee,
      };
      setLevelUpCost(_levelUpCost);
    };
    loadLevelUpCost();
  }, [tokenId, minTargetLevel]);

  const loadNFTData = async () => {
    try {
      let nftData;
      let nftLevel;
      const _level = await readContracts.DreadGang.getLevel(tokenToLoadId);
      if (_level) {
        nftLevel = _level.toNumber();
        if (yourCollectibles && yourCollectibles.length) {
          for (let i = 0; i < yourCollectibles.length; i++) {
            let id = yourCollectibles[i].id.toNumber();
            if (id == tokenToLoadId) {
              nftData = { ...yourCollectibles[i], nftLevel };
            }
          }
        }
      }
      setNftData(nftData);
    } catch (e) {
      console.log(e);
    }
  };

  const nftPreview = (
    <>
      <div style={{ padding: 8, marginTop: 32, width: 450, margin: "auto" }}>
        <Card title="Street Cred">
          <div style={{ padding: 8, display: "flex" }}>
            <Input
              style={{ textAlign: "center", marginBottom: 15 }}
              placeholder={"Enter token Id"}
              type="number"
              value={tokenToLoadId}
              onChange={e => {
                const newValue = e.target.value;
                setTokenToLoadId(newValue);
              }}
            />
            <Button
              type={"secondary"}
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                loadNFTData();
                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              Load
            </Button>
          </div>
          <div style={{ padding: 8, display: "flex", justifyContent: "center" }}>
            {nftData ? (
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                cover={
                  <img
                    alt="Load NFT Info ☝️"
                    src={nftData ? nftData.image : "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
                  />
                }
              >
                <Meta
                  title={nftData && nftData.name ? nftData.name : "DreadGang #"}
                  description={nftData && nftData.nftLevel >= 0 ? `Level: ${nftData.nftLevel}` : <Spin size="small" />}
                />
              </Card>
            ) : (
              <Space size="middle">
                <Spin />
              </Space>
            )}
          </div>
        </Card>
      </div>
    </>
  );

  const createLevel = (
    <>
      <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
        <Card title="Create level">
          <div style={{ padding: 8 }}>
            <Input
              style={{ textAlign: "center", marginBottom: 15 }}
              placeholder={"Lock address"}
              value={levelLockAddress}
              onChange={e => {
                const newValue = e.target.value;
                setLevelLockAddress(newValue);
              }}
            />
            <Input
              style={{ textAlign: "center" }}
              placeholder={"Minimum target level"}
              value={minTargetLevel}
              onChange={e => {
                const newValue = e.target.value;
                setMinTargetLevel(newValue);
              }}
            />
          </div>
          <div style={{ padding: 8 }}>
            <Button
              type={"danger"}
              loading={creatingLevel}
              onClick={async () => {
                setCreatingLevel(true);
                // await tx(writeContracts.DreadGang.createLevelUpLock(levelLockAddress, minTargetLevel, { value: ethers.utils.parseEther(levelUpCost.createLevelCost.toNumber()) }));
                await tx(
                  writeContracts.DreadGang.createLevelUpLock(levelLockAddress, minTargetLevel, {
                    value: levelUpCost.createLevelCost,
                  }),
                );
                setCreatingLevel(false);
              }}
              disabled={false}
            >
              Create New Level
            </Button>
          </div>
        </Card>
      </div>
    </>
  );

  const levelUp = (
    <>
      <div style={{ padding: 8, marginTop: 32, width: 300, margin: "auto" }}>
        <Card title="Level Up">
          <div style={{ padding: 8 }}>
            <Input
              style={{ textAlign: "center", marginBottom: 15 }}
              placeholder={"Level lock address"}
              value={levelUpAddress}
              onChange={e => {
                const newValue = e.target.value;
                setLevelUpAddress(newValue);
              }}
            />

            <Input
              style={{ textAlign: "center" }}
              placeholder={"Token Id"}
              value={tokenId}
              onChange={e => {
                const newValue = e.target.value;
                setTokenId(newValue);
              }}
            />
          </div>

          <div style={{ padding: 8 }}>
            <Button
              type={"primary"}
              loading={levelingUp}
              onClick={async () => {
                setLevelingUp(true);
                let currentLevel = await readContracts.DreadGang.getLevel(tokenId);
                let baseLevelNoob = await readContracts.DreadGang.baseLevelNoob();
                if (currentLevel >= baseLevelNoob) {
                  const dreadGangAddress = await readContracts.DreadGang.address;
                  const baseLevelUpFee = await readContracts.DreadGang.baseLevelUpFee();
                  const levelUpDues = JSON.stringify((currentLevel * baseLevelUpFee) / 100 + 1);
                  const levelUpDuesinWei = ethers.utils.parseEther(levelUpDues);
                  const allowance = await readContracts.DGToken.allowance(address, dreadGangAddress);
                  if (allowance < levelUpDuesinWei) {
                    await tx(writeContracts.DGToken.approve(dreadGangAddress, levelUpDuesinWei));
                  }
                }
                await tx(writeContracts.DreadGang.levelUp(levelUpAddress, tokenId));
                setLevelingUp(false);
              }}
              disabled={false}
            >
              Level Up
            </Button>
          </div>
        </Card>
      </div>
    </>
  );

  return (
    <>
      <Row>
        <Col span={24}>
          {nftPreview}
          <Divider />
          <DGTokenBalance title="DGToken (DGT)" balance={tokenBalance} />
          {createLevel}
          <Divider />
          {levelUp}
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
