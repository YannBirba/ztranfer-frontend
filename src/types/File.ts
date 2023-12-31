import { Transfer } from "./Transfer";

export type File = {
  id: number;
  name: string;
  fileName: string;
  size: number;
  type: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
  transfer?: Transfer;
};
