"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Shield, CheckCircle } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout
    logout();

    // Redirect to login after a short delay
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Logged Out Successfully
            </h1>

            <p className="text-gray-600 mb-6">
              You have been securely logged out of the admin dashboard.
            </p>

            {/* Loading Indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Redirecting to login...</span>
            </div>

            {/* Manual Redirect Link */}
            <div className="text-sm text-gray-500">
              If you are not redirected automatically,{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                click here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
