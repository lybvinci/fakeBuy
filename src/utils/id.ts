import { customAlphabet } from "nanoid";

const orderRng = customAlphabet("0123456789", 4);
const idRng = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export function newOrderId(): string {
  const ts = Date.now().toString().slice(-10);
  return `FB${ts}${orderRng()}`;
}

export function newId(): string {
  return idRng();
}
