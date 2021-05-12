import { UserCredentialsDBAccess } from "../Authorization/UserCredentialsDBAccess";


class DbTest {
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
}

new DbTest().dbAccess.putUserCredential({
    username: 'user1',
    password: 'password1',
    accessRights: [1, 2, 3]
});