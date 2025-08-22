export interface Task {
  id: string;
  stable_id: string;
  title: string;
  provider?: string;
  duration_minutes: number;
  skill_tags?: string[];
  deep_link?: string;
  description?: string;
  optional: boolean;
}

export class Task {
  static async list() {
    // TODO: Implement actual API call
    return [] as Task[];
  }

  static async filter(criteria: { 
    id?: string | { $in: string[] };
    [key: string]: any;
  }) {
    // TODO: Implement actual API call
    return [] as Task[];
  }

  static async create(data: Partial<Task>) {
    // TODO: Implement actual API call
    return { id: 'mock-id', ...data } as Task;
  }
}
