import 'multer';
import { Injectable, BadRequestException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { File, FileDocument } from './file.schema';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async saveFile(file: Express.Multer.File, userId: string) {
    try {
      const correctOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

      const fileExtension = correctOriginalName.split('.').pop();
      const safeFileName = `${uuidv4()}.${fileExtension}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const filePath = path.join(uploadPath, safeFileName);
      fs.writeFileSync(filePath, file.buffer);

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
        fileLink: `/uploads/${safeFileName}`,
      };
    } catch (error) {
      throw new BadRequestException('Помилка при збереженні файлу');
    }
  }
  async getFileById(fileId: string) {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new BadRequestException('Файл не знайдено');
    }
    return file;
  }
  async deleteFile(fileId: string) {
  const file = await this.fileModel.findById(fileId);
  if (!file) {
    throw new NotFoundException('Файл не знайдено');
  }

  const filePath = path.join(__dirname, '..', '..', 'uploads', file.storagePath);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await this.fileModel.findByIdAndDelete(fileId);
    return { message: 'Файл видалено' };
  } catch (error) {
    throw new BadRequestException('Помилка при видаленні файлу');
  }
  }
}