export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          provider: string
          is_active: boolean
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          provider?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          provider?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
        }
      }
      genus: {
        Row: {
          id: string
          name: string
          scientific_name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string
          description?: string
          created_at?: string
        }
      }
      species: {
        Row: {
          id: string
          name: string
          scientific_name: string
          description: string
          characteristics: Json
          habitat: string
          distribution: string
          conservation_status: string
          image_url: string
          genus_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name: string
          description: string
          characteristics?: Json
          habitat: string
          distribution: string
          conservation_status: string
          image_url: string
          genus_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string
          description?: string
          characteristics?: Json
          habitat?: string
          distribution?: string
          conservation_status?: string
          image_url?: string
          genus_id?: string
          created_at?: string
        }
      }
      species_clicks: {
        Row: {
          id: string
          species_id: string | null
          genus_id: string | null
          click_count: number
          last_clicked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          species_id?: string | null
          genus_id?: string | null
          click_count?: number
          last_clicked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          species_id?: string | null
          genus_id?: string | null
          click_count?: number
          last_clicked_at?: string
          created_at?: string
        }
      }
    }
  }
}
