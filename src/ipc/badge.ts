import { app } from "electron";
import log from "electron-log";

export const handleIPCBadge = (count: number) => {
    log.info("handleIPCBadge, update badge value", count);

    if (count) {
        app.setBadgeCount(count);
    } else {
        app.setBadgeCount(0);
    }
};
