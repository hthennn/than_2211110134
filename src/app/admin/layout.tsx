"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        await checkAuth();
        if (isMounted) setAuthChecked(true);
      } catch (error) {
        console.error("Kiểm tra xác thực không thành công:", error);
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && !loading && !isAuthenticated) {
      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    }
  }, [isAuthenticated, loading, router, authChecked]);

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return <div>....Loading</div>;
  }

  return isAuthenticated ? (
    <>
      <div>{children}</div>;;
    </>
  ) : null;
}
