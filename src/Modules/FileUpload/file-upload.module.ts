import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [FileUploadController], // Declaramos el controlador
  providers: [FileUploadService], // Declaramos el servicio
})
export class FileUploadModule {}
