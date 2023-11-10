import { Connection, createConnection } from 'typeorm';
import dbConnection from '../databases';

export class DatabaseManager {
  private static connection: Connection;

  public static async connect(): Promise<Connection> {
    try {
      if (!this.connection) {
        const connection = await createConnection(dbConnection);
        this.connection = connection;
        return connection;
      }

      return this.connection;
    } catch (error) {
      console.error('Error while connecting to the database', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      console.log('Database disconnected');
      this.connection = undefined;
    }
  }

  public static getConnection(): Connection | undefined {
    return this.connection;
  }
}

export default DatabaseManager;
