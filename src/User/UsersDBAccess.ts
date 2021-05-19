import * as Nedb from 'nedb';
import { User } from '../Shared/Model';

export class UserDBAccess{

    private nedb: Nedb;

    /**
     *
     */
    constructor() {
        this.nedb = new Nedb('database/Users.db');
        this.nedb.loadDatabase();
    }

    public async putUser(user: User): Promise<User | void>{
        return new Promise((resolve, reject)=>{
            this.nedb.insert(user, (err: Error | null) => {
                if(err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    public async getUserById(id: string): Promise<User | undefined>{
        return new Promise((resolve, reject) =>{
            this.nedb.find({id: id}, (err: Error, docs: any[])=>{
                if(err)
                    reject(err);
                else
                    resolve(docs.length === 0 ? undefined : docs[0]);
            });
        });
    }
}