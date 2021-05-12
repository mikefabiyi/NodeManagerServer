import { Account } from '../Server/Model';

export enum AccessRight {
    CREATE = 1,
    READ,
    UPDATE,
    DELETE
}

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export interface UserCredentials extends Account {
    accessRights: AccessRight[];
}
