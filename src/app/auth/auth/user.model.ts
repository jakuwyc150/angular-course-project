export class UserModel {
  constructor(private rawToken: string, private tokenExpirationDate: Date, public email: string, public id: string) {}

  get token() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }

    return this.rawToken;
  }
}