import { UserType } from "../../Models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserType | null;
    }
  }
}
