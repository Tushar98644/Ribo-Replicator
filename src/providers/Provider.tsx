'use client'
import { SessionProvider } from "next-auth/react";
import AuthenticationGuard from "./AuthGaurd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProps } from "@/types/app-props";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";

export const Provider = ({ children, session }: AppProps) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider session={session}>
                <AuthenticationGuard>
                    <ToastContainer />
                    {children}
                </AuthenticationGuard>
            </SessionProvider>
        </ThemeProvider>
    );
};

