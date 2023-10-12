import { MigrationInterface, QueryRunner } from 'typeorm';

export class CREATEDATABASE1695150896888 implements MigrationInterface {
  name = 'CREATEDATABASE1695150896888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`password_hash\` varchar(500) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`text\` varchar(500) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`chatId\` varchar(36) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ownerId\` varchar(36) NULL, UNIQUE INDEX \`REL_ae88d8de23e69a0d57105a5bce\` (\`ownerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat_members_user\` (\`chatId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, INDEX \`IDX_cd7edbaccbb127f22fecd29674\` (\`chatId\`), INDEX \`IDX_c8c4e5bfdb28f12dc9a73dd3b5\` (\`userId\`), PRIMARY KEY (\`chatId\`, \`userId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_619bc7b78eba833d2044153bacc\` FOREIGN KEY (\`chatId\`) REFERENCES \`chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_446251f8ceb2132af01b68eb593\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_ae88d8de23e69a0d57105a5bce5\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_members_user\` ADD CONSTRAINT \`FK_cd7edbaccbb127f22fecd296743\` FOREIGN KEY (\`chatId\`) REFERENCES \`chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_members_user\` ADD CONSTRAINT \`FK_c8c4e5bfdb28f12dc9a73dd3b57\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_members_user\` DROP FOREIGN KEY \`FK_c8c4e5bfdb28f12dc9a73dd3b57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_members_user\` DROP FOREIGN KEY \`FK_cd7edbaccbb127f22fecd296743\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_ae88d8de23e69a0d57105a5bce5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_446251f8ceb2132af01b68eb593\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_619bc7b78eba833d2044153bacc\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c8c4e5bfdb28f12dc9a73dd3b5\` ON \`chat_members_user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cd7edbaccbb127f22fecd29674\` ON \`chat_members_user\``,
    );
    await queryRunner.query(`DROP TABLE \`chat_members_user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_ae88d8de23e69a0d57105a5bce\` ON \`chat\``,
    );
    await queryRunner.query(`DROP TABLE \`chat\``);
    await queryRunner.query(`DROP TABLE \`message\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
