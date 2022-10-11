import * as React from 'react';
import { Call, CallStates, ControlStates } from '@storybook/instrumenter';
export interface Controls {
    start: (args: any) => void;
    back: (args: any) => void;
    goto: (args: any) => void;
    next: (args: any) => void;
    end: (args: any) => void;
    rerun: (args: any) => void;
}
interface AddonPanelProps {
    active: boolean;
}
interface InteractionsPanelProps {
    active: boolean;
    controls: Controls;
    controlStates: ControlStates;
    interactions: (Call & {
        status?: CallStates;
    })[];
    fileName?: string;
    hasException?: boolean;
    isPlaying?: boolean;
    calls: Map<string, any>;
    endRef?: React.Ref<HTMLDivElement>;
    onScrollToEnd?: () => void;
    isRerunAnimating: boolean;
    setIsRerunAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const AddonPanelPure: React.FC<InteractionsPanelProps>;
export declare const Panel: React.FC<AddonPanelProps>;
export {};
