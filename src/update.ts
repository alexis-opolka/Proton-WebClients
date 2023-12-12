import log from "electron-log";
import { updateElectronApp } from "update-electron-app";
import { z } from "zod";
import { getPlatform } from "./utils/helpers";

const baseURL = `https://proton.me/download/mail/${getPlatform()}`;
const jsonVersion = `${baseURL}/version.json`;

const versionJSOn = z.object({
    early: z.object({
        Version: z.string(),
        RolloutProportion: z.number(),
    }),
});

export const checkForUpdates = () => {
    log.info("checkForUpdates");

    updateElectronApp({
        repo: "flavienbonvin/test-desktop",
        updateInterval: "5 minutes",
        logger: log,
    });
};
