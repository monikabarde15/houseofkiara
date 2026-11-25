import { FormEvent, useEffect, useState } from "react";
import * as authApi from "../services/authApi";

export default function AdminAuth({
  onLogin,
}: {
  onLogin: (session: any) => void;
}) {
  const [registered, setRegistered] = useState(true);
  const [mode, setMode] = useState<"login" | "register" | "invite">("login");
  const [inviteToken, setInviteToken] = useState<string>("");
  const [inviteInfo, setInviteInfo] = useState<authApi.InviteInfo | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = (params.get("invite") || "").trim();
    if (token) {
      setInviteToken(token);
      setMode("invite");
      setInviteLoading(true);
      authApi
        .getInviteInfo(token)
        .then((info) => {
          setInviteInfo(info);
          setForm((prev) => ({
            ...prev,
            email: info.workEmail || "",
            name: info.fullName || "",
          }));
        })
        .catch((err) => {
          setError(
            err instanceof Error
              ? err.message
              : "This invite link is no longer valid.",
          );
        })
        .finally(() => setInviteLoading(false));
      return;
    }

    authApi
      .authStatus()
      .then((status) => {
        setRegistered(status.registered);
        if (!status.registered) setMode("register");
      })
      .catch(() => setError("Backend connection unavailable."));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "invite") {
        if (!inviteToken || !inviteInfo) {
          setError("This invite link is no longer valid.");
          return;
        }
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters.");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        const session = await authApi.acceptInvite({
          token: inviteToken,
          password: form.password,
        });
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("invite");
          window.history.replaceState({}, "", url.toString());
        } catch {
          // Ignore URL cleanup error
        }
        onLogin(session);
        return;
      }

      if (mode === "register") {
        await authApi.registerAdmin({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setRegistered(true);
        setMode("login");
        setError("Registration complete. Please login.");
      } else
        onLogin(
          await authApi.loginAdmin({
            email: form.email,
            password: form.password,
          }),
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed.");
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] p-4">
      <div className="w-full max-w-[430px] border border-[#e7dfd5] bg-white shadow-[0_8px_30px_rgba(64,46,27,.12)]">
        <div className="bg-[#1d1812] px-8 py-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#cfb26f] text-xl text-[#332a17]">
            ◇
          </div>
          <h1 className="font-serif text-2xl tracking-[.12em] text-[#f0ebe4]">
            HOUSE OF KAIRA
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-[#c6a765]">
            Admin Panel
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4 p-8">
          <div>
            <h2 className="font-serif text-2xl text-[#302d2a]">
              {mode === "invite"
                ? inviteInfo
                  ? `Welcome, ${inviteInfo.fullName}`
                  : "Accept your invite"
                : mode === "login"
                  ? "Welcome back"
                  : "Register admin"}
            </h2>
            <p className="mt-1 text-sm text-[#988f86]">
              {mode === "invite"
                ? inviteLoading
                  ? "Checking your invite link..."
                  : inviteInfo
                    ? `Set a password for ${inviteInfo.workEmail} to sign in.`
                    : "Your invite could not be verified."
                : mode === "login"
                  ? "Sign in to manage your dashboard."
                  : "This registration can be completed only once."}
            </p>
          </div>
          {mode === "register" && (
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="auth-input"
            />
          )}
          {mode !== "invite" && (
            <input
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="auth-input"
            />
          )}
          {(!inviteLoading && (mode !== "invite" || Boolean(inviteInfo))) && (
            <>
              <input
                required
                minLength={8}
                type="password"
                placeholder={
                  mode === "invite"
                    ? "Create a password (8+ characters)"
                    : "Password (minimum 8 characters)"
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="auth-input"
              />
              {mode === "invite" && (
                <input
                  required
                  minLength={8}
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="auth-input"
                />
              )}
            </>
          )}
          {error && (
            <p
              className={`text-sm ${error.includes("complete") ? "text-[#718c61]" : "text-[#bd6040]"}`}
            >
              {error}
            </p>
          )}
          {(!inviteLoading && (mode !== "invite" || Boolean(inviteInfo))) && (
            <button className="w-full bg-[#c6a05c] px-4 py-3 text-sm font-bold text-[#332817] hover:bg-[#b58d49]">
              {mode === "invite"
                ? "Set password & sign in"
                : mode === "login"
                  ? "Sign in"
                  : "Register admin"}
            </button>
          )}
          {mode === "invite" ? (
            <button
              type="button"
              className="w-full text-sm text-[#988f86] underline"
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Back to login
            </button>
          ) : (
            registered && (
              <button
                type="button"
                className="w-full text-sm text-[#988f86] underline"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
              >
                {mode === "login" ? "" : "Back to login"}
              </button>
            )
          )}
        </form>
      </div>
    </main>
  );
}
