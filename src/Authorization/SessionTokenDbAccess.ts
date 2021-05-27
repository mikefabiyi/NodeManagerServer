import * as Nedb from "nedb";
import { resolve } from "path";
import { SessionToken } from "../Server/Model";


export class SessionTokenDbAccess {
    private nedb: Nedb;

    /**
     *
     */
    constructor() {
        this.nedb = new Nedb('database/SessionToken.db');
        this.nedb.loadDatabase();

    }

    public async storeSessionToken(token: SessionToken): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(token, (err: Error | null) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    public async getToken(tokenId: string): Promise<SessionToken | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ tokenId: tokenId, valid: true }, (err: Error, docs: SessionToken[]) => {
                if (err)
                    reject(err);
                else
                    resolve(docs.length == 0 ? undefined : docs[0]);
            });
        });
    }
}