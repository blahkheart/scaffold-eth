import React from "react";

function ContentRow({ margin, justifyContent, ...props }) {
  return (
    <div
      className="mh-row"
      style={{ display: "flex", justifyContent: justifyContent, alignItems: "center", margin: margin }}
    >
      {props.children}
    </div>
  );
}

export default ContentRow;
