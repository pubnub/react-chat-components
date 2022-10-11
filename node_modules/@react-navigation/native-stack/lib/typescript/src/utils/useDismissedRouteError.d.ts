import type { ParamListBase, StackNavigationState } from '@react-navigation/native';
import * as React from 'react';
export default function useInvalidPreventRemoveError(state: StackNavigationState<ParamListBase>): {
    setNextDismissedKey: React.Dispatch<React.SetStateAction<string | null>>;
};
