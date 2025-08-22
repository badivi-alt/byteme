export interface PlanItem {
  id: string;
  user_id: string;
  task_id: string;
  scheduled_date: string;
  status: 'pending' | 'done' | 'snoozed' | 'skipped';
  notes?: string;
  scheduled_index?: number;
  created_via: 'copilot' | 'quick_task' | 'library';
  curriculum_id?: string;
  topic_id?: string;
  lesson_id?: string;
  tags?: string[];
  completed_at?: string;
  snooze_count?: number;
}

export class PlanItem {
  static async filter(criteria: { 
    user_id?: string;
    scheduled_date?: string | { $gte: string; $lte: string };
    [key: string]: unknown;
  }, orderBy?: string) {
    // TODO: Implement actual API call
    return [] as PlanItem[];
  }

  static async create(data: Partial<PlanItem>) {
    // TODO: Implement actual API call
    return { id: 'mock-id', ...data } as PlanItem;
  }

  static async update(id: string, data: Partial<PlanItem>) {
    // TODO: Implement actual API call
    return { id, ...data } as PlanItem;
  }
}
