"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "superadmin" | "admin";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not logged in, redirect to login
        router.push("/login");
        return;
      }

      // Check role requirements
      if (requiredRole && user.role !== requiredRole) {
        // User doesn't have required role
        if (requiredRole === "superadmin" && user.role === "admin") {
          // Admin trying to access superadmin route
          router.push("/dashboard");
          return;
        }

        // Unauthorized access
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <Shield className="h-8 w-8 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Access
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we check your credentials...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

// Unauthorized page component
export function UnauthorizedPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Lock className="h-12 w-12 text-red-600" />
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>

            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your
              administrator if you think this is an error.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full h-12 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
