import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Express } from 'express'; // Necesario para tener el tipo correcto del archivo

@Controller('upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { message: 'No se recibió ningún archivo' };
        }

        try {
            const manipulatedFile = await this.fileUploadService.manipulateFile(file);

            const filePath = await this.fileUploadService.saveFile(manipulatedFile);

            const fileUrl = this.fileUploadService.getFileUrl(filePath);

            return {
                message: 'Archivo subido exitosamente',
                fileUrl,
            };
        } catch (error) {
            return { message: 'Error al subir el archivo', error: error.message };
        }
    }
}
