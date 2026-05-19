import {Controller,Post,Delete,UseInterceptors,UploadedFile,ParseFilePipe,MaxFileSizeValidator,FileTypeValidator,UseGuards,Req,Get,Param,Res,NotFoundException,}from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';
import { ApiConsumes, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditInterceptor } from '../audit-log/audit.interceptor';
import { Role } from '../common/types/roles.enum';

interface AuthenticatedFileRequest {
  user: {
    sub: string;
    login: string;
    role: Role;
  };
}

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|msword|document|zip)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: AuthenticatedFileRequest,
  ) {
    return this.filesService.saveFile(file, req.user.sub);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const fileInfo = await this.filesService.getFileById(id);

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      fileInfo.storagePath,
    );

    const encodedFileName = encodeURIComponent(fileInfo.originalName);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFileName}`,
    );

    return res.sendFile(filePath, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(404).send('Файл фізично не знайдено на сервері');
        }
      }
    });
  }

  @Delete(':id')
  async removeFile(
    @Param('id') id: string,
    @Req() req: AuthenticatedFileRequest,
  ) {
    return this.filesService.deleteFile(id, req.user.sub, req.user.role);
  }
}
