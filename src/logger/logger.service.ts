import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { DynamoDBTransport } from './dynamodb.transport';
import { LogKey } from './enums';


@Injectable()
export class LoggerService {

  private logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new DynamoDBTransport({
          region: process.env.AWS_REGION,
          tableName: process.env.LOG_TABLE_NAME,
        }),
      ]
    });
  }

  info(key: LogKey, messageObject) {
    this.logger.log({ level: 'info', message: { key, ...messageObject } });
  }

  warn(key: LogKey, messageObject) {
    this.logger.log({ level: 'warn', message: { key, ...messageObject } });
  }

  error(key: LogKey, messageObject) {
    this.logger.log({ level: 'error', message: { key, ...messageObject } });
  }
}
