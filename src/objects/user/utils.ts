// Import types
import type { UserType } from "./types";

export class UserUtils {
  /**
   * Use to get full name of a user by his/her first name and full name
   * @param user
   * @returns
   */
  static getFullName(user: UserType | null) {
    if (!user) return "App user";
    return user.firstName.trim() + " " + user.lastName.trim();
  }
}
