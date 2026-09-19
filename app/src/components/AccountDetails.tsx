import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { UserRound } from "lucide-react";
import { Button } from "./ui/button";

type Profile = { name: string; email: string };

export default function AccountDetails({ onNavigate }: { onNavigate?: () => void }) {
    const location = useLocation();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const readProfile = () => {
            try {
                const token = localStorage.getItem("token");
                const user = JSON.parse(localStorage.getItem("user") || "null");
                setProfile(
                    token && user && user.emailVerified !== false &&
                    typeof user.name === "string" && typeof user.email === "string"
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
        return () => window.removeEventListener("storage", readProfile);
    }, [location.key]);

    if (!ready) return null;

    if (profile) {
        return (
            <div aria-label="Your profile" className="flex min-w-0 items-center gap-2 rounded-md border border-emerald-100 bg-white px-3 py-2">
                <UserRound aria-hidden="true" className="size-8 shrink-0 rounded-full bg-emerald-50 p-1.5 text-emerald-700" />
                <div className="min-w-0 md:max-w-56">
                    <p className="wrap-break-word text-sm font-semibold text-gray-900">{profile.name}</p>
                    <p className="break-all text-xs text-gray-500">{profile.email}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Button asChild variant="outline" size="sm" className="rounded-sm border-emerald-700 bg-transparent font-medium text-emerald-700 hover:text-emerald-800">
                <Link to="/sign-in" onClick={onNavigate}>Sign In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-sm border border-emerald-700 bg-emerald-700 font-medium text-white hover:bg-emerald-800">
                <Link to="/create-account" onClick={onNavigate}>
                    <UserRound aria-hidden="true" className="size-4" /> Sign Up
                </Link>
            </Button>
        </>
    );
}
