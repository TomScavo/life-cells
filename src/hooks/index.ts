import { useRef } from 'react';

export const useGetRef = <T>(value: T) => {
    const valueRef = useRef(value);
    valueRef.current = value;

    return valueRef;
};
