import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";

export const typeOrmAsyncConfig : TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory :async () : Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
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
    host: "localhost",//process.env.DB_HOST,
    port: 5432,//parseInt(process.env.DB_PORT),
    username: "postgres",//process.env.DB_USER,
    password: "postgres",//process.env.DB_PASSWORD,
    database: "promotion_app",//process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    logging: true,
}