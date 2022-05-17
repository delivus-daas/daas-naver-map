/// <reference types="react" />
import React from 'react';

declare type Overlaped = {
    index: number;
};
declare type DaasMapProps = {
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
declare type MapContainerType = {
    unit_location?: {
        lat: string;
        lng: string;
    };
    uuid: string;
    status: "CLAIMED" | "FINISHED" | "DELIVERYCOMPLETED";
    container_class: "WHITE" | "BLUE" | "BLACK";
};
declare type MapDeliveryType = {
    address?: {
        lat: string;
        lng: string;
    };
    uuid: string;
    complete: boolean;
    shipping_count: number;
    return_count: number;
};

declare global {
    interface Window {
        naver: any;
    }
}
declare const DaasMap: React.ForwardRefExoticComponent<DaasMapProps & React.RefAttributes<unknown>>;

interface RenderNaverMapProps extends LoadScriptType {
    loading?: JSX.Element;
    error?: JSX.Element;
    clientId: string;
    ncpClientId: string;
    submodules?: [string];
    children: JSX.Element;
}
declare type LoadScriptType = {
    clientId: string;
    ncpClientId: string;
    submodules?: [string];
};

declare const RenderAfterNavermapsLoaded: ({ loading: loadingProp, error: errorProp, clientId, ncpClientId, submodules, children, }: RenderNaverMapProps) => JSX.Element;

declare const loadNavermapsScript: ({ clientId, submodules, ncpClientId, }: LoadScriptType) => any;

export { DaasMap, RenderAfterNavermapsLoaded as RenderNaverMap, loadNavermapsScript };
