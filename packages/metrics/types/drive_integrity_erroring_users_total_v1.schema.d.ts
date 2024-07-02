/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Measures how many users experienced decryption or verification error in the past 10 minutes
 */
export interface HttpsProtonMeDriveIntegrityErroringUsersTotalV1SchemaJson {
  Labels: {
    plan: "free" | "paid";
    shareType: "own" | "device" | "photo" | "shared" | "shared_public";
  };
  Value: number;
}
