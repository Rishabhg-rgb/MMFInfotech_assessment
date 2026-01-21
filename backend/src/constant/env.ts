export default class Env {
  // ENV
  static NODE_ENV = process.env.NODE_ENV;
  static DATABASE_URL = process.env.DATABASE_URL;

  // SERVER INFO
  static SERVER_IP = process.env.SERVER_IP;
  static SERVER_PORT = process.env.SERVER_PORT;
  static SERVER_URL = process.env.SERVER_URL;
  static PREFIX_TERM = process.env.PREFIX_TERM ?? '';

  // JWT
  static JWT_SECRET = process.env.JWT_SECRET;
  static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  static JWT_ISSUER_NAME = process.env.JWT_ISSUER_NAME;

  // CORS ORIGN
  static CORS_ORIGIN = process.env.CORS_ORIGIN;

  // Helper Methods
  static isExist(value: string | undefined | number | string[]): boolean {
    return value === null || value === undefined || value === '' ? false : true;
  }

  static validateEnv() {
    if (!Env.isExist(Env.NODE_ENV)) return 'Node ENV is mandatory';
    if (!Env.isExist(Env.DATABASE_URL)) return 'Database URL is mandatory';
    if (!Env.isExist(Env.SERVER_PORT)) return 'Server Port is mandatory';
    if (!Env.isExist(Env.JWT_SECRET)) return 'JWT Secret is mandatory';
    if (!Env.isExist(Env.JWT_EXPIRES_IN)) return 'JWT Expire Time is mandatory';
    if (!Env.isExist(Env.JWT_ISSUER_NAME)) return 'JWT Issuer Name is mandatory';
    if (!Env.isExist(Env.CORS_ORIGIN)) return 'CORS Origin is mandatory';

    return null;
  }
}