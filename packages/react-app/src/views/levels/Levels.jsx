import React, { useEffect, useState } from "react";
import { List } from "antd";
import { Switch, Route, Link, useHistory, useRouteMatch } from "react-router-dom";
import { Address, Level } from "../../components";

export default function Levels({ mainnetProvider, createLevelEvents }) {
  // let { path, url } = useRouteMatch();
  let history = useHistory();

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <List
        bordered
        dataSource={createLevelEvents}
        renderItem={item => {
          return (
            <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item.args[1].toNumber()}>
              Lv =&gt; &nbsp;
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> &nbsp;
              <Link
                to={`/level/${item.args[0]}`}
                onClick={() => {
                  history.push(`/level/${item.args[0]}`);
                }}
              >
                <span>Target Lv =&gt; {item.args[1].toNumber()}</span>
              </Link>
              &nbsp;Creator =&gt; &nbsp;
              <Address address={item.args[2]} ensProvider={mainnetProvider} fontSize={16} />
            </List.Item>
          );
        }}
      />
    </div>
  );
}
