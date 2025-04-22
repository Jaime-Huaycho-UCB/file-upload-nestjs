import { Controller, Post, UseInterceptors, UploadedFile, Delete, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Express, Response } from 'express'; 

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

    @Delete(':filename')
    async deleteFile(@Param('filename') filename: string,@Res() res: Response) {
        try {
            await this.fileUploadService.deleteFile(filename);
            return res.status(200).json({
                code: 200,
                message: 'El archivo se elimino exitosamente'
            });
        } catch (error) {
            return res.status(error.getStatus()).json({
                code: error.getStatus(),
                message: error.getResponse()
            })
        }
    }
}
