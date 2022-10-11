import * as React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
/**
 * Log pretty-printed shallow test component instance
 */
export default function debugShallow(instance: ReactTestInstance | React.ReactElement<any>, message?: string): void;
