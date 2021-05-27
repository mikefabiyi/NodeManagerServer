import { timeStamp } from "console";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
import { UserDBAccess } from "../User/UsersDBAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { Handler } from "./Model";
import { Utils } from "./Utils";

export class UserHandler extends BaseRequestHandler {

    private userDbAccess: UserDBAccess = new UserDBAccess();
    private tokenValidator: Authorizer;

    constructor(req: IncomingMessage, res: ServerResponse, authorizer: Authorizer) {
        super(req, res);
        this.tokenValidator = authorizer;
    }

    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            case HTTP_METHODS.PUT:
                await this.handlePut();
                break;
            case HTTP_METHODS.DELETE:
                await this.handleDelete();
                break;
            default:
                this.handleNotFound();
        }
    }

    async handlePut(): Promise<void> {
        const operationAuthoized = await this.operationAuthoized(AccessRight.CREATE);
        if (operationAuthoized) {
            try {
                const user: User = await this.getRequestBody();
                await this.userDbAccess.putUser(user);
                this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`);
            }
            catch (error) {
                this.respondUnauthorized(error.message);
            }
        }
        else {
            this.respondUnauthorized('missing or invalid authentication');
        }
    }

    async handleGet(): Promise<void> {
        const operationAuthoized = await this.operationAuthoized(AccessRight.READ);

        if (operationAuthoized) {
            const parsedUrl = Utils.getUrlParameters(this.req.url);
            if (parsedUrl) {
                if (parsedUrl.query.id) {
                    const user = await this.userDbAccess.getUserById(parsedUrl.query.id as string);
                    if (user) {
                        this.respondObject(HTTP_CODES.OK, user);
                    }
                    else {
                        this.handleNotFound();
                    }
                }
                else if (parsedUrl.query.name) {
                    const users = await this.userDbAccess.getUsersByName(parsedUrl.query.name as string);
                    this.respondObject(HTTP_CODES.OK, users);
                }
                else {
                    this.respondBadRequest('userId or name not present in request');
                }
            }
        }
        else {
            this.respondUnauthorized('missing or invalid authentication');
        }
    }

    async handleDelete(): Promise<void> {
        const operationAuthoized = await this.operationAuthoized(AccessRight.READ);

        if (operationAuthoized) {
            const parsedUrl = Utils.getUrlParameters(this.req.url);
            if (parsedUrl) {
                if (parsedUrl.query.id) {
                    const deleteResult = await this.userDbAccess.deleteUser(parsedUrl.query.id as string);
                    if (deleteResult) {
                        this.respondText(HTTP_CODES.OK, `user ${parsedUrl.query.id} deleted`);
                    }
                    else {
                        this.respondText(HTTP_CODES.NOT_FOUND, `user ${parsedUrl.query.id} was not deleted`);
                    }
                }
                else{
                    this.respondBadRequest('missing id in request');
                }
            }
        }
        else {
            this.respondUnauthorized('missing or invalid authentication');
        }
    }

    public async operationAuthoized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.req.headers.authorization;
        if (tokenId) {
            const tokenights = await this.tokenValidator.validateToken(tokenId);
            if (tokenights.accessRights.includes(operation)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }

    }
}