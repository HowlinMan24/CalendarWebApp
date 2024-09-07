import {BelongsTo, Column, CreatedAt, DataType, Model, Table, UpdatedAt} from "sequelize-typescript";
import {ForeignKey} from "sequelize-typescript/dist/associations/foreign-key/foreign-key";
import Calendar from "./Calendar";
import {IEvent} from "calendar-shared/src/db-models/IEvent";

@Table({
    charset: 'utf8mb4',
})
export default class Event extends Model<IEvent> {

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare date: Date;

    @CreatedAt
    @Column
    declare createdAt: Date;

    @UpdatedAt
    @Column
    declare updatedAt: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare title: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare description: Date;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare busyStatus: Date;

    @ForeignKey(() => Calendar)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare calendarId: number;

    @BelongsTo(() => Calendar)
    declare calendar: Calendar;
}