export interface IIssue {
  id?: number;
  title: string;
  description: string;
  type: string;
  status?: 'open' | 'in-progress' | 'resolved';
  reporter_id: number;
  created_at?: Date;
  updated_at?: Date;
}