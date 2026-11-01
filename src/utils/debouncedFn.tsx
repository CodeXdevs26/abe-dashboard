import { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";

const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedFn = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedValue(val);
      }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedFn(value);

    return () => {
      debouncedFn.cancel();
    };
  }, [value, debouncedFn]);

  return debouncedValue;
};

export default useDebounce;