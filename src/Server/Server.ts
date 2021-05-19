import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { HTTP_CODES } from '../Shared/Model';
import { LoginHandler } from './LoginHandler';
import { UserHandler } from './UserHandler';
import { Utils } from './Utils';

export class Server {

    private authorizer: Authorizer = new Authorizer();

    public createServer() {
        createServer(async (req: IncomingMessage, res: ServerResponse) => {
                console.log('got request from: ' + req.url);
                var basePath = Utils.getUrlBasePath(req.url);

                switch(basePath){
                    case 'login':
                        await new LoginHandler(req, res, this.authorizer).handleRequest();
                        break;
                    case 'users':
                        await new UserHandler(req, res).handleRequest();
                        break;
                    default:
                        res.statusCode = HTTP_CODES.NOT_FOUND;
                        res.write('Not Found');
                        break;
                }

                res.end();
            }
        ).listen(8080);
        console.log('server started');
    }
}