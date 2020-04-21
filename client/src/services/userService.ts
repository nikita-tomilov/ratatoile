import { AppRole, getUserRole } from "../api/user";

class UserServiceClass {
  isAdmin: boolean | null = null;

  public hasAdminRole = (): Promise<boolean> => {
    return !this.isAdmin
      ? this.getUserRoles().then((roles) => {
          const isAdmin = roles.find((role) => role === AppRole.ADMIN) !== null;
          this.isAdmin = isAdmin;
          return isAdmin;
        })
      : Promise.resolve(this.isAdmin);
  };

  private getUserRoles = (): Promise<AppRole[]> => {
    return getUserRole().then((data) => data.roles);
  };
}

const userServiceClassInstance: UserServiceClass = new UserServiceClass();

export const getUserService = () => {
  return userServiceClassInstance;
};
