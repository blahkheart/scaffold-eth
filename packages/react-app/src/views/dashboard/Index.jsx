import React from "react";
import { CenterContent, ContentRow, ContentCol } from "../../components";

function Index() {
  return (
    <CenterContent left={320} right={320}>
      <ContentRow justifyContent={"center"}>
        <ContentCol>
          <h1>Dashboard</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis excepturi natus, cupiditate recusandae
            quos sapiente sed quo praesentium tenetur, pariatur eos sunt, earum doloremque eaque rem magnam nisi
            voluptatibus! Odit.
          </p>
        </ContentCol>
      </ContentRow>
    </CenterContent>
  );
}

export default Index;
