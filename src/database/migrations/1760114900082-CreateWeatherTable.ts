import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWeatherTable1760114900082 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await queryRunner.query(`
      CREATE TABLE "weather" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

        "city" VARCHAR(100) NOT NULL,
        "country" VARCHAR(100) NOT NULL,

        "weather_main" VARCHAR(50) NOT NULL,
        "weather_description" VARCHAR(50) NOT NULL,

        "longitude" NUMERIC(5, 2) NOT NULL,
        "latitude" NUMERIC(5, 2) NOT NULL,

        "temperature" FLOAT NOT NULL,
        "thermal_sensation" FLOAT NOT NULL,

        "humidity" INT NULL,

        "measured_at" TIMESTAMP NULL,
        "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_weather_city_country"
      ON "weather" ("city", "country");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "weather" CASCADE;`);
  }
}
