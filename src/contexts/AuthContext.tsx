
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  linkedinLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        setSession(newSession);
        setCurrentUser(newSession?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setCurrentUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: window.location.origin + '/dashboard',
        },
      });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Check if the error is about email signups being disabled
        if (error.message.includes("Email signups are disabled")) {
          toast({
            title: "Email signups disabled",
            description: "Please use Google or LinkedIn authentication instead.",
            variant: "destructive",
          });
          return { success: false, message: "Email signups are disabled. Please use Google or LinkedIn authentication." };
        }
        
        throw error;
      }
      
      // Check if the user needs to confirm their email
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "Email already exists",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive",
        });
        return { success: false, message: "Email already registered" };
      }
      
      // If we're in development mode and confirmation is required but not auto-confirmed
      if (data?.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent a confirmation link to your email address.",
        });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const linkedinLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
      
    } catch (error) {
      console.error('LinkedIn login error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    session,
    isLoading,
    login,
    signup,
    logout,
    googleLogin,
    linkedinLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
