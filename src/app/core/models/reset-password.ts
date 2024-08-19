export class ResetPassword {
    userId: string;
    password: string;
    recoveryKey: string;

    constructor(userId: string, password: string, recoveryKey: string) {
        this.userId = userId;
        this.password = password;
        this.recoveryKey = recoveryKey;
    }
}
