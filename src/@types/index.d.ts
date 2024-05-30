import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { EqualityFn } from 'react-redux/es/types';
import {
    Dispatch,
} from 'redux';

import { RootState, AppDispatch } from '../store';

// For useSelector, it saves us the need to type (state: RootState) every time.
// export const useAppSelector: 

// declare useSelector: TypedUseSelectorHook<RootState> = useSelector;
declare module "react-redux" {
    function useSelector<TState = RootState, Selected = RootState>(selector: (state: TState) => Selected, equalityFn?: EqualityFn<Selected> | undefined): Selected;
    function useDispatch<TDispatch = AppDispatch>(): TDispatch;
}
