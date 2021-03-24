import * as aws from 'aws-sdk';
import * as Transport  from 'winston-transport';
import * as uuid from 'uuid';
import * as moment from 'moment';

interface Options extends Transport.TransportStreamOptions {
  region: string;
  tableName: string;
}

// ref: https://github.com/winstonjs/winston#adding-custom-transports
export class DynamoDBTransport extends Transport {

  private ddb;
  private tableName: string;

  constructor(opts: Options) {
    super(opts);
    aws.config.update({ region: opts.region });
    this.ddb = new aws.DynamoDB({ apiVersion: '2012-08-10' });
    this.tableName = opts.tableName;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    const params = {
      TableName: this.tableName,
      Item: {
        id: { S: uuid.v4() },
        timestamp: { S: moment().format() },
        level: { S: info.level },
        message: { S: JSON.stringify(info.message) },
      }
    };
    this.ddb.putItem(params, (err, data) => err && console.log('dynamodb put object error: ', err, data));
    callback();
  }
}
