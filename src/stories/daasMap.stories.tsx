import React from "react";
import { Story } from "@storybook/react";
import DaasMap from "../components/daasMap/DaasMap";
import { within, userEvent } from '@storybook/testing-library';
import { DaasMapProps } from "../components/daasMap/daasMap.type";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
    title: "DaasMap",
    component: DaasMap,
};

const Template: Story<DaasMapProps> = (args) => (
    <DaasMap {...args}  children={<div/>}/>
);

export const Primary = Template.bind({});
Primary.args = {
    selectedDelivery: 1,
};
