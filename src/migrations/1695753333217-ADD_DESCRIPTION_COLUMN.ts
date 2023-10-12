import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDDESCRIPTIONCOLUMN1695753333217 implements MigrationInterface {
  name = 'ADDDESCRIPTIONCOLUMN1695753333217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`chat\` DROP COLUMN \`description\``);
  }
}
