import React from "react";
import "./daasMap.css";
import Close from "../../assets/svgs/close";
import { UnitInfoProps } from "./daasMap.type";

const UnitInfo = ({
  address,
  name,
  onClose,
  num_assigned,
  num_delivery_completed,
  num_out_for_delivery,
  num_ready_for_delivery,
  num_ready_for_return_hub,
  num_ready_for_return_unit,
  num_total,
}: UnitInfoProps) => (
  <div
    className="info-container white"
    onClick={() => {
      console.log("map container onclick");
      onClose();
    }}
  >
    <div className={"row small bold info-title info-row"}>
      <span className={"info-label"}>유닛 이름</span>
      <span>{name}</span>
      <button
        onClick={() => {
          console.log("map container onclick");
          onClose();
        }}
        className="info-btn"
      >
        <Close />
      </button>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>유닛 주소</span>
      <span>{address.address_road}</span>
    </div>
    <div className={"row smal info-row"}>
      <span className={"bold info-label"}>픽업 대기</span>
      <span>{num_assigned + "/" + num_total}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>배송 시작</span>
      <span>{num_out_for_delivery}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>박스 반납 대기</span>
      <span>{num_ready_for_return_hub}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>업무 완료</span>
      <span>{num_delivery_completed}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>회수 대기 박스</span>
      <span>{num_ready_for_return_unit}</span>
    </div>
    <div className={"row small info-row"}>
      <span className={"bold info-label"}>반납 대기</span>
      <span>{num_ready_for_return_hub}</span>
    </div>
  </div>
);

export default UnitInfo;
