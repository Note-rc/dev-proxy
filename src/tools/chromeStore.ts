import { Store } from "chrome-extension-core";

export type StorageInfo = {
  [key: string]: any;
};

export const defaultValue: StorageInfo = {};

const options = { scope: "dev-proxy" };

const chromeStore = new Store<StorageInfo>(
  chrome.storage.local,
  defaultValue,
  options
);

export default chromeStore;
