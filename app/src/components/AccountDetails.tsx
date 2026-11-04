import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Profile = { name: string; email: string };

export default function AccountDetails({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const readProfile = () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user") || "null");
                setProfile(
                    token &&
                        user &&
                        user.emailVerified !== false &&
                        typeof user.name === "string" &&
                        typeof user.email === "string"
                        ? { name: user.name, email: user.email }
                        : null,
                );
            } catch {
                setProfile(null);
            }
            setReady(true);
        };

        readProfile();
        window.addEventListener("storage", readProfile);
        window.addEventListener("auth-change", readProfile);
        return () => {
            window.removeEventListener("storage", readProfile);
            window.removeEventListener("auth-change", readProfile);
        };
    }, [location.key]);

    const logout = () => {
        for (const key of [
            "token",
            "refreshToken",
            "user",
            "pending_verification_email",
        ]) {
            localStorage.removeItem(key);
        }
        queryClient.clear();
        setProfile(null);
        window.dispatchEvent(new Event("auth-change"));
        onNavigate?.();
        navigate("/sign-in", { replace: true });
    };

    if (!ready) return null;

    if (profile) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-auto min-w-0 gap-2 px-2 py-1 text-[#191c1d] hover:bg-primary-fixed/40 rounded-lg transition-colors"
                        aria-label={`Open profile menu for ${profile.name}`}
                    >
                        <UserRound
                            aria-hidden="true"
                            className="size-8 shrink-0 rounded-full bg-primary-fixed p-1.5 text-[#3525cd]"
                        />
                        <span className="max-w-40 truncate text-sm font-semibold capitalize">
                            {profile.name}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-64 max-w-[calc(100vw-2rem)]"
                >
                    <DropdownMenuLabel className="space-y-1 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                            <UserRound
                                aria-hidden="true"
                                className="size-8 shrink-0 rounded-full bg-primary-fixed p-1.5 text-[#3525cd]"
                            />
                            <div className="flex-1 items-center">
                                <p className="wrap-break-word text-sm font-semibold text-[#191c1d] capitalize">
                                    {profile.name}
                                </p>
                                <p className="break-all text-xs font-normal text-on-surface-variant">
                                    {profile.email}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer gap-2 px-3 py-2 hover:bg-primary-fixed/40">
                        <Link to="/dashboard" onClick={onNavigate} className="flex w-full items-center gap-2">
                            <LayoutDashboard aria-hidden="true" className="size-4 text-[#3525cd]" />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onSelect={logout}
                        className="cursor-pointer gap-2 px-3 py-2 hover:bg-red-500/50"
                    >
                        <LogOut aria-hidden="true" className="size-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <>
            <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-lg border-[#3525cd] bg-transparent font-medium text-[#3525cd] hover:bg-primary-fixed/30 transition-colors"
            >
                <Link to="/sign-in" onClick={onNavigate}>
                    Sign In
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
                className="rounded-lg border border-[#3525cd] bg-[#3525cd] font-medium text-white hover:bg-primary-container shadow-xs transition-all"
            >
                <Link to="/create-account" onClick={onNavigate}>
                    <UserRound aria-hidden="true" className="size-4" /> Sign Up
                </Link>
            </Button>
        </>
    );
}
