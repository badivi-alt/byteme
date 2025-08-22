export interface CurriculumTopic {
  id: string;
  curriculum_id: string;
  topic_id: string;
  sequence: number;
}

export class CurriculumTopic {
  static async create(data: Partial<CurriculumTopic>) {
    // TODO: Implement actual API call
    return { id: "mock-id", ...data } as CurriculumTopic;
  }
}
