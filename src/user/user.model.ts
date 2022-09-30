import * as bcrypt from 'bcrypt';
import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

export enum UserScopes {
  default = 'defaultScope',
  withPassword = 'withPassword',
}

@Table({
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { exclude: [] },
    },
  },
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
}
