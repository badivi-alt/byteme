export interface Topic {
  id: string;
  title: string;
  description?: string;
  color?: string;
}

export class Topic {
  static async list(orderBy?: string, limit?: number) {
    // TODO: Implement actual API call
    return [];
  }

  static async create(data: Partial<Topic>) {
    // TODO: Implement actual API call
    return { id: 'mock-id', ...data } as Topic;
  }
}
