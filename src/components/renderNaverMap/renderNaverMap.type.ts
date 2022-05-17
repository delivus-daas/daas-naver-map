import { ReactNode } from "react";

export type Overlaped = { index: number };

export interface RenderNaverMapProps extends LoadScriptType {
  loading?: JSX.Element;
  error?: JSX.Element;
  clientId: string;
  ncpClientId: string;
  submodules?: [string];
  children: JSX.Element;
}

export type LoadScriptType = {
  clientId: string;
  ncpClientId: string;
  submodules?: [string];
};
