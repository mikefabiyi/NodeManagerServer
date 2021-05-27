import * as Nedb from 'nedb';
import { User } from '../Shared/Model';

export class UserDBAccess {

    private nedb: Nedb;

    /**
     *
     */
    constructor() {
        this.nedb = new Nedb('database/Users.db');
        this.nedb.loadDatabase();
    }

    public async putUser(user: User): Promise<User | void> {
        if (!user.id) {
            user.id = this.generateUserId();
        }
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, (err: Error | null) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    public async getUserById(id: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ id: id }, (err: Error, docs: any[]) => {
                if (err)
                    reject(err);
                else
                    resolve(docs.length === 0 ? undefined : docs[0]);
            });
        });
    }

    public async getUsersByName(name: string): Promise<User[]> {
        const regEx = new RegExp(name);
        return new Promise((resolve, reject) => {
            this.nedb.find({ name: regEx }, (err: Error, docs: any[]) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            });
        });
    }

    public async deleteUser(userId: string): Promise<boolean>{
        const operationSuccess = await this.deleteUserFromDb(userId);
        this.nedb.loadDatabase();

        return operationSuccess;
    }

    private async deleteUserFromDb(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.nedb.remove({ id: userId }, (err: Error | null, numRemoved: number) => {
                if (err)
                    reject(err);
                else {
                    if (numRemoved == 0)
                        resolve(false);
                    else
                        resolve(true);
                }
            });
        });
    }

    private generateUserId() {
        return Math.random().toString(36).slice(2);
    }
}