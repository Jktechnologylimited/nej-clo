import { getSession } from "@/lib/auth/session";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div>
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">PROFILE</p>
      <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        Your details
      </h1>
      <p className="mt-2 max-w-md font-body text-sm text-ink-muted">
        Update the name and email on your account.
      </p>

      <div className="mt-8">
        <ProfileForm name={session.name} email={session.email} />
      </div>
    </div>
  );
}
