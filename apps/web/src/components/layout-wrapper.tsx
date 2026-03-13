"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import AuthGuard from "@/components/auth-guard";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define pages that should NOT have the sidebar (e.g., landing page, auth pages)
    const isLandingPage = pathname === "/";
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isPublicPage = isLandingPage || isAuthPage;

    const showSidebar = !isPublicPage;

    if (!showSidebar) {
        return (
            <div className="grid grid-rows-[auto_1fr] h-svh overflow-hidden">
                <Header />
                <div className="overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </div>
        );
    }

    // Protected pages - require authentication
    return (
        <AuthGuard>
            <div className="flex h-svh bg-background overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header />
                    <main className="flex-1 overflow-y-auto overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
