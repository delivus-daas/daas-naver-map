import React from "react";
import "./daasMap.css";
import { ShippingsInfoProps } from "./daasMap.type";

const ShippingsInfo = ({ shippings }: ShippingsInfoProps) => (
  <div className="info-container white">
    {shippings.map((s) => (
      <div className={"row small bold info-title info-row"}>
        <span className={"info-label"}>{""}</span>
        <span>{s.tracking_number}</span>
      </div>
    ))}
  </div>
);

export default ShippingsInfo;
