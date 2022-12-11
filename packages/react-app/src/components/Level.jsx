import React, { useEffect, useState } from "react";
import { Button, Spin, Input } from "antd";
// import { Button } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useUnlockState } from "../hooks";
const { ethers } = require("ethers");

export default function Level({ abis, userSigner, writeContracts, address, dreadGangAddress }) {
  const [name, setName] = useState();
  const [maxKeys, setMaxKeys] = useState();
  const [numberOfOwners, setNumberOfOwners] = useState();
  const [isManager, setIsManager] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isDreadGangManager, setIsDreadGangManager] = useState();
  // const [toAddress, setToAddress] = useState();
  // const [keyGranterRole, setKeyGranterRole] = useState();
  // const [lockManagerRole, setLockManagerRole] = useState();

  let history = useHistory();
  let { id } = useParams();
  const publicLock = new ethers.Contract(id, abis.PublicLockV10.abi, userSigner);
  const hasValidKey = useUnlockState(publicLock, address);

  useEffect(() => {
    setIsLoading(true);
    let _name, _maxKeys, _numberOfOwners, _isManager, _isDreadGangLockManager;
    const loadLevelData = async () => {
      _name = await publicLock.name();
      _maxKeys = await publicLock.maxNumberOfKeys();
      _numberOfOwners = await publicLock.totalSupply();
      _isManager = await publicLock.isLockManager(address);
      _isDreadGangLockManager = await publicLock.isLockManager(dreadGangAddress);

      setName(_name);
      setMaxKeys(_maxKeys.toNumber());
      setNumberOfOwners(_numberOfOwners.toNumber());
      setIsManager(_isManager);
      setIsDreadGangManager(_isDreadGangLockManager);
      setIsLoading(false);
    };
    loadLevelData();
  }, [id, numberOfOwners, address]);

  const grantKeys = async (receivers, exp, managers) => {
    try {
      const tx = await writeContracts.DreadGang.grantKeys(id, receivers, exp, managers);
      console.log(tx);
    } catch (e) {
      console.log(e);
    }
  };

  const addLockManager = async () => {
    try {
      if (dreadGangAddress) {
        const lockManagerTx = await publicLock.addLockManager(dreadGangAddress);
        // const keyGranterTx = await publicLock.addKeyGranter(dreadGangAddress);
        console.log("lockManagerTX: ", lockManagerTx);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return isLoading ? (
    <Spin style={{ marginTop: 30 }}></Spin>
  ) : (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <Button
        type="link"
        onClick={() => {
          history.push("/levels");
        }}
      >
        Back
      </Button>
      <h3>{name}</h3>
      <p>Max squad members: {maxKeys}</p>
      <p>
        Squad members: {numberOfOwners} / {maxKeys}
      </p>
      {/* <Input
          placeholder="Enter receiver address"
          style={{ marginBottom: 15 }}
          value={toAddress}
          onChange={e => {
            const newValue = e.target.value;
            setToAddress(newValue);
          }}
        /> */}
      <Button
        color="primary"
        disabled={hasValidKey || !isDreadGangManager}
        onClick={() => {
          // eslint-disable-next-line no-undef
          let exp = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");
          grantKeys([address], [exp], [dreadGangAddress]);
        }}
      >
        {!hasValidKey ? "Claim spot" : "Key owned"}
      </Button>
      {isDreadGangManager === false && isManager ? (
        <Button onClick={addLockManager}>Make DreadGang Manager</Button>
      ) : (
        ""
      )}
    </div>
  );
}
