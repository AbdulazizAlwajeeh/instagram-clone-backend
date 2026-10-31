import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: '[DB_HOST]',
    port: 5432,
    username: '[USERNAME]',
    password: '[PASSWORD]',
    database: '[DB_NAME]',
    entities: ['THE/PATH/WHERE/SCHEMA/GOT/STORED'],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
