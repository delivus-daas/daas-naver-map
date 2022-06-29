/// <reference types="react" />
import React from 'react';

declare type Overlaped = {
    index: number;
};
declare type Bound = {
    _max?: {
        _lat: number;
        _lng: number;
    };
    _min?: {
        _lat: number;
        _lng: number;
    };
};
declare type DaasMapProps = {
    minZoom?: number;
    maxZoom?: number;
    currentPosition?: GeolocationPosition;
    isContainerVisible?: boolean;
    isUnitVisible?: boolean;
    isBoundVisible?: boolean;
    isShippingVisible?: boolean;
    isDeliveryVisible?: boolean;
    isVisibleMarkers?: boolean;
    compassSupported?: boolean;
    isShowInfoWindow?: boolean;
    onGetBounds?: (bounds: Bound) => void;
    onMapReset?: (bounds: Bound) => void;
    selectedDelivery?: number;
    children?: JSX.Element | JSX.Element[] | boolean;
    onClickDelivery?: (item: number) => void;
    onClickShipping?: (item: number) => void;
    onMouseOverShipping?: (item: number) => void;
    onMouseOverUnit?: (item: number) => void;
    onMouseOutUnit?: (item: number) => void;
    onClickContainer?: (item: number) => void;
    onClickUnit?: (item: number, unit?: MapUnitType) => void;
    onClickMap?: () => void;
    onClickContainerCluster?: (containers: MapContainerType[]) => void;
    onClickOverlappedShipping?: (shippings?: MapShippingType[], sector?: MapSectorType, metric?: MetricType, highlighted?: boolean) => void;
    onMouseOverShippingCluster?: (shippings: MapShippingType[], sector: string) => void;
    getSectorInfo?: (sector: string, metric: MetricType) => Promise<SectorInfoProps | undefined>;
    getUnitInfo?: (unit: MapUnitType) => Promise<UnitInfoProps | undefined>;
    onMouseOutShippingCluster?: (overlaped: Overlaped[]) => void;
};
interface UnitInfoProps extends MapUnitType {
    num_total: number;
    num_unitarrived: number;
    num_claimed: number;
    num_out_for_delivery: number;
    num_out_return_unit_available: number;
    num_out_delivery_completed: number;
    num_unit_returned: 0;
    index?: number;
}
interface SectorInfoProps extends MapSectorType {
    count_total?: number;
    count_shipping?: number;
    count_return?: number;
    metric?: MetricType;
    name?: string;
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
declare type MetricType = "sector" | "shipping";
declare type MapSectorType = {
    area: string;
    code: string;
};
declare type MapShippingType = {
    address?: {
        lat: string;
        lng: string;
        address1: string;
        sector?: MapSectorType;
    };
    uuid: string;
    tracking_number: string;
    complete: boolean;
    is_return: boolean;
    designated_sector?: {
        area: string;
        code: string;
    };
    shipping_container?: {
        uuid: string;
    };
};

declare global {
    interface Window {
        naver: any;
        mouseOut: boolean;
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
