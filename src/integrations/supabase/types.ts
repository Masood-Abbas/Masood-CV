export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean
          keywords: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          keywords?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          keywords?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          certificate_file_url: string | null
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number
          expiration_date: string | null
          id: string
          is_published: boolean
          issue_date: string | null
          name: string
          organization: string
          organization_logo_url: string | null
          updated_at: string
        }
        Insert: {
          certificate_file_url?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          expiration_date?: string | null
          id?: string
          is_published?: boolean
          issue_date?: string | null
          name: string
          organization: string
          organization_logo_url?: string | null
          updated_at?: string
        }
        Update: {
          certificate_file_url?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          expiration_date?: string | null
          id?: string
          is_published?: boolean
          issue_date?: string | null
          name?: string
          organization?: string
          organization_logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          certificate_url: string | null
          created_at: string
          degree: string
          description: string | null
          display_order: number
          end_date: string | null
          field_of_study: string | null
          grade: string | null
          id: string
          institution: string
          institution_logo_url: string | null
          is_current: boolean
          is_published: boolean
          start_date: string | null
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          degree: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution: string
          institution_logo_url?: string | null
          is_current?: boolean
          is_published?: boolean
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          degree?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          field_of_study?: string | null
          grade?: string | null
          id?: string
          institution?: string
          institution_logo_url?: string | null
          is_current?: boolean
          is_published?: boolean
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          company_logo_url: string | null
          created_at: string
          description: string | null
          display_order: number
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean
          is_published: boolean
          job_title: string
          location: string | null
          responsibilities: string[]
          start_date: string | null
          technologies: string[]
          updated_at: string
        }
        Insert: {
          company: string
          company_logo_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          is_published?: boolean
          job_title: string
          location?: string | null
          responsibilities?: string[]
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          company?: string
          company_logo_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          is_published?: boolean
          job_title?: string
          location?: string | null
          responsibilities?: string[]
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      hero: {
        Row: {
          availability_text: string | null
          background_image_url: string | null
          badge_text: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          description: string | null
          heading: string
          id: string
          profile_image_url: string | null
          secondary_cta_text: string | null
          secondary_cta_url: string | null
          show_badge: boolean
          show_secondary_cta: boolean
          show_socials: boolean
          show_tech_tags: boolean
          subtitle: string | null
          tech_tags: string[]
          updated_at: string
        }
        Insert: {
          availability_text?: string | null
          background_image_url?: string | null
          badge_text?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          heading?: string
          id?: string
          profile_image_url?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          show_badge?: boolean
          show_secondary_cta?: boolean
          show_socials?: boolean
          show_tech_tags?: boolean
          subtitle?: string | null
          tech_tags?: string[]
          updated_at?: string
        }
        Update: {
          availability_text?: string | null
          background_image_url?: string | null
          badge_text?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          heading?: string
          id?: string
          profile_image_url?: string | null
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          show_badge?: boolean
          show_secondary_cta?: boolean
          show_socials?: boolean
          show_tech_tags?: boolean
          subtitle?: string | null
          tech_tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          filename: string
          id: string
          storage_path: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          filename: string
          id?: string
          storage_path: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          filename?: string
          id?: string
          storage_path?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_external: boolean
          label: string
          open_in_new_tab: boolean
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label: string
          open_in_new_tab?: boolean
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label?: string
          open_in_new_tab?: boolean
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          about: string | null
          cover_image_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          location: string | null
          phone: string | null
          professional_title: string
          profile_image_url: string | null
          resume_url: string | null
          tagline: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          professional_title?: string
          profile_image_url?: string | null
          resume_url?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          professional_title?: string
          profile_image_url?: string | null
          resume_url?: string | null
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      project_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          project_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          project_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          client: string | null
          created_at: string
          display_order: number
          end_date: string | null
          featured_image_url: string | null
          features: string[]
          full_description: string | null
          github_backend_url: string | null
          github_url: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          project_url: string | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: string
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client?: string | null
          created_at?: string
          display_order?: number
          end_date?: string | null
          featured_image_url?: string | null
          features?: string[]
          full_description?: string | null
          github_backend_url?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          project_url?: string | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: string
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client?: string | null
          created_at?: string
          display_order?: number
          end_date?: string | null
          featured_image_url?: string | null
          features?: string[]
          full_description?: string | null
          github_backend_url?: string | null
          github_url?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          project_url?: string | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: string
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          display_order: number
          features: string[]
          full_description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          short_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          features?: string[]
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          features?: string[]
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          animations_enabled: boolean
          border_radius: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          default_language: string
          favicon_url: string | null
          font_family: string | null
          google_maps_url: string | null
          id: string
          keywords: string | null
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          portfolio_name: string | null
          primary_color: string | null
          site_description: string | null
          site_title: string | null
          theme_mode: string
          twitter_image_url: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          animations_enabled?: boolean
          border_radius?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_language?: string
          favicon_url?: string | null
          font_family?: string | null
          google_maps_url?: string | null
          id?: string
          keywords?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          portfolio_name?: string | null
          primary_color?: string | null
          site_description?: string | null
          site_title?: string | null
          theme_mode?: string
          twitter_image_url?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          animations_enabled?: boolean
          border_radius?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          default_language?: string
          favicon_url?: string | null
          font_family?: string | null
          google_maps_url?: string | null
          id?: string
          keywords?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          portfolio_name?: string | null
          primary_color?: string | null
          site_description?: string | null
          site_title?: string | null
          theme_mode?: string
          twitter_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          name: string
          percentage: number
          proficiency: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          percentage?: number
          proficiency?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          percentage?: number
          proficiency?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          client_photo_url: string | null
          company: string | null
          created_at: string
          display_order: number
          id: string
          is_published: boolean
          job_title: string | null
          rating: number
          testimonial: string
          updated_at: string
        }
        Insert: {
          client_name: string
          client_photo_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          job_title?: string | null
          rating?: number
          testimonial: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          client_photo_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          job_title?: string | null
          rating?: number
          testimonial?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
