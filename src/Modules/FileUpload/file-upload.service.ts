import { HttpException, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { writeFile } from 'fs/promises';
import { extname } from 'path';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

@Injectable()
export class FileUploadService {

    private readonly uploadDir = './uploads/';

    async manipulateFile(file: Express.Multer.File): Promise<Express.Multer.File> {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = extname(file.originalname);
        const newFileName = `file-${uniqueSuffix}${extension}`;

        return {
            ...file,
            filename: newFileName,
        };
    }

    async saveFile(file: Express.Multer.File) {
        const manipulatedFile = await this.manipulateFile(file);
        const filePath = join(this.uploadDir,manipulatedFile.filename);

        try {
            await writeFile(filePath, manipulatedFile.buffer);
            return manipulatedFile.filename;
        } catch (error) {
            throw new Error('Error al guardar el archivo: ' + error.message);
        }
    }

    getFileUrl(filePath: string): string {
        const fileName = filePath.split('/').pop();
        return `${fileName}`;
    }


    async deleteFile(filename: string) {
        const filePath = join(this.uploadDir,filename);

        if (!existsSync(filePath)) {
            throw new HttpException(`El archivo ${filename} no existe`,404);
        }

        try {
            unlinkSync(filePath);
            return true;
        } catch (error) {
            throw new HttpException('No se pudo eliminar el archivo',500);
        }
    }
}
