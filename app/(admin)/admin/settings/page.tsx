import { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your portfolio settings</p>
      </div>

      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Settings panel coming soon.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Configure SEO, analytics, and other site-wide settings here.
        </p>
      </div>
    </div>
  );
}
