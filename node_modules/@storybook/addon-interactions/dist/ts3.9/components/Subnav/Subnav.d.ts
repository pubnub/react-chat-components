import React from 'react';
import { Call, ControlStates } from '@storybook/instrumenter';
import { Controls } from '../../Panel';
export interface SubnavProps {
    controls: Controls;
    controlStates: ControlStates;
    status: Call['status'];
    storyFileName?: string;
    onScrollToEnd?: () => void;
    isRerunAnimating: boolean;
    setIsRerunAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const StyledIconButton: import("@storybook/theming").StyledComponent<any, Pick<any, string | number | symbol>, import("@storybook/theming").Theme>;
export declare const Subnav: React.FC<SubnavProps>;
