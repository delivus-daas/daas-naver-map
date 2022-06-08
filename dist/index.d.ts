/// <reference types="react" />
import React from 'react';

declare type Overlaped = {
    index: number;
};
declare type DaasMapProps = {
    currentPosition?: GeolocationPosition;
    units?: MapUnitType[];
    containers?: MapContainerType[];
    deliveries?: MapDeliveryType[];
    shippings?: MapShippingType[];
    isContainerVisible?: boolean;
    isUnitVisible?: boolean;
    isShippingVisible?: boolean;
    isDeliveryVisible?: boolean;
    isVisibleMarkers?: boolean;
    compassSupported?: boolean;
    isShowInfoWindow?: boolean;
    children?: JSX.Element | JSX.Element[];
    selectedDelivery?: number;
    selectedUnit?: UnitInfoProps;
    selectedContainer?: any[];
    onClickDelivery?: (item: number) => void;
    onClickShipping?: (item: number) => void;
    onClickContainer?: (item: number) => void;
    onClickUnit?: (item: number) => void;
    onClickMap?: () => void;
    onClickOverlappedContainer?: (overlaped: Overlaped[]) => void;
    onClickOverlappedShipping?: (overlaped: Overlaped[]) => void;
};
interface UnitInfoProps extends MapUnitType {
    num_assigned: number;
    num_delivery_completed: number;
    num_out_for_delivery: number;
    num_ready_for_delivery: number;
    num_ready_for_return_hub: number;
    num_ready_for_return_unit: number;
    num_total: number;
    onClose: () => void;
    index?: number;
}
declare type MapContainerType = {
    unit_location?: {
        lat: string;
        lng: string;
        name: string;
        address1: string;
        address2: string;
    };
    timestamp_claimed: string;
    count_deliveries: number;
    count_remaining: number;
    count_return: number;
    count_return_collected: number;
    count_shipping: number;
    count_shipping_incomplete: number;
    count_total_items: number;
    uuid: string;
    status: "CLAIMED" | "FINISHED" | "DELIVERYCOMPLETED";
    container_class: "WHITE" | "BLUE" | "BLACK";
};
declare type MapUnitType = {
    id: string;
    name: string;
    address: {
        name: string;
        address_road: string;
        address_jibun: string;
        lat: string;
        lng: string;
        zipcode: string;
        mobile_tel: string;
        sector: {
            area: string;
            code: string;
            id: string;
            name: string;
        };
    };
    sector_codes: string;
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
declare type MapShippingType = {
    address?: {
        lat: string;
        lng: string;
    };
    uuid: string;
    complete: boolean;
    is_return: boolean;
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
