import React from "react";
import "./daasMap.css";
import { ShippingsInfoProps } from "./daasMap.type";

const ShippingsInfo = ({ shippings }: ShippingsInfoProps) => (
  <div className="info-container white">
    {shippings.map((s, i) => (
      <div key={"shippinginfo" + i} className={"row small  info-row"}>
        <span className={"bold"}>{"물품"}</span>
        <span className={"info-label-shipping"}>{s.tracking_number}</span>
      </div>
    ))}
  </div>
);

export default ShippingsInfo;
