import { UserCredentialsDBAccess } from "../Authorization/UserCredentialsDBAccess";
import { WorkingPosition } from "../Shared/Model";
import { UserDBAccess } from "../User/UsersDBAccess";

class DbTest {
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    public userDbAccess: UserDBAccess = new UserDBAccess();
}

// new DbTest().dbAccess.putUserCredential({
//     username: 'user1',
//     password: 'password1',
//     accessRights: [1, 2, 3]
// });

new DbTest().userDbAccess.putUser({
    age: 10,
    email: 'mikelfab@yahoo.com',
    name: 'Michael Fabiyi',
    workingPosition: WorkingPosition.ENGINEER,
    id: '1'
});