import { Transfer } from "./Transfer";

export type Link = {
  id: number;
  token: string;
  startDate: string;
  endDate: string;
  transfer: Transfer;
  createdAt: string;
  updatedAt: string;
};
