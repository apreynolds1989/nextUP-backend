import { Database } from './Database';
import { FileDatabase } from './FileDatabase';

export * from './Database';
export * from './FileDatabase';
export * as Types from './types';

const database: Database = new FileDatabase('./src/dataFiles');
database.connect();
export const instance = database;
