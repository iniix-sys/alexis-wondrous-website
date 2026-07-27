import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {

    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadProfile(userId) {

        if (!userId) {
            setProfile(null);
            return;
        }

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        setProfile(data || null);
    }

    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!active) return;

            setSession(data.session);
            loadProfile(data.session?.user?.id).finally(() => {
                if (active) setLoading(false);
            });
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            loadProfile(nextSession?.user?.id);
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    async function signUp(email, password, username) {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) throw error;
        return data;
    }

    async function signIn(email, password) {

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return {
        session,
        user: session?.user || null,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile: () => loadProfile(session?.user?.id)
    };
}
