import React from 'react';
import { Call } from '@storybook/instrumenter';
export interface StatusBadgeProps {
    status: Call['status'];
}
export declare const StatusBadge: React.FC<StatusBadgeProps>;
