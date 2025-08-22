export interface LLMResponse {
  modules: Array<{
    title: string;
    description: string;
    estimated_minutes: number;
    topic: string;
  }>;
}
