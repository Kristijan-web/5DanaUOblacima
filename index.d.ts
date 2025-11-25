import { StudentType } from "../models/studentModel";

declare global {
  namespace Express {
    export interface Request {
      student?: StudentType;
    }
  }
}
