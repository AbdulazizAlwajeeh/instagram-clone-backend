import { HttpException, HttpStatus } from '@nestjs/common';

export enum AuthErrorCode {
    invalid_credentials = 'invalid_credentials',
    username_exists = 'username_exists',
    email_exists = 'email_exists',
}

export class AuthException extends HttpException {
    constructor(
        public readonly errorCode: string,
        message?: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
    ) {
        super(
            {
                message,
                errorCode,
            },
            status,
        );
    }
}
