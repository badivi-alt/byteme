export interface Curriculum {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'archived';
  user_id: string;
  goal?: string;
  settings?: {
    time_per_day?: number;
    days_per_week?: number;
    skill_level?: string;
  };
}

export class Curriculum {
  static async filter(criteria: Partial<Curriculum>, orderBy?: string) {
    // TODO: Implement actual API call
    return [];
  }

  static async create(data: Partial<Curriculum>) {
    // TODO: Implement actual API call
    return { id: 'mock-id', ...data } as Curriculum;
  }
}
