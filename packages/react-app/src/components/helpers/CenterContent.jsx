import React from "react";

function CenterContent({ left, right, ...props }) {
  return <div style={{ marginLeft: left, marginRight: right }}>{props.children}</div>;
}

export default CenterContent;
