import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../../.env' });

export const typeOrmAsyncConfig : TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory :async () : Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadEntities: true,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            synchronize: false,
            logging: false,
        };
    },
}


export const typeOrmConfig : DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    logging: true,
}