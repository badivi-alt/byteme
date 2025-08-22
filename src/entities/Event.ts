export interface IEvent {
  id: string;
  user_id: string;
  event_name: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export class Event implements IEvent {
  id!: string;
  user_id!: string;
  event_name!: string;
  timestamp!: string;
  meta?: Record<string, unknown>;
  static async filter(criteria: Partial<Event>, orderBy?: string) {
    // TODO: Implement actual API call
    return [];
  }

  static async create(data: Partial<Event>) {
    // TODO: Implement actual API call
    return { id: 'mock-id', ...data } as Event;
  }
}
