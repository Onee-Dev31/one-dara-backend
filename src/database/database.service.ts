import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as sql from 'mssql';

function parseConnectionUrl(url: string): sql.config {
  // Format: sqlserver://HOST:PORT;database=DB;user=USER;password=PASS;key=val;...
  const withoutProtocol = url.replace(/^sqlserver:\/\//, '');
  const parts = withoutProtocol.split(';');

  const [server, portStr] = parts[0].split(':');
  const port = parseInt(portStr || '1433');

  const params: Record<string, string> = {};
  for (const part of parts.slice(1)) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.substring(0, eqIdx).toLowerCase();
    const value = part.substring(eqIdx + 1);
    params[key] = value;
  }

  return {
    server,
    port,
    database: params['database'],
    user: params['user'],
    password: params['password'],
    options: {
      encrypt: params['encrypt'] === 'true',
      trustServerCertificate: params['trustservercertificate'] === 'true',
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: sql.ConnectionPool;
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    const config = parseConnectionUrl(process.env.DATABASE_URL || '');
    this.pool = await new sql.ConnectionPool(config).connect();
    this.logger.log(`Database connected → ${config.server}:${config.port}/${config.database}`);
  }

  async onModuleDestroy() {
    await this.pool?.close();
    this.logger.log('Database disconnected');
  }

  async execute<T = any>(spName: string, params?: Record<string, any>): Promise<T[]> {
    const request = this.pool.request();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          request.input(key, value);
        }
      }
    }
    const result = await request.execute(spName);
    return result.recordset as T[];
  }

  async executeFirst<T = any>(spName: string, params?: Record<string, any>): Promise<T | null> {
    const rows = await this.execute<T>(spName, params);
    return rows[0] ?? null;
  }
}
