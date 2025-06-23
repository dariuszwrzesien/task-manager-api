import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseCodes } from '../enums/database-codes.enum';

const DEFAULT_CONFLICT_ERROR_MESSAGE = 'Conflict: unique constraint violation';
const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = 'An unexpected error occurred';

export interface RepositoryErrorMessage {
  conflict?: string;
}

export const repositoryErrorHandler = (
  error: any,
  message: RepositoryErrorMessage = {},
): HttpException => {
  if (error && typeof error === 'object' && 'code' in error) {
    const errorCode = (error as { code?: string }).code;
    if (errorCode === DatabaseCodes.UNIQUE_CONSTRAINT_VIOLATION) {
      return new ConflictException(
        message.conflict || DEFAULT_CONFLICT_ERROR_MESSAGE,
      );
    }
  }
  return new InternalServerErrorException(
    DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  );
};
