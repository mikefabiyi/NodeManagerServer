import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { UserDBAccess } from "../User/UsersDBAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Handler } from "./Model";
import { Utils } from "./Utils";

export class UserHandler extends BaseRequestHandler {

    private userDbAccess: UserDBAccess = new UserDBAccess();

    constructor(req: IncomingMessage, res: ServerResponse) {
        super(req, res);
    }

    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            case HTTP_METHODS.POST:
                await this.handlePost();
                break;
            default:
                this.handleNotFound();
        }
    }

    async handlePost(): Promise<void> {

    }

    async handleGet(): Promise<void> {
        const parsedUrl = Utils.getUrlParameters(this.req.url);
        if (parsedUrl) {
            const id: string = parsedUrl.query.id as string;
            if (id) {
                const user = await this.userDbAccess.getUserById(id);
                if(user){
                    this.res.statusCode = HTTP_CODES.OK;
                    this.res.writeHead(HTTP_CODES.OK, {'Content-Type': 'application/json'});
                    this.res.write(JSON.stringify(user));
                }
                else{
                   this.handleNotFound();
                }
            }
        }
    }
}