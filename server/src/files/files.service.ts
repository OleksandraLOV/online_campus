import 'multer';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { File, FileDocument } from './file.schema';
import { Role } from '../common/types/roles.enum';

const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpeg',
  '.jpg',
  '.pdf',
  '.doc',
  '.docx',
  '.zip',
]);

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async saveFile(file: Express.Multer.File, userId: string) {
    try {
      const correctOriginalName = Buffer.from(
        file.originalname,
        'latin1',
      ).toString('utf8');

      const fileExtension = path.extname(correctOriginalName).toLowerCase();

      if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
        throw new BadRequestException('Недопустимий тип файлу');
      }

      const safeFileName = `${randomUUID()}${fileExtension}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads');

      await fs.promises.mkdir(uploadPath, { recursive: true });

      const filePath = path.join(uploadPath, safeFileName);
      await fs.promises.writeFile(filePath, file.buffer);

      const savedFile = await this.fileModel.create({
        originalName: correctOriginalName,
        storagePath: safeFileName,
        mimetype: file.mimetype,
        size: file.size,
        uploadedBy: new Types.ObjectId(userId),
      });

      return {
        message: 'Файл успішно завантажено',
        fileId: savedFile._id,
        fileLink: `/api/files/download/${savedFile._id.toString()}`,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Помилка при збереженні файлу');
    }
  }

  async getFileById(fileId: string) {
    if (!Types.ObjectId.isValid(fileId)) {
      throw new BadRequestException('Некоректний ID файлу');
    }

    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new NotFoundException('Файл не знайдено');
    }
    return file;
  }

  async deleteFile(fileId: string, userId: string, role: Role) {
    const file = await this.getFileById(fileId);

    if (role !== Role.ADMIN && file.uploadedBy.toString() !== userId) {
      throw new ForbiddenException('Немає прав для видалення цього файлу');
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      file.storagePath,
    );

    try {
      try {
        await fs.promises.unlink(filePath);
      } catch (error: unknown) {
        const code = (error as { code?: unknown }).code;
        if (code !== 'ENOENT') {
          throw error;
        }
      }

      await this.fileModel.findByIdAndDelete(fileId);
      return { message: 'Файл видалено' };
    } catch {
      throw new BadRequestException('Помилка при видаленні файлу');
    }
  }
}
