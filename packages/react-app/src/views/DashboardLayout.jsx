import React, { useState, useEffect } from "react";
import { Layout, Menu, Spin } from "antd";
import {
  QuestionCircleOutlined,
  LaptopOutlined,
  BranchesOutlined,
  BuildOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Address, Contract, CenterContent, ContentRow, ContentCol } from "../components";
import { Link, Route, Switch } from "react-router-dom";
import { Hints, ExampleUI, Subgraph, Index } from ".";

export default function DashboardLayout({
  address,
  mainnetProvider,
  blockExplorer,
  localProvider,
  userSigner,
  contractConfig,
  name,
  readContracts,
  writeContracts,
  targetNetwork,
  injectedProvider,
  tx,
  price,
  yourLocalBalance,
  purpose,
  ...props
}) {
  const { Sider, Content } = Layout;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (injectedProvider) {
      setIsLoading(false);
    }
  }, [injectedProvider]);

  return !isLoading ? (
    <Layout>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            style={{
              height: "100%",
              borderRight: 0,
            }}
          >
            <Menu.Item key="/dashboard">
              <Link to="/dashboard">
                <LaptopOutlined /> <span>Dashboard</span>{" "}
              </Link>
            </Menu.Item>
            <Menu.Item key="/hint">
              <Link to="/dashboard/hints">
                <QuestionCircleOutlined /> <span>Hints</span>{" "}
              </Link>
            </Menu.Item>
            <Menu.Item key="/subgraph">
              <Link to="/dashboard/subgraph">
                <BranchesOutlined /> <span>Subgraph</span>{" "}
              </Link>
            </Menu.Item>
            <Menu.Item key="/exampleui">
              <Link to="/dashboard/exampleui">
                <BuildOutlined /> <span>Example UI</span>{" "}
              </Link>
            </Menu.Item>
            <Menu.Item key="/debug">
              <Link to="/dashboard/debug">
                <SettingOutlined /> <span>Debug Contracts</span>{" "}
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 12px 20px 12px" }}>
            {address && (
              <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={18} />
            )}
          </div>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 500,
            }}
          >
            <Switch>
              <Route exact path="/dashboard">
                <Index signer={userSigner} provider={localProvider} />
              </Route>
              <Route path="/dashboard/subgraph">
                <div style={{ textAlign: "center" }}>
                  <Subgraph
                    subgraphUri={props.subgraphUri}
                    tx={tx}
                    writeContracts={writeContracts}
                    mainnetProvider={mainnetProvider}
                  />
                </div>
              </Route>
              <Route path="/dashboard/hints">
                <Hints
                  address={address}
                  yourLocalBalance={yourLocalBalance}
                  mainnetProvider={mainnetProvider}
                  price={price}
                />
              </Route>
              <Route path="/dashboard/exampleui">
                <ExampleUI
                  address={address}
                  userSigner={userSigner}
                  mainnetProvider={mainnetProvider}
                  localProvider={localProvider}
                  yourLocalBalance={yourLocalBalance}
                  price={price}
                  tx={tx}
                  writeContracts={writeContracts}
                  readContracts={readContracts}
                  purpose={purpose}
                />
              </Route>
              <Route path="/dashboard/debug">
                <div style={{ textAlign: "center" }}>
                  <Contract
                    name={name}
                    price={price}
                    signer={userSigner}
                    provider={localProvider}
                    address={address}
                    blockExplorer={blockExplorer}
                    contractConfig={contractConfig}
                  />
                </div>
              </Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  ) : (
    <CenterContent>
      <ContentRow>
        <ContentCol flex={1} alignItems={"center"}>
          <Spin></Spin>
        </ContentCol>
      </ContentRow>
    </CenterContent>
  );
}
