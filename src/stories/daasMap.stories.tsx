import React from "react";
import { Story } from "@storybook/react";
import DaasMap from "../components/daasMap/DaasMap";
import { within, userEvent } from "@storybook/testing-library";
import { DaasMapProps } from "../components/daasMap/daasMap.type";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
  title: "DaasMap",
  component: DaasMap,
};

const Template: Story<DaasMapProps> = (args) => (
  <DaasMap {...args} children={<div />} />
);

export const Primary = Template.bind({});
Primary.args = {
    isContainerVisible: true,
    isDeliveryVisible: true,
    isVisibleMarkers: true,
    compassSupported: true,
    currentPosition: {
        timestamp: 1653578577436,
        coords: {
            latitude: 47.9030724,
            longitude: 106.9331049,
            accuracy: 17.349,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: 0
        }
    },
  deliveries: [
    {
      address: {
        lat: "37.50843400",
        lng: "127.09302600",
      },
      complete: false,
      return_count: 0,
      shipping_count: 1,
      uuid: "8c115691-4fe0-44fb-9297-955046caf67b",
    },
  ],
    containers: [{
        unit_location: {
            lat: "34.61843400",
            lng: "128.09302600",
        },
        uuid: "8c115691-4fe0-44fb-9297-955046caf611",
        status: "CLAIMED",
        container_class: "WHITE",
    }],
    children: <div/>,
    onClickDelivery: ()=>{},
    onClickContainer: ()=>{},
    onClickMap: ()=>{},
    onClickOverlappedContainer: ()=>{}
};
