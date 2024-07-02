/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Measures unique successful or failed downloads and number of retries
 */
export interface HttpsProtonMeDriveDownloadSuccessRateTotalV1SchemaJson {
  Labels: {
    status: "success" | "failure";
    retry: "true" | "false";
    shareType: "own" | "device" | "photo" | "shared" | "shared_public";
  };
  Value: number;
}
