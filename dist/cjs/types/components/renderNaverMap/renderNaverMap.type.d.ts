/// <reference types="react" />
export declare type Overlaped = {
    index: number;
};
export interface RenderNaverMapProps extends LoadScriptType {
    loading?: JSX.Element;
    error?: JSX.Element;
    clientId: string;
    ncpClientId: string;
    submodules?: [string];
    children: JSX.Element;
}
export declare type LoadScriptType = {
    clientId: string;
    ncpClientId: string;
    submodules?: [string];
};
