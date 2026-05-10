"use client";

import {BellRing, Database, GitBranch, LockKeyhole, Settings2} from "lucide-react";
import {useState} from "react";
import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {Badge} from "@/components/ui/badge";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn} from "@/lib/utils";

type PreferenceKey = "deliveryAlerts" | "healthDigest" | "revenueReview";

const preferenceCopy: Record<PreferenceKey, { description: string; label: string }> = {
  deliveryAlerts: {
    description: "Notify managers when blocked Jira work threatens a release window.",
    label: "Delivery risk alerts",
  },
  healthDigest: {
    description: "Collect customer health movement for weekly operating reviews.",
    label: "Customer health digest",
  },
  revenueReview: {
    description: "Flag revenue variance when expansion and churn move outside target.",
    label: "Revenue variance review",
  },
};

function ToggleRow({
  checked,
  id,
  onChange,
}: {
  checked: boolean;
  id: PreferenceKey;
  onChange: (id: PreferenceKey, checked: boolean) => void;
}) {
  const copy = preferenceCopy[id];

  return (
    <label className={cn("flex cursor-pointer items-start justify-between gap-4 p-4", uiStyles.insetSurface)}>
      <span>
        <span className="block text-sm font-semibold text-slate-950 dark:text-white">{copy.label}</span>
        <span className={cn("mt-1 block", uiStyles.bodyText)}>{copy.description}</span>
      </span>
      <input
        checked={checked}
        className="mt-1 h-5 w-5 rounded border-slate-300 accent-cyan-700 dark:border-slate-700"
        onChange={(event) => onChange(id, event.currentTarget.checked)}
        type="checkbox"
      />
    </label>
  );
}

/** Focused settings route for workspace preferences and connected demo sources. */
export function SettingsPageClient() {
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    deliveryAlerts: true,
    healthDigest: true,
    revenueReview: false,
  });
  const dataMode = process.env.NEXT_PUBLIC_DATA_MODE === "static" ? "Static demo" : "Mock API";

  const updatePreference = (id: PreferenceKey, checked: boolean) => {
    setPreferences((current) => ({...current, [id]: checked}));
  };

  return (
    <DashboardShell
      activeSection="settings"
      description="Tune manager notifications, connected data sources, and workspace readiness for the dashboard demo."
      eyebrow="Settings"
      title="Settings"
    >
      <section aria-labelledby="workspace-preferences-title" className={cn("p-5", uiStyles.surface)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className={uiStyles.sectionHeading} id="workspace-preferences-title">
              Workspace preferences
            </h2>
            <p className={cn("mt-1", uiStyles.subtleText)}>
              Local controls for the manager-facing operating workflow.
            </p>
          </div>
          <Settings2 aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={20}/>
        </div>

        <div className="mt-5 grid gap-3">
          {(Object.keys(preferenceCopy) as PreferenceKey[]).map((id) => (
            <ToggleRow
              checked={preferences[id]}
              id={id}
              key={id}
              onChange={updatePreference}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="data-sources-title" className={cn("p-5", uiStyles.surface)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className={uiStyles.sectionHeading} id="data-sources-title">Data sources</h2>
            <p className={cn("mt-1", uiStyles.subtleText)}>
              Revenue, customer, and Jira-style delivery samples available to the workspace.
            </p>
          </div>
          <Badge tone="cyan">{dataMode}</Badge>
        </div>

        <ul className="mt-5 grid gap-3 lg:grid-cols-3">
          <li className={cn("p-4", uiStyles.insetSurface)}>
            <Database aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
            <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">SaaS metrics</h3>
            <p className={cn("mt-2", uiStyles.bodyText)}>
              Revenue, customer, and operating KPI feeds are ready for local and static demos.
            </p>
            <Badge className="mt-3" tone="emerald">Ready</Badge>
          </li>
          <li className={cn("p-4", uiStyles.insetSurface)}>
            <GitBranch aria-hidden="true" className="text-amber-700 dark:text-amber-200" size={18}/>
            <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Jira delivery</h3>
            <p className={cn("mt-2", uiStyles.bodyText)}>
              Sprint predictability, blockers, and risk issues are modeled as manager-ready samples.
            </p>
            <Badge className="mt-3" tone="amber">Sample</Badge>
          </li>
          <li className={cn("p-4", uiStyles.insetSurface)}>
            <LockKeyhole aria-hidden="true" className="text-slate-700 dark:text-slate-200" size={18}/>
            <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Publishing</h3>
            <p className={cn("mt-2", uiStyles.bodyText)}>
              The workspace is prepared for GitHub Pages static publishing and reference reports.
            </p>
            <Badge className="mt-3" tone="slate">Configured</Badge>
          </li>
        </ul>
      </section>

      <section aria-labelledby="notification-routing-title" className={cn("p-5", uiStyles.surface)}>
        <div className="flex items-center gap-2">
          <BellRing aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
          <h2 className={uiStyles.sectionHeading} id="notification-routing-title">Notification routing</h2>
        </div>
        <p className={cn("mt-2", uiStyles.bodyText)}>
          Enabled signals: {Object.values(preferences).filter(Boolean).length} of {Object.keys(preferences).length}.
        </p>
      </section>
    </DashboardShell>
  );
}

