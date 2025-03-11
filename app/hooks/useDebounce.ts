import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        if (value.trim().length < 3)
            return;

        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler);

    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;