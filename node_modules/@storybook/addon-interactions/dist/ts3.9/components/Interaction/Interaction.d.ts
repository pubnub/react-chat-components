/// <reference types="react" />
import { Call, ControlStates } from '@storybook/instrumenter';
import { Controls } from '../../Panel';
export declare const Interaction: ({ call, callsById, controls, controlStates, }: {
    call: Call;
    callsById: Map<Call['id'], Call>;
    controls: Controls;
    controlStates: ControlStates;
}) => JSX.Element;
