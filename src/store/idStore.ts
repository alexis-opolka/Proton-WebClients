import { createHash, randomUUID } from "crypto";
import log from "electron-log";
import Store from "electron-store";
import { z } from "zod";

const store = new Store();

const appIDSchema = z.object({
    id: z.string(),
    hash: z.string(),
    distribution: z.number(),
});

type AppID = z.infer<typeof appIDSchema>;

export const saveAppID = () => {
    if (!store.has("appID")) {
        generateAppID().then((appID) => {
            store.set("appID", appID);
        });
    }
};

export const generateAppID = async () => {
    const id = randomUUID();
    const hash = createHash("sha256").update(id).digest("hex");
    const distribution = parseInt(hash, 16) / Math.pow(2, 256);

    const appID: AppID = {
        id,
        hash,
        distribution,
    };

    log.info("AppID generated", appID);
    return appID;
};

export const getAppID = () => {
    const appID = store.get("appID");
    return appIDSchema.parse(appID);
};
