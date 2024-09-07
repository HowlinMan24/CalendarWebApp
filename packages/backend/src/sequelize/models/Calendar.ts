import {BelongsTo, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ICalendar} from "calendar-shared/src/db-models/ICalendar";
import Event from './Event'
import {ForeignKey} from "sequelize-typescript/dist/associations/foreign-key/foreign-key";
import User from "./User";

@Table({
    charset: 'utf8mb4',
})
export default class Calendar extends Model<ICalendar> {

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare identifier: string;

    @BelongsTo(() => User)
    declare user: User;

    @HasMany(() => Event)
    declare events: Event[];
}