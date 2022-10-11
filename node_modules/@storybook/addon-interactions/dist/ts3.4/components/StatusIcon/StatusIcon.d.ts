import React from 'react';
import { IconsProps } from '@storybook/components';
import { Call } from '@storybook/instrumenter';
export interface StatusIconProps extends IconsProps {
    status: Call['status'];
}
export declare const StatusIcon: React.FC<StatusIconProps>;
