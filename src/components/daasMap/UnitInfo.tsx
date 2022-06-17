import React from "react";
import "./daasMap.css";
import { UnitInfoProps } from "./daasMap.type";

const UnitInfo = ({
  name,
  num_unitarrived,
  num_claimed,
  num_out_delivery_completed,
  num_out_return_unit_available,
  num_unit_returned,
  num_out_for_delivery,
}: UnitInfoProps) => (
  <div className="info-container white">
    <div className={"row small bold info-title info-row"}>
      <span className={"info-label"}>유닛 이름</span>
      <span>{name}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>유닛 도착</span>
      <span>{num_unitarrived}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>박스 에약</span>
      <span>{num_claimed}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>업무 시작</span>
      <span>{num_out_for_delivery}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>반납 대기</span>
      <span>{num_out_return_unit_available}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>업무 완료</span>
      <span>{num_out_delivery_completed}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>회수 대기</span>
      <span>{num_unit_returned}</span>
    </div>
  </div>
);

export default UnitInfo;
