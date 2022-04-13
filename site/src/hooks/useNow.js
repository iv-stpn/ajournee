import { $dayjs } from "@/utils/calendarUtils";
import React from "react";

export function useNow(enabled) {
    const [now, setNow] = React.useState($dayjs());

    React.useEffect(() => {
        if (!enabled) {
            return () => {};
        }
        const pid = setInterval(() => setNow($dayjs()), 60 * 1000);
        return () => clearInterval(pid);
    }, [enabled]);

    return {
        now,
    };
}
