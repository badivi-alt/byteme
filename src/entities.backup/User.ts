export interface User {
  id: string;
  full_name?: string;
  email: string;
  timezone?: string;
  reminder_time?: string;
  work_days?: string[];
  preferences?: {
    topic?: string;
    career_goal?: string;
    skill_goals?: string[];
    daily_minutes_target?: number;
    pace?: 'standard' | 'compressed' | 'stretched';
    learning_style?: 'video' | 'reading' | 'interactive' | 'mixed';
    budget?: string;
    include_projects?: boolean;
    assessment_preference?: boolean;
    include_harvard?: boolean;
    preferred_sources?: string[];
  };
  start_date?: string;
  streak_days?: number;
  xp?: number;
  has_completed_copilot?: boolean;
  onboarding_status?: string;
  vacation_ranges?: Array<{ start: string; end: string }>;
}

export class User {
  static async me() {
    // TODO: Implement actual API call
    return {
      id: 'mock-user',
      email: 'user@example.com',
      work_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      streak_days: 0,
      xp: 0
    } as User;
  }

  static async updateMyUserData(data: Partial<User>) {
    // TODO: Implement actual API call
    return { ...data } as User;
  }
}
