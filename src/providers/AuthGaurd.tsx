"use client";
import { Loader } from "@/components/loader/loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AuthenticationGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const { status, data: session } = useSession();
    console.log(status);
    const pathname = usePathname();
    // return a string of the current path
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            if (pathname === "/") {
                router.push("/dashboard");
            }
        } else if (status === "unauthenticated") {
            if (pathname !== "/") {
                router.push("/");
            }
        }

    }, [status, pathname, session?.user?.email, router]);

    if (status === "loading") {
        return <Loader/>;
    }

    return <>{children}</>;
}