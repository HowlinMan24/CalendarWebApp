export interface IEvent {
    id?: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    calendarId: number;
    busyStatus: string;
    description: string;
    title: string;
}
                            