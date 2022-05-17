/// <reference types="react" />
export declare type Overlaped = {
    index: number;
};
export declare type DaasMapProps = {
    currentPosition?: GeolocationPosition;
    containers?: MapContainerType[];
    deliveries?: MapDeliveryType[];
    isContainerVisible?: boolean;
    isDeliveryVisible?: boolean;
    isVisibleMarkers?: boolean;
    compassSupported?: boolean;
    children: JSX.Element | JSX.Element[];
    selectedDelivery: number;
    selectedContainer: any[];
    onClickDelivery: (item: number) => void;
    onClickContainer: (item: number) => void;
    onClickMap: () => void;
    onClickOverlappedContainer: (overlaped: Overlaped[]) => void;
};
export declare type MapContainerType = {
    unit_location?: {
        lat: string;
        lng: string;
    };
    uuid: string;
    status: "CLAIMED" | "FINISHED" | "DELIVERYCOMPLETED";
    container_class: "WHITE" | "BLUE" | "BLACK";
};
export declare type MapDeliveryType = {
    address?: {
        lat: string;
        lng: string;
    };
    uuid: string;
    complete: boolean;
    shipping_count: number;
    return_count: number;
};
