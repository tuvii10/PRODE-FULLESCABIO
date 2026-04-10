export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type MatchStatus = 'upcoming' | 'live' | 'finished' | 'cancelled';
export type MatchStage  = 'group' | 'round16' | 'quarter' | 'semi' | 'third' | 'final';
export type BonusType   = 'champion' | 'runner_up' | 'third';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:               string;
          email:            string;
          username:         string | null;
          full_name:        string | null;
          avatar_url:       string | null;
          phone:            string | null;
          is_admin:         boolean;
          is_disqualified:  boolean;
          disq_reason:      string | null;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          id:               string;
          email:            string;
          username?:        string | null;
          full_name?:       string | null;
          avatar_url?:      string | null;
          phone?:           string | null;
          is_admin?:        boolean;
          is_disqualified?: boolean;
          disq_reason?:     string | null;
        };
        Update: {
          username?:        string | null;
          full_name?:       string | null;
          avatar_url?:      string | null;
          phone?:           string | null;
          is_admin?:        boolean;
          is_disqualified?: boolean;
          disq_reason?:     string | null;
        };
      };
      matches: {
        Row: {
          id:          string;
          home_team:   string;
          away_team:   string;
          home_flag:   string | null;
          away_flag:   string | null;
          match_date:  string;
          stage:       MatchStage;
          group_name:  string | null;
          venue:       string | null;
          status:      MatchStatus;
          home_score:  number | null;
          away_score:  number | null;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          home_team:   string;
          away_team:   string;
          home_flag?:  string | null;
          away_flag?:  string | null;
          match_date:  string;
          stage?:      MatchStage;
          group_name?: string | null;
          venue?:      string | null;
          status?:     MatchStatus;
          home_score?: number | null;
          away_score?: number | null;
        };
        Update: {
          home_team?:  string;
          away_team?:  string;
          home_flag?:  string | null;
          away_flag?:  string | null;
          match_date?: string;
          stage?:      MatchStage;
          group_name?: string | null;
          venue?:      string | null;
          status?:     MatchStatus;
          home_score?: number | null;
          away_score?: number | null;
        };
      };
      predictions: {
        Row: {
          id:               string;
          user_id:          string;
          match_id:         string;
          home_score_pred:  number;
          away_score_pred:  number;
          points:           number;
          calculated:       boolean;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          user_id:         string;
          match_id:        string;
          home_score_pred: number;
          away_score_pred: number;
        };
        Update: {
          home_score_pred?: number;
          away_score_pred?: number;
          points?:          number;
          calculated?:      boolean;
        };
      };
      bonus_predictions: {
        Row: {
          id:         string;
          user_id:    string;
          bonus_type: BonusType;
          team_name:  string;
          points:     number;
          calculated: boolean;
          created_at: string;
        };
        Insert: {
          user_id:    string;
          bonus_type: BonusType;
          team_name:  string;
        };
        Update: {
          team_name?:  string;
          points?:     number;
          calculated?: boolean;
        };
      };
      audit_logs: {
        Row: {
          id:         string;
          user_id:    string | null;
          action:     string;
          entity:     string | null;
          entity_id:  string | null;
          details:    Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          user_id?:    string | null;
          action:      string;
          entity?:     string | null;
          entity_id?:  string | null;
          details?:    Json | null;
          ip_address?: string | null;
        };
      };
      tournament_settings: {
        Row:    { key: string; value: string };
        Insert: { key: string; value: string };
        Update: { value?: string };
      };
    };
    Views: {
      ranking: {
        Row: {
          id:                  string;
          email:               string;
          full_name:           string | null;
          username:            string | null;
          avatar_url:          string | null;
          is_disqualified:     boolean;
          total_points:        number;
          exact_results:       number;
          correct_winner:      number;
          predictions_scored:  number;
          total_predictions:   number;
          registered_at:       string;
          position:            number;
        };
      };
    };
    Functions: {
      calc_points: {
        Args: { p_home: number; p_away: number; m_home: number; m_away: number };
        Returns: number;
      };
      recalculate_match_predictions: {
        Args: { p_match_id: string };
        Returns: void;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
