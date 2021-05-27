import { timeStamp } from "console";
import { stat } from "fs";
import { Account, SessionToken, TokenGenerator, TokenRights, TokenState } from "../Server/Model";
import { AccessRight } from "../Shared/Model";
import { SessionTokenDbAccess } from "./SessionTokenDbAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";



export class Authorizer implements TokenGenerator {

    private userCreateDbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    private sessionTokenDbAccess: SessionTokenDbAccess = new SessionTokenDbAccess();

    async generateToken(account: Account): Promise<SessionToken | undefined> {
        const resultAccount = await this.userCreateDbAccess.getUserCredential(account.username, account.password);

        if (resultAccount) {
            const token: SessionToken = {
                username: resultAccount.username,
                accessRights: resultAccount.accessRights,
                expirationTime: this.generateExpirationTime(),
                tokenId: this.generateRandomTokenId(),
                valid: true
            }

            await this.sessionTokenDbAccess.storeSessionToken(token);

            return token;
        }
        else {
            return undefined;
        }
    }

    public async validateToken(tokenId: string): Promise<TokenRights>{
        const token = await this.sessionTokenDbAccess.getToken(tokenId);
        if(!token || !token.valid)
            return {
                accessRights: [],
                state: TokenState.INVALID
            }
        else if(token.expirationTime < new Date())
            return {
                accessRights: [],
                state: TokenState.EXPIRED
            }
        
        return {
            accessRights: token.accessRights,
            state: TokenState.VALID
        }
    }

    private generateExpirationTime(): Date {
        return new Date(Date.now() + 60 * 60 * 1000);
    }

    private generateRandomTokenId(){
        return Math.random().toString(36).slice(2);
    }
}
