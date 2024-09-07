import {Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt} from "sequelize-typescript";
import Calendar from "./Calendar";
import {IUser} from "calendar-shared/src/db-models/IUser";

@Table({
    charset: 'utf8mb4',
})
export default class User extends Model<IUser> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    })
    declare isActivated: boolean

    @HasMany(() => Calendar)
    declare calendars: Calendar[];

}
