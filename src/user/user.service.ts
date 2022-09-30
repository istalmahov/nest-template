import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserScopes } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  findAll(where?: Partial<User>, scope = UserScopes.default): Promise<User[]> {
    return this.userModel.scope(scope).findAll({ where });
  }

  findOne(
    where: Partial<User>,
    scope = UserScopes.default,
  ): Promise<User | null> {
    return this.userModel.scope(scope).findOne({ where });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async deleteOne(where: Partial<User>): Promise<void> {
    const user = await this.userModel.findOne({ where });
    return user.destroy();
  }

  async update(
    where: Partial<User>,
    newValues: Partial<User>,
  ): Promise<User[]> {
    const [, updatedUsers] = await this.userModel.update(newValues, {
      where,
      returning: true,
    });

    return updatedUsers;
  }
}
