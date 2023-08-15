import { File } from "./File";
import { Link } from "./Link";
import { User } from "./User";
// if isPrivate is true, then users will be populated, otherwise link will be populated
export type Transfer = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  files?: File[];
  users?: User[];
  link?: Link;
  isPrivate: boolean;
};
