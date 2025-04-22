import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadModule } from './Modules/FileUpload/file-upload.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: '/files', 
    }),
    FileUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
