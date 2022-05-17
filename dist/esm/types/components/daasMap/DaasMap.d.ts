import React from "react";
import "./daasMap.css";
import { DaasMapProps } from "./daasMap.type";
declare global {
    interface Window {
        naver: any;
    }
}
declare const DaasMap: React.ForwardRefExoticComponent<DaasMapProps & React.RefAttributes<unknown>>;
export default DaasMap;
