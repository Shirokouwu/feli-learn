export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
    }
  }
}
