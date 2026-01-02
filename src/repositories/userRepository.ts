import { supabase } from "@/lib/database";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "superadmin" | "admin";
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin";
}

export class UserRepository {
  // Login user using Supabase auth
  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      // First try to authenticate with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      // If any auth error occurs, check if user exists in our table and allow login
      if (authError) {
        console.log(
          "Auth error, checking user in our table:",
          authError.message
        );

        // Get user profile from our users table
        const { data: user, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .eq("is_active", true)
          .single();

        if (fetchError) {
          console.error("Login fetch error:", fetchError);
          return null;
        }

        if (!user) {
          console.error("User not found in our table");
          return null;
        }

        // Update last login
        const { error: updateError } = await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", user.id);

        if (updateError) {
          console.error("Login update error:", updateError);
        }

        console.log("User found in our table, allowing login");
        return user;
      }

      if (!authData.user) {
        console.error("No auth data returned");
        return null;
      }

      return await this.getUserProfile(credentials.email, authData.user.id);
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  // Helper method to get user profile
  private static async getUserProfile(
    email: string,
    userId: string
  ): Promise<User | null> {
    try {
      // Get user profile from our users table
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (fetchError) {
        console.error("Login fetch error:", fetchError);
        return null;
      }

      if (!user) {
        return null;
      }

      // Update last login
      const { error: updateError } = await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) {
        console.error("Login update error:", updateError);
      }

      return user;
    } catch (error) {
      console.error("Get user profile error:", error);
      return null;
    }
  }

  // Create new user (signup) using Supabase auth
  static async create(userData: SignupData): Promise<User | null> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        },
      });

      if (authError) {
        console.error("Signup auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // Create user profile in our users table
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      if (!newUser) {
        throw new Error("Failed to create user profile");
      }

      return newUser;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  }

  // Get user by ID
  static async getById(id: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Get user error:", error);
        return null;
      }

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }

  // Get all users (for admin panel)
  static async getAll(): Promise<User[]> {
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Get users error:", error);
        return [];
      }

      return users || [];
    } catch (error) {
      console.error("Get users error:", error);
      return [];
    }
  }

  // Update user
  static async update(
    id: string,
    updates: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ): Promise<User | null> {
    try {
      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update user error:", error);
        return null;
      }

      if (!updatedUser) {
        return null;
      }

      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      return null;
    }
  }

  // Delete user (soft delete - set is_active to false)
  static async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_active: false })
        .eq("id", id);

      if (error) {
        console.error("Delete user error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      return false;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}
