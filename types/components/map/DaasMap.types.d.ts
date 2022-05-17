import { ReactNode } from "react";
import { Overlaped } from "./DaasMap";
export interface DaasMapProp {
    currentPosition: any;
    containers?: any[];
    deliveries?: any[];
    isContainerVisible?: boolean;
    isDeliveryVisible?: boolean;
    isVisibleMarkers?: boolean;
    compassSupported?: boolean;
    children: ReactNode;
    selectedDelivery: number;
    selectedContainer: any[];
    onClickDelivery: (item: number) => void;
    onClickContainer: (item: number) => void;
    onClickMap: () => void;
    onClickOverlappedContainer: (overlaped: Overlaped[]) => void;
}
