| Change | Existing component/style reused | Why this matched project style | Any new component created? |
|---|---|---|---|
| Added central page permission guard | Existing `RoleContext.can`, `Page` union, `AppShell`, Tailwind alert styling | Keeps authorization in the app shell/navigation layer already used by the prototype | No |
| Corrected Compliance dashboard CTA from disbursement to documentation | Existing `KPICard` role card pattern | Compliance owns documentation handoff, not payment initiation | No |
| Added global search results screen | Existing `card`, `field-input`, `field-select`, `btn-primary`, `StatusBadge`, table/list row styling | S02 needed a reachable results surface, and the existing dense operational card/list style fits search results | No |
| Added internal notifications center | Existing `card`, `StatusBadge`, header bell menu, alert/list row styling | S04 needed a reachable queue with reason, owner, source, status and next action | No |
| Added role-aware filtering to search and notifications | Existing `RoleContext.can` permission helper | Global search/alerts should not reveal modules unavailable to the active role | No |
| Added Field Officer and Sales Team demo roles | Existing `RoleContext`, login role selector, header role switcher, dashboard `KPICard` rows, task inbox filters | The specs define these roles; wiring them through the current RBAC primitives avoids one-off permission code | No |
| Expanded screen coverage matrix to one row per spec heading | Existing markdown audit table format | Screen-by-screen Ralph loop requires each S/MP screen to be independently inspectable without range expansion | No |
| Updated stale role copy and permission overview rows | Existing `ReportsMIS`, `SettingsHub`, and `AuditTimeline` table/label patterns | Keeps role visibility and audit labels aligned with seeded Field Officer and Sales Team roles | No |
| Added local audit helper script | Existing repo scripts directory pattern and `.codex/spec-audit` evidence output | Gathers evidence without touching product code | No product component |
| Audit matrices | Markdown tables requested by prompt | Keeps verification evidence outside runtime UI | No |
