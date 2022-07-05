import React from "react";
import "./daasMap.css";
import { ContainerInfoProps } from "./daasMap.type";

const ContainerInfo = ({ container }: { container?: ContainerInfoProps }) => (
  <div className="info-container white">
    <div className={"row small bold info-title info-row"}>
      <span className={"info-label"}>유닛 박스</span>
      <span>{container?.box?.alias || "박스 없음"}</span>
    </div>
    {container?.box && (
      <>
        <div className={"row small info-row"}>
          <span className={"bold info-label"}>일반</span>
          <span>{container?.count_shipping}</span>
        </div>
        <div className={"row smal info-row"}>
          <span className={"bold info-label"}>반품</span>
          <span>{container?.count_return}</span>
        </div>
      </>
    )}
  </div>
);

export default ContainerInfo;
