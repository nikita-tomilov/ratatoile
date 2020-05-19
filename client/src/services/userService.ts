import { AppRole, getUserRole } from "../api/user";

class UserServiceClass {
  isAdmin: boolean | null = null;
  username: string | null = null;

  public hasAdminRole = (): Promise<boolean> => {
    return this.isAdmin === null
      ? this.getUserRoles().then((roles) => {
          this.isAdmin = false;

          if (roles) {
            const adminRole = roles.find((role) => role === AppRole.ADMIN);
            this.isAdmin = adminRole != null;
          }

          return this.isAdmin;
        })
      : Promise.resolve(this.isAdmin);
  };

  public cleanData = () => {
    this.username = null;
    this.isAdmin = null;
  };

  private getUserRoles = (): Promise<AppRole[]> => {
    return getUserRole().then((data) => {
      this.username = data.username;
      return data.roles;
    });
  };
}

const userServiceClassInstance: UserServiceClass = new UserServiceClass();

export const getUserService = () => {
  return userServiceClassInstance;
};
