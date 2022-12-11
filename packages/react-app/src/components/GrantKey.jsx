import { Button, Card, Col, Input, Row, Spin } from "antd";
// import { EtherInput } from "./";
import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import moment from "moment";
// import { BlockOutlined } from "@ant-design/icons";
const ethers = require("ethers");

/*
  ~ What it does? ~
  Allows a lock manager to grant key to a specific address
  ~ How can I use? ~
  <GrantKey
    abis={abis}
    userSigner={userSigner}
    address={address}
  />
*/

const GrantKey = ({ abis, userSigner, address }) => {
  const [toAddress, setToAddress] = useState();
  const [lockAddress, setLockAddress] = useState();
  const [isManager, setIsManager] = useState();
  const [publicLock, setPublicLock] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const readyPublicLock = () => {
      if (lockAddress) {
        let publicLockContract;
        try {
          publicLockContract = new ethers.Contract(lockAddress, abis.PublicLockV10.abi, userSigner);
          setPublicLock(publicLockContract);
        } catch (e) {
          console.log(e);
        }
      }
    };
    readyPublicLock();
  }, [lockAddress]);

  useEffect(() => {
    const isLockManager = async () => {
      if (publicLock) {
        try {
          setIsLoading(true);
          const _isManager = await publicLock.isLockManager(address);
          setIsManager(_isManager);
          setIsLoading(false);
        } catch (e) {
          console.log(e);
        }
      }
    };
    isLockManager();
  }, [lockAddress, address]);

  const grantKey = async (receivers, exp, managers) => {
    try {
      const tx = await publicLock.grantKeys(receivers, exp, managers);
      console.log(tx);
    } catch (e) {
      console.log(e);
    }
  };

  const grantKeys = (
    <>
      <div style={{ padding: 8, marginTop: 32, maxWidth: 592, margin: "auto" }}>
        <Card title="Grant Key">
          <Input
            placeholder="Enter lock address"
            style={{ marginBottom: 15 }}
            value={lockAddress}
            onChange={async e => {
              const newValue = e.target.value;
              setLockAddress(newValue);

              if (newValue) {
                setIsLoading(true);
                const _pubLock = new ethers.Contract(newValue, abis.PublicLockV10.abi, userSigner);
                const _isManager = await _pubLock.isLockManager(address);
                setIsManager(_isManager);
                setIsLoading(false);
              }
            }}
          />
          <Input
            placeholder="Enter receiver address"
            style={{ marginBottom: 15 }}
            value={toAddress}
            onChange={e => {
              const newValue = e.target.value;
              setToAddress(newValue);
            }}
          />
          <Button
            color="primary"
            loading={isLoading}
            disabled={!isManager}
            onClick={() => {
              // eslint-disable-next-line no-undef
              let exp = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");
              grantKey([toAddress], [exp], [address]);
            }}
          >
            Grant key
          </Button>
        </Card>
      </div>
    </>
  );

  return (
    <>
      <Row>
        <Col span={24}> {grantKeys} </Col>
      </Row>
    </>
  );
};

export default GrantKey;
