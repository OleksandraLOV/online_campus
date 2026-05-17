import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { toId } from '../../common/utils/to-id.util';

type FileLike = {
  _id?: unknown;
  id?: unknown;
};

export class FileDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }: { obj: FileLike }) => toId(obj._id ?? obj.id))
  id: string;

  @ApiProperty()
  @Expose()
  originalName: string;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  size: number;
}
