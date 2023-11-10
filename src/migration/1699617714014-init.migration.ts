import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1699617714014 implements MigrationInterface {
  name = 'init1699617714014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`wallet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`balance\` float NOT NULL DEFAULT '0', \`currency\` varchar(255) NOT NULL DEFAULT 'NGN', \`userId\` int NOT NULL, UNIQUE INDEX \`REL_35472b1fe48b6330cd34970956\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`title\` varchar(255) NOT NULL, \`ticketDate\` timestamp NOT NULL, \`departure\` varchar(255) NOT NULL, \`arrival\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`price\` float NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` int NOT NULL, \`currency\` varchar(255) NOT NULL DEFAULT 'NGN', \`amount\` float NOT NULL, \`status\` enum ('pending', 'successful', 'cancelled', 'failed') NOT NULL, \`operation\` enum ('credit', 'debit') NOT NULL, \`type\` enum ('deposit', 'ticket_purchase', 'transfer') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`wallet\` ADD CONSTRAINT \`FK_35472b1fe48b6330cd349709564\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0e01a7c92f008418bad6bad5919\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0e01a7c92f008418bad6bad5919\``);
    await queryRunner.query(`ALTER TABLE \`wallet\` DROP FOREIGN KEY \`FK_35472b1fe48b6330cd349709564\``);
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`ticket\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP INDEX \`REL_35472b1fe48b6330cd34970956\` ON \`wallet\``);
    await queryRunner.query(`DROP TABLE \`wallet\``);
  }
}
