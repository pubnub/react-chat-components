import * as React from 'react';
declare type Render = (children: React.ReactNode) => JSX.Element;
export default function useComponent(render: Render): ({ children }: {
    children: React.ReactNode;
}) => JSX.Element;
export {};
