import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User, UserDocument } from './schemas';
import { Role } from '../common/types/roles.enum';
import { UserDto } from './dto/user.dto';
import {
  transformToDto,
  transformToDtoArray,
  transformToPaginatedDto,
} from '../common/utils/transform.util';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedDto } from '../common/dto/paginated.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
  ) {}

  // =========================
  // Auth refresh sessions
  // =========================

  async addRefreshTokenHash(userId: string, tokenHash: string): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        {
          $addToSet: { refreshTokenHashes: tokenHash },
        },
      )
      .exec();
  }

  async removeRefreshTokenHash(
    userId: string,
    tokenHash: string,
  ): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $pull: { refreshTokenHashes: tokenHash } })
      .exec();
  }

  async removeAllRefreshTokenHashes(userId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $set: { refreshTokenHashes: [] } })
      .exec();
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.userModel.findOne({ login }).exec();
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: id }, { $set: { passwordHash } })
      .exec();
  }

  // =========================
  // Users management
  // =========================

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const {
      login,
      email,
      password,
      groupId,
      recordBookNumber,
      year,
      departmentId,
      position,
      ...rest
    } = createUserDto;

    const existingUser = await this.userModel
      .findOne({ $or: [{ login }, { email }] })
      .lean()
      .exec();

    if (existingUser) {
      throw new ConflictException(
        'Користувач з таким логіном або ел.адресою вже існує',
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const studentProfile =
      rest.role === Role.STUDENT && groupId && recordBookNumber && year
        ? { group: groupId, recordBookNumber, year }
        : undefined;

    const teacherProfile =
      rest.role === Role.TEACHER && departmentId && position
        ? { department: departmentId, position }
        : undefined;

    const newUser = new this.userModel({
      login,
      email,
      passwordHash,
      studentProfile,
      teacherProfile,
      ...rest,
    });

    const savedUser = await newUser.save();
    return transformToDto(UserDto, savedUser.toObject());
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const {
      login,
      email,
      password,
      groupId,
      recordBookNumber,
      year,
      departmentId,
      position,
      ...rest
    } = updateUserDto;

    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (login || email) {
      const duplicateUser = await this.userModel
        .findOne({
          $or: [...(login ? [{ login }] : []), ...(email ? [{ email }] : [])],
          _id: { $ne: id },
        })
        .lean()
        .exec();

      if (duplicateUser) {
        throw new ConflictException(
          'Користувач з таким логіном або email вже існує',
        );
      }
    }

    const updateData: Record<string, unknown> = { ...rest };

    if (login) updateData.login = login;
    if (email) updateData.email = email;

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    const currentRole = rest.role ?? existingUser.role;

    if (currentRole === Role.STUDENT) {
      updateData.studentProfile = {
        group: groupId ?? existingUser.studentProfile?.group,
        recordBookNumber:
          recordBookNumber ?? existingUser.studentProfile?.recordBookNumber,
        year: year !== undefined ? year : existingUser.studentProfile?.year,
      };
    } else if (currentRole === Role.TEACHER) {
      updateData.teacherProfile = {
        department: departmentId ?? existingUser.teacherProfile?.department,
        position: position ?? existingUser.teacherProfile?.position,
      };
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateData }, { returnDocument: 'after' })
      .lean()
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return transformToDto(UserDto, updatedUser);
  }

  async toggleBlock(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) throw new NotFoundException('Користувача не знайдено');

    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { status: newStatus } },
        { returnDocument: 'after' },
      )
      .lean()
      .exec();

    if (!updated) throw new NotFoundException('Користувача не знайдено');
    return transformToDto(UserDto, updated);
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userModel
      .findById(id)
      .select('-passwordHash')
      .populate('studentProfile.group')
      .populate({
        path: 'teacherProfile.department',
        populate: { path: 'faculty' },
      })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return transformToDto(UserDto, user);
  }

  async findAll(
    paginationDto: PaginationDto,
    role?: Role,
  ): Promise<PaginatedDto<UserDto>> {
    const { page, limit } = paginationDto;
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      lean: true,
    };
    const query = role ? { role } : {};
    const result = await this.userModel.paginate(query, options);
    return transformToPaginatedDto(UserDto, result);
  }

  async findByName(query: string): Promise<UserDto[]> {
    const q = new RegExp(query, 'i');
    const users = await this.userModel
      .find({ $or: [{ firstName: q }, { lastName: q }, { middleName: q }] })
      .select('-passwordHash')
      .lean()
      .exec();
    return transformToDtoArray(UserDto, users);
  }

  async getStudentsByGroup(groupId: string): Promise<UserDto[]> {
    const filter = { 'studentProfile.group': groupId } as Record<
      string,
      unknown
    >;
    const users = await this.userModel
      .find(filter)
      .select('-passwordHash')
      .lean()
      .exec();
    return transformToDtoArray(UserDto, users);
  }

  async getTeachersByDepartment(departmentId: string): Promise<UserDto[]> {
    const filter = { 'teacherProfile.department': departmentId } as Record<
      string,
      unknown
    >;
    const users = await this.userModel
      .find(filter)
      .select('-passwordHash')
      .lean()
      .exec();
    return transformToDtoArray(UserDto, users);
  }
}
