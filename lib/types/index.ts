import type { Database } from './database.types';

export type Profile     = Database['public']['Tables']['profiles']['Row'];
export type Match       = Database['public']['Tables']['matches']['Row'];
export type Prediction  = Database['public']['Tables']['predictions']['Row'];
export type RankingRow  = Database['public']['Views']['ranking']['Row'];

export type MatchStatus = 'upcoming' | 'live' | 'finished' | 'cancelled';
export type MatchStage  = 'group' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';

export type MatchWithPrediction = Match & {
  prediction?: Prediction | null;
};

export type { Database };
