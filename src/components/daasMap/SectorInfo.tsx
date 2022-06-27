import React from "react";
import "./daasMap.css";
import { SectorInfoProps } from "./daasMap.type";

const SectorInfo = ({
  code,
  count_total,
  count_return,
  count_shipping,
}: SectorInfoProps) => (
  <div className="info-container white">
    <div className={"row small bold info-title info-row"}>
      <span className={"info-label"}>{"sector"}</span>
      <span>{code}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>총 물품</span>
      <span>{count_total}</span>
    </div>
    <div className={"row smal info-row"}>
      <span className={"bold info-label"}>물품</span>
      <span>{count_shipping}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>반품</span>
      <span>{count_return}</span>
    </div>
  </div>
);

export default SectorInfo;
