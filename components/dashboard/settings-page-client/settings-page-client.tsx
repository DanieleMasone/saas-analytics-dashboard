"use client";

import {
  BellRing,
  Database,
  GitBranch,
  LockKeyhole,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import {useState} from "react";
import {DashboardShell} from "../dashboard-shell/dashboard-shell";
import {Badge} from "@/components/ui/badge/badge";
import {Button} from "@/components/ui/button/button";
import {uiStyles} from "@/components/ui/style-primitives";
import {cn} from "@/lib/utils/utils";

type PreferenceKey = "deliveryAlerts" | "healthDigest" | "revenueReview";
type GuardrailKey = "blockerLimit" | "healthRiskThreshold" | "churnBudget";

type PreferenceCopy = {
  description: string;
  label: string;
  owner: string;
};

type GuardrailCopy = {
  description: string;
  label: string;
  max: number;
  min: number;
  suffix: string;
};

const defaultPreferences: Record<PreferenceKey, boolean> = {
  deliveryAlerts: true,
  healthDigest: true,
  revenueReview: false,
};

const defaultGuardrails: Record<GuardrailKey, number> = {
  blockerLimit: 3,
  churnBudget: 2.5,
  healthRiskThreshold: 65,
};

const preferenceCopy: Record<PreferenceKey, PreferenceCopy> = {
  deliveryAlerts: {
    description: "Escalate blocked Jira work before it threatens a release window.",
    label: "Delivery risk alerts",
    owner: "Product and engineering leads",
  },
  healthDigest: {
    description: "Collect customer health movement for weekly operating reviews.",
    label: "Customer health digest",
    owner: "Customer success managers",
  },
  revenueReview: {
    description: "Flag revenue variance when expansion and churn move outside target.",
    label: "Revenue variance review",
    owner: "Revenue operations",
  },
};

const guardrailCopy: Record<GuardrailKey, GuardrailCopy> = {
  blockerLimit: {
    description: "Open blockers allowed before the delivery signal becomes escalated.",
    label: "Delivery blocker limit",
    max: 10,
    min: 0,
    suffix: "blockers",
  },
  churnBudget: {
    description: "Monthly churn percentage that triggers a revenue variance review.",
    label: "Churn budget",
    max: 10,
    min: 0,
    suffix: "%",
  },
  healthRiskThreshold: {
    description: "Customer health score below which an account enters the risk queue.",
    label: "Health risk threshold",
    max: 100,
    min: 0,
    suffix: "/100",
  },
};

function clampGuardrailValue(id: GuardrailKey, value: number) {
  const {max, min} = guardrailCopy[id];
  if (!Number.isFinite(value)) return defaultGuardrails[id];

  return Math.min(Math.max(value, min), max);
}

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
        <span className="mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400">
          Owner: {copy.owner}
        </span>
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

function GuardrailInput({
                          id,
                          onChange,
                          value,
                        }: {
  id: GuardrailKey;
  onChange: (id: GuardrailKey, value: number) => void;
  value: number;
}) {
  const copy = guardrailCopy[id];

  return (
      <label className={cn("block p-4", uiStyles.insetSurface)}>
        <span className="block text-sm font-semibold text-slate-950 dark:text-white">{copy.label}</span>
        <span className={cn("mt-1 block", uiStyles.bodyText)}>{copy.description}</span>
        <span className="mt-4 flex items-center gap-2">
          <input
              className={cn("w-28 px-3", uiStyles.field)}
              max={copy.max}
              min={copy.min}
              onChange={(event) => onChange(id, event.currentTarget.valueAsNumber)}
              step={id === "churnBudget" ? 0.5 : 1}
              type="number"
              value={value}
          />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{copy.suffix}</span>
        </span>
      </label>
  );
}

function buildAlertPreview(
    preferences: Record<PreferenceKey, boolean>,
    guardrails: Record<GuardrailKey, number>,
) {
  const preview = [];

  if (preferences.deliveryAlerts) {
    preview.push(`Escalate delivery when blockers exceed ${guardrails.blockerLimit}.`);
  }

  if (preferences.healthDigest) {
    preview.push(`Review accounts below ${guardrails.healthRiskThreshold}/100 health.`);
  }

  if (preferences.revenueReview) {
    preview.push(`Flag churn above ${guardrails.churnBudget}% of MRR.`);
  }

  return preview;
}

/** Focused settings route for actionable manager alert rules and connected demo sources. */
export function SettingsPageClient() {
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>(defaultPreferences);
  const [guardrails, setGuardrails] = useState<Record<GuardrailKey, number>>(defaultGuardrails);
  const alertPreview = buildAlertPreview(preferences, guardrails);

  const updatePreference = (id: PreferenceKey, checked: boolean) => {
    setPreferences((current) => ({...current, [id]: checked}));
  };

  const updateGuardrail = (id: GuardrailKey, value: number) => {
    setGuardrails((current) => ({...current, [id]: clampGuardrailValue(id, value)}));
  };

  const resetDefaults = () => {
    setPreferences(defaultPreferences);
    setGuardrails(defaultGuardrails);
  };

  return (
      <DashboardShell
          activeSection="settings"
          description="Configure manager-facing alert rules, operating guardrails, data sources, and workspace readiness."
          eyebrow="Settings"
          title="Settings"
      >
        <section aria-labelledby="workspace-preferences-title" className={cn("p-5", uiStyles.surface)}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Settings2 aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={20}/>
                <h2 className={uiStyles.sectionHeading} id="workspace-preferences-title">
                  Alert subscriptions
                </h2>
              </div>
              <p className={cn("mt-1", uiStyles.subtleText)}>
                Decide which management signals should appear in operating reviews.
              </p>
            </div>
            <Button onClick={resetDefaults} variant="secondary">
              <RotateCcw aria-hidden="true" size={16}/>
              Reset defaults
            </Button>
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

        <section aria-labelledby="operating-guardrails-title" className={cn("p-5", uiStyles.surface)}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
            <h2 className={uiStyles.sectionHeading} id="operating-guardrails-title">
              Operating guardrails
            </h2>
          </div>
          <p className={cn("mt-1", uiStyles.subtleText)}>
            Tune thresholds used by the manager alert preview.
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {(Object.keys(guardrailCopy) as GuardrailKey[]).map((id) => (
                <GuardrailInput id={id} key={id} onChange={updateGuardrail} value={guardrails[id]}/>
            ))}
          </div>
        </section>

        <section aria-labelledby="notification-routing-title" className={cn("p-5", uiStyles.surface)}>
          <div className="flex items-center gap-2">
            <BellRing aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
            <h2 className={uiStyles.sectionHeading} id="notification-routing-title">Alert preview</h2>
          </div>
          <p className={cn("mt-2", uiStyles.bodyText)}>
            Enabled signals: {alertPreview.length} of {Object.keys(preferences).length}.
          </p>
          {alertPreview.length > 0 ? (
              <ul className="mt-4 grid gap-2">
                {alertPreview.map((item) => (
                    <li className={cn("p-3 text-sm text-slate-700 dark:text-slate-200", uiStyles.insetSurface)}
                        key={item}>
                      {item}
                    </li>
                ))}
              </ul>
          ) : (
              <p className={cn("mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/20 dark:text-amber-100")}>
                No alerts are enabled. Turn on at least one signal to keep the manager review useful.
              </p>
          )}
        </section>

        <section aria-labelledby="data-sources-title" className={cn("p-5", uiStyles.surface)}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className={uiStyles.sectionHeading} id="data-sources-title">Data sources</h2>
              <p className={cn("mt-1", uiStyles.subtleText)}>
                Revenue, customer, and delivery signals available to the workspace.
              </p>
            </div>
            <Badge tone="cyan">Demo data</Badge>
          </div>

          <ul className="mt-5 grid gap-3 lg:grid-cols-3">
            <li className={cn("p-4", uiStyles.insetSurface)}>
              <Database aria-hidden="true" className="text-cyan-700 dark:text-cyan-300" size={18}/>
              <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">SaaS metrics</h3>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                Revenue, customer, and operating KPI feeds are available for manager review.
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
              <h3 className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">Report pack</h3>
              <p className={cn("mt-2", uiStyles.bodyText)}>
                Dashboard, reference, and coverage reports are bundled for review.
              </p>
              <Badge className="mt-3" tone="slate">Configured</Badge>
            </li>
          </ul>
        </section>
      </DashboardShell>
  );
}
