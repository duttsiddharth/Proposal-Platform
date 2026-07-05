import { useState, useRef } from "react";

/* ── Design tokens ──────────────────────────────────────────── */
const T = {
  paper: "#EFF2F1",
  panel: "#FFFFFF",
  ink: "#1B2A33",
  inkSoft: "#4A5A62",
  petrol: "#0E5A6D",
  amber: "#B9771E",
  amberBg: "#FBF3E4",
  hairline: "#D8DFDD",
  green: "#2F7D53",
  red: "#A33B2E",
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
};

/* ── Reference data ─────────────────────────────────────────── */
const INDUSTRIES = ["Financial Services", "Healthcare", "Manufacturing", "Retail", "Public Sector", "Technology", "Telecom", "Energy"];
const BUDGETS = ["< $500K", "$500K – $2M", "$2M – $5M", "$5M – $20M", "> $20M"];
const BUDGET_MID = { "< $500K": 350000, "$500K – $2M": 1200000, "$2M – $5M": 3200000, "$5M – $20M": 10000000, "> $20M": 28000000 };
const TIMELINES = ["3–6 months", "6–12 months", "12–18 months", "18–36 months"];
const TIMELINE_WEEKS = { "3–6 months": 20, "6–12 months": 38, "12–18 months": 64, "18–36 months": 100 };
const CURRENCIES = {
  USD: { fx: 1, locale: "en-US", round: 5000 },
  INR: { fx: 83, locale: "en-IN", round: 100000 },
  AED: { fx: 3.67, locale: "en-US", round: 10000 },
  GBP: { fx: 0.79, locale: "en-GB", round: 5000 },
  SGD: { fx: 1.35, locale: "en-US", round: 5000 },
};

const SAMPLE = {
  client: "Acme Global Foods (fictional)",
  title: "Global Network, UC&C & Security Transformation",
  industry: "Manufacturing",
  budget: "$2M – $5M",
  timeline: "12–18 months",
  region: "EMEA + APAC · 28 sites",
  type: "network",
  brief:
    "A multinational enterprise is issuing an RFP for a global network transformation across 28 sites. Scope: SD-WAN rollout replacing legacy MPLS, campus LAN/Wi-Fi 6E refresh, migration of voice and collaboration to a cloud UC&C platform, and a security uplift covering SASE, zero-trust access and managed SOC integration. Requirements: 99.9% availability SLAs, ITIL 4 aligned service transition, 90-day hypercare and knowledge transfer to the internal NOC. Incumbent contracts expire in 14 months, so phased site-by-site cutover with zero business disruption is mandatory.",
};

/* ── Delivery knowledge base: six project-type blueprints ───── */
/* Cost shares are fractions of the working budget (pre-contingency).
   Phase shares are fractions of total programme weeks.               */
const BLUEPRINTS = {
  network: {
    label: "Network / SD-WAN / UC&C transformation",
    overview:
      "A phased, site-wave transformation built on a cloud-managed SD-WAN overlay, refreshed campus access layer and cloud UC&C, wrapped in a SASE-based zero-trust security perimeter and an ITIL 4 aligned service transition into steady-state operations.",
    layers: [
      { name: "Connectivity & Transport", components: ["SD-WAN edge appliances", "Dual internet/DIA underlay", "MPLS coexistence during migration", "Cloud on-ramps"], rationale: "Application-aware routing with graceful exit from legacy circuits." },
      { name: "Campus & Access", components: ["Wi-Fi 6E access points", "Access/distribution switching", "802.1X NAC", "Cloud network management"], rationale: "Single-pane cloud management reduces per-site engineering effort." },
      { name: "Collaboration", components: ["Cloud UC&C platform", "SBC / PSTN breakout", "Meeting room devices", "Number porting & dial plans"], rationale: "Consolidates voice estates onto one cloud platform with local breakout." },
      { name: "Security & Operations", components: ["SASE / ZTNA", "Managed SOC integration", "Network observability & AIOps", "ITSM integration"], rationale: "Identity-based access and proactive operations from day one." },
    ],
    integrations: ["ITSM platform (incident/change/CMDB)", "Identity provider (SSO / conditional access)", "SIEM / managed SOC feed", "Monitoring & AIOps toolchain"],
    techStack: ["SD-WAN", "SASE/ZTNA", "Wi-Fi 6E", "Cloud UC&C", "SBC", "NAC", "AIOps", "ITIL 4"],
    costs: [
      { item: "Discovery, HLD & LLD design", category: "Services", share: 0.10, effortRate: 900 },
      { item: "SD-WAN & security hardware/licences", category: "Hardware", share: 0.26 },
      { item: "Campus LAN / Wi-Fi refresh equipment", category: "Hardware", share: 0.16 },
      { item: "UC&C licensing & SBC", category: "Software", share: 0.10 },
      { item: "Site deployment & migration services", category: "Services", share: 0.20, effortRate: 850 },
      { item: "Programme & service transition management", category: "Services", share: 0.10, effortRate: 1000 },
      { item: "Hypercare & knowledge transfer (90 days)", category: "Managed Services", share: 0.08, effortRate: 800 },
    ],
    phases: [
      { name: "Mobilisation & Discovery", share: 0.10, milestones: ["Programme charter signed", "Site survey complete"], deliverables: ["Governance model", "Current-state assessment"] },
      { name: "Design & Procurement", share: 0.15, milestones: ["HLD/LLD approved", "Orders placed"], deliverables: ["Design pack", "Migration runbooks"] },
      { name: "Pilot Wave", share: 0.12, milestones: ["Pilot sites live", "Lessons-learned gate passed"], deliverables: ["Pilot report", "Refined runbook"] },
      { name: "Deployment Waves", share: 0.43, milestones: ["50% sites migrated", "Final site cutover"], deliverables: ["As-built docs per wave", "Wave acceptance certificates"] },
      { name: "Legacy Decommission", share: 0.10, milestones: ["MPLS circuits ceased"], deliverables: ["Decommission report", "Cost-saving confirmation"] },
      { name: "Hypercare & Transition", share: 0.10, milestones: ["Service acceptance", "NOC handover complete"], deliverables: ["Knowledge base", "Service transition sign-off"] },
    ],
    roles: [
      { role: "Programme Manager", count: 1, allocationPct: 100, phases: "1–6", location: "Onshore" },
      { role: "Solution Architect (Network)", count: 1, allocationPct: 80, phases: "1–3", location: "Onshore" },
      { role: "Security Architect", count: 1, allocationPct: 50, phases: "2–4", location: "Onshore" },
      { role: "UC&C Consultant", count: 1, allocationPct: 60, phases: "2–5", location: "Hybrid" },
      { role: "Deployment Engineers", count: 4, allocationPct: 100, phases: "3–5", location: "Hybrid" },
      { role: "Migration Coordinator", count: 1, allocationPct: 100, phases: "3–5", location: "Offshore" },
      { role: "Service Transition Manager", count: 1, allocationPct: 60, phases: "4–6", location: "Onshore" },
      { role: "NOC / Hypercare Analysts", count: 2, allocationPct: 100, phases: "6", location: "Offshore" },
    ],
    risks: [
      { risk: "Circuit delivery delays push wave schedule", category: "Delivery", p: 4, i: 4, mitigation: "Order underlay circuits at contract signature; maintain MPLS coexistence buffer", owner: "Programme Manager" },
      { risk: "Site cutover causes business disruption", category: "Technical", p: 2, i: 5, mitigation: "Out-of-hours cutovers with tested rollback runbooks per site", owner: "Migration Coordinator" },
      { risk: "Incumbent exit / contract expiry collision", category: "Commercial", p: 3, i: 4, mitigation: "Front-load critical sites; negotiate short incumbent extension option", owner: "Programme Manager" },
      { risk: "Hardware supply-chain lead times", category: "Delivery", p: 3, i: 4, mitigation: "Bulk order after pilot gate; approve alternate SKUs in design", owner: "Solution Architect" },
      { risk: "Voice porting failures at go-live", category: "Technical", p: 3, i: 3, mitigation: "Port in batches with parallel-run window and fallback routing", owner: "UC&C Consultant" },
      { risk: "Internal NOC not ready to accept service", category: "People", p: 3, i: 3, mitigation: "Shadowing from deployment waves; competency gate before handover", owner: "Service Transition Manager" },
      { risk: "Scope creep from per-site variations", category: "Commercial", p: 4, i: 3, mitigation: "Standard site archetypes with formal change control for deviations", owner: "Programme Manager" },
    ],
    horizons: [
      { label: "Mobilise & Prove", objectives: ["Stand up governance and joint delivery team", "Complete design and pilot wave", "Validate migration runbook"], outcomes: ["De-risked deployment model", "Executive confidence gate passed"] },
      { label: "Scale & Migrate", objectives: ["Execute deployment waves by region", "Migrate voice and collaboration per wave", "Progressively enable SASE policies"], outcomes: ["All sites on target platform", "Legacy cost run-off begins"] },
      { label: "Optimise & Operate", objectives: ["Decommission legacy circuits", "Tune AIOps baselines and SLAs", "Complete knowledge transfer to NOC"], outcomes: ["Steady-state operations at target SLA", "Realised OPEX savings"] },
    ],
    quickWins: ["Pilot sites live within first quarter", "Immediate visibility via cloud dashboards", "Early SASE rollout for remote users"],
  },

  cloud: {
    label: "Datacentre-to-cloud migration",
    overview:
      "A landing-zone-first migration factory: discover and rationalise the estate, build a secure multi-account cloud foundation, then migrate in move-groups using the 6R treatment model, finishing with FinOps-driven optimisation and datacentre exit.",
    layers: [
      { name: "Cloud Foundation", components: ["Landing zone / account structure", "Network & hybrid connectivity", "IAM & guardrails", "Logging & monitoring baseline"], rationale: "Secure, compliant foundation before any workload moves." },
      { name: "Migration Factory", components: ["Discovery & dependency mapping", "6R disposition engine", "Replication tooling", "Cutover automation"], rationale: "Repeatable move-group process drives predictable velocity." },
      { name: "Application & Data", components: ["Database migration services", "Refactor candidates backlog", "Data platform target", "Backup & DR patterns"], rationale: "Treats data gravity and modernisation candidates explicitly." },
      { name: "Operations & FinOps", components: ["Cloud operating model", "Cost tagging & budgets", "SRE/observability", "ITSM integration"], rationale: "Run-state discipline captures the business case savings." },
    ],
    integrations: ["Identity provider / SSO", "ITSM & CMDB sync", "SIEM / security operations", "CI/CD toolchain"],
    techStack: ["AWS/Azure landing zone", "IaC (Terraform)", "Migration tooling", "Kubernetes/containers", "DBMS migration", "FinOps", "Observability"],
    costs: [
      { item: "Discovery & migration assessment", category: "Services", share: 0.10, effortRate: 950 },
      { item: "Landing zone & security foundation build", category: "Services", share: 0.14, effortRate: 1000 },
      { item: "Migration factory execution (move groups)", category: "Services", share: 0.32, effortRate: 850 },
      { item: "Cloud consumption during migration", category: "Software", share: 0.14 },
      { item: "Tooling & licences (migration, IaC, observability)", category: "Software", share: 0.08 },
      { item: "Programme management & governance", category: "Services", share: 0.10, effortRate: 1000 },
      { item: "Hypercare & operating model handover", category: "Managed Services", share: 0.07, effortRate: 800 },
    ],
    phases: [
      { name: "Assess & Mobilise", share: 0.14, milestones: ["Portfolio disposition agreed", "Business case baselined"], deliverables: ["Discovery report", "Migration wave plan"] },
      { name: "Foundation Build", share: 0.16, milestones: ["Landing zone live", "Security sign-off"], deliverables: ["Landing zone", "Operating model v1"] },
      { name: "Pilot Move Group", share: 0.12, milestones: ["First workloads live in cloud"], deliverables: ["Pilot retrospective", "Factory playbook"] },
      { name: "Migration Waves", share: 0.40, milestones: ["50% workloads migrated", "Final wave complete"], deliverables: ["Cutover reports", "Updated CMDB"] },
      { name: "Optimise & Exit", share: 0.18, milestones: ["Datacentre exit", "FinOps targets met"], deliverables: ["DC exit certificate", "Optimisation report"] },
    ],
    roles: [
      { role: "Programme Manager", count: 1, allocationPct: 100, phases: "1–5", location: "Onshore" },
      { role: "Cloud Architect", count: 1, allocationPct: 100, phases: "1–4", location: "Onshore" },
      { role: "Security & Compliance Lead", count: 1, allocationPct: 50, phases: "2–4", location: "Onshore" },
      { role: "Migration Engineers", count: 4, allocationPct: 100, phases: "3–4", location: "Offshore" },
      { role: "Database Specialist", count: 1, allocationPct: 80, phases: "3–4", location: "Offshore" },
      { role: "DevOps / IaC Engineer", count: 2, allocationPct: 100, phases: "2–5", location: "Hybrid" },
      { role: "FinOps Analyst", count: 1, allocationPct: 40, phases: "4–5", location: "Offshore" },
      { role: "Service Transition Manager", count: 1, allocationPct: 50, phases: "4–5", location: "Onshore" },
    ],
    risks: [
      { risk: "Undiscovered application dependencies break cutovers", category: "Technical", p: 4, i: 4, mitigation: "Automated dependency mapping plus pre-cutover rehearsal per move group", owner: "Cloud Architect" },
      { risk: "Cloud spend exceeds business case during dual-run", category: "Commercial", p: 4, i: 3, mitigation: "FinOps guardrails, budgets and aggressive decommissioning cadence", owner: "FinOps Analyst" },
      { risk: "Data migration integrity issues", category: "Technical", p: 3, i: 5, mitigation: "Checksum validation, parallel-run and defined rollback per database", owner: "Database Specialist" },
      { risk: "Compliance/regulatory constraints on data residency", category: "Security", p: 3, i: 4, mitigation: "Region strategy and control mapping approved before wave planning", owner: "Security Lead" },
      { risk: "Application owners unavailable for testing windows", category: "People", p: 4, i: 3, mitigation: "Wave calendar published a quarter ahead with executive sponsorship", owner: "Programme Manager" },
      { risk: "Legacy licences not portable to cloud", category: "Commercial", p: 3, i: 3, mitigation: "Licence position review during assessment; BYOL vs marketplace analysis", owner: "Programme Manager" },
    ],
    horizons: [
      { label: "Foundation", objectives: ["Complete discovery and disposition", "Build secure landing zone", "Prove factory with pilot group"], outcomes: ["Migration-ready platform", "Validated velocity assumptions"] },
      { label: "Migration at Scale", objectives: ["Run wave cadence", "Decommission source infrastructure per wave", "Stand up cloud operations"], outcomes: ["Majority of estate migrated", "Shrinking DC footprint"] },
      { label: "Optimise & Modernise", objectives: ["Exit datacentre", "Right-size and commit-purchase", "Start refactor backlog"], outcomes: ["Business case savings realised", "Modernisation pipeline live"] },
    ],
    quickWins: ["Landing zone live in first 60 days", "Immediate cost visibility via tagging", "Low-risk pilot workloads in cloud early"],
  },

  erp: {
    label: "ERP / enterprise application implementation",
    overview:
      "A fit-to-standard implementation: adopt the platform's leading practices, keep customisation to a governed minimum, migrate data through iterative mock loads, and land change with a structured adoption programme and phased go-live.",
    layers: [
      { name: "Application Core", components: ["ERP modules (finance, SCM, HR as scoped)", "Fit-to-standard configuration", "Extension framework", "Workflow & approvals"], rationale: "Standard-first keeps upgrade path and TCO under control." },
      { name: "Data & Migration", components: ["Data profiling & cleansing", "Mock load cycles", "Master data governance", "Cutover data factory"], rationale: "Data quality is the top cause of ERP go-live failure." },
      { name: "Integration", components: ["iPaaS / middleware", "API catalogue", "Legacy coexistence interfaces", "B2B/EDI where required"], rationale: "Decoupled integration layer isolates ERP from legacy churn." },
      { name: "Adoption & Operations", components: ["Role-based training", "Change network", "Hypercare model", "AMS handover"], rationale: "Benefits arrive through adoption, not go-live." },
    ],
    integrations: ["Identity / SSO", "Banking & payment interfaces", "Legacy systems coexistence", "Reporting / BI platform"],
    techStack: ["Cloud ERP", "iPaaS", "ETL/data migration tooling", "Test automation", "BI/analytics", "ITSM"],
    costs: [
      { item: "Fit-to-standard workshops & design", category: "Services", share: 0.14, effortRate: 1100 },
      { item: "Configuration & extensions build", category: "Services", share: 0.24, effortRate: 950 },
      { item: "Data migration & integration", category: "Services", share: 0.16, effortRate: 900 },
      { item: "Software subscriptions (yr 1)", category: "Software", share: 0.18 },
      { item: "Testing (SIT/UAT) & cutover", category: "Services", share: 0.10, effortRate: 800 },
      { item: "Change management & training", category: "Services", share: 0.08, effortRate: 850 },
      { item: "Hypercare & AMS transition", category: "Managed Services", share: 0.06, effortRate: 800 },
    ],
    phases: [
      { name: "Prepare & Explore", share: 0.15, milestones: ["Fit-to-standard complete", "Backlog baselined"], deliverables: ["Solution blueprint", "Delta requirements"] },
      { name: "Realise (Build Sprints)", share: 0.35, milestones: ["Config complete", "Mock data load 2 passed"], deliverables: ["Configured system", "Integration suite"] },
      { name: "Test", share: 0.20, milestones: ["SIT exit", "UAT sign-off"], deliverables: ["Test evidence pack", "Defect burn-down"] },
      { name: "Deploy & Cutover", share: 0.12, milestones: ["Go/no-go passed", "Go-live"], deliverables: ["Cutover plan executed", "Production system"] },
      { name: "Hypercare & Stabilise", share: 0.18, milestones: ["Exit criteria met", "AMS handover"], deliverables: ["Stabilisation report", "Support model live"] },
    ],
    roles: [
      { role: "Programme Manager", count: 1, allocationPct: 100, phases: "1–5", location: "Onshore" },
      { role: "Solution Architect (ERP)", count: 1, allocationPct: 100, phases: "1–4", location: "Onshore" },
      { role: "Functional Consultants", count: 3, allocationPct: 100, phases: "1–4", location: "Hybrid" },
      { role: "Technical / Integration Developers", count: 3, allocationPct: 100, phases: "2–4", location: "Offshore" },
      { role: "Data Migration Lead", count: 1, allocationPct: 100, phases: "2–4", location: "Offshore" },
      { role: "Test Manager", count: 1, allocationPct: 80, phases: "3–4", location: "Hybrid" },
      { role: "Change & Training Lead", count: 1, allocationPct: 60, phases: "2–5", location: "Onshore" },
      { role: "Hypercare Analysts", count: 2, allocationPct: 100, phases: "5", location: "Offshore" },
    ],
    risks: [
      { risk: "Customisation demand erodes fit-to-standard", category: "Delivery", p: 4, i: 4, mitigation: "Design authority with executive-level exception approval only", owner: "Solution Architect" },
      { risk: "Poor legacy data quality delays migration", category: "Technical", p: 4, i: 4, mitigation: "Early profiling, business-owned cleansing, three mock load cycles", owner: "Data Migration Lead" },
      { risk: "Key business SMEs over-committed", category: "People", p: 4, i: 3, mitigation: "Named SMEs with backfill funded in business case", owner: "Programme Manager" },
      { risk: "UAT reveals process gaps late", category: "Delivery", p: 3, i: 4, mitigation: "Business simulation days during Realise, not just at UAT", owner: "Test Manager" },
      { risk: "Adoption failure post go-live", category: "People", p: 3, i: 4, mitigation: "Change network, role-based training and floor-walker hypercare", owner: "Change Lead" },
      { risk: "Integration to legacy systems unstable", category: "Technical", p: 3, i: 3, mitigation: "Interface freeze windows and contract-first API design", owner: "Solution Architect" },
    ],
    horizons: [
      { label: "Design & Build", objectives: ["Lock fit-to-standard scope", "Configure core and build integrations", "Prove data migration in mock loads"], outcomes: ["Build-complete system", "Predictable cutover path"] },
      { label: "Prove & Launch", objectives: ["Exit SIT/UAT on quality gates", "Execute rehearsed cutover", "Stabilise through hypercare"], outcomes: ["Live on new platform", "Stable operations"] },
      { label: "Adopt & Extend", objectives: ["Drive adoption metrics", "Release enhancement backlog", "Optimise processes on new baseline"], outcomes: ["Benefits realisation tracked", "Continuous improvement cadence"] },
    ],
    quickWins: ["Process pain-point fixes in first release", "Single sign-on from day one", "Real-time reporting replacing spreadsheets"],
  },

  data: {
    label: "Data platform & AI enablement",
    overview:
      "A use-case-led data and AI programme: build a governed lakehouse foundation, industrialise ingestion from priority sources, and deliver AI/analytics products in quarterly increments — with responsible-AI guardrails and MLOps discipline from the first model.",
    layers: [
      { name: "Data Foundation", components: ["Lakehouse (bronze/silver/gold)", "Batch & streaming ingestion", "Data quality framework", "Catalogue & lineage"], rationale: "Trusted, discoverable data precedes every AI ambition." },
      { name: "Governance & Security", components: ["Access controls & masking", "Data ownership model", "Responsible AI policy", "Compliance controls"], rationale: "Governance built-in, not bolted on after incidents." },
      { name: "Analytics & AI", components: ["BI semantic layer", "ML feature store", "LLM/RAG services", "Experimentation platform"], rationale: "Shared services let each use case ship faster than the last." },
      { name: "MLOps & Operations", components: ["Model registry & CI/CD", "Monitoring & drift detection", "Cost governance", "Product support model"], rationale: "Models in production need the same rigour as applications." },
    ],
    integrations: ["Core business systems (ERP/CRM)", "Identity provider", "ITSM for data incidents", "Existing BI estate"],
    techStack: ["Lakehouse (Databricks/Snowflake class)", "dbt/ELT", "Python/Spark", "LLM APIs & RAG", "MLOps tooling", "BI platform"],
    costs: [
      { item: "Data strategy & use-case prioritisation", category: "Services", share: 0.08, effortRate: 1100 },
      { item: "Platform foundation build", category: "Services", share: 0.18, effortRate: 1000 },
      { item: "Ingestion & data product engineering", category: "Services", share: 0.24, effortRate: 900 },
      { item: "AI/ML use-case delivery", category: "Services", share: 0.20, effortRate: 1000 },
      { item: "Platform & tooling subscriptions (yr 1)", category: "Software", share: 0.16 },
      { item: "Programme management & governance", category: "Services", share: 0.08, effortRate: 1000 },
      { item: "Enablement & handover", category: "Managed Services", share: 0.06, effortRate: 850 },
    ],
    phases: [
      { name: "Strategy & Foundations", share: 0.18, milestones: ["Use-case roadmap approved", "Platform live"], deliverables: ["Data strategy", "Governed lakehouse v1"] },
      { name: "First Data Products", share: 0.22, milestones: ["Priority sources ingested", "First dashboards live"], deliverables: ["Certified datasets", "BI semantic layer"] },
      { name: "AI Use Case Wave 1", share: 0.25, milestones: ["First model/RAG service in production"], deliverables: ["Production AI service", "MLOps pipeline"] },
      { name: "AI Use Case Wave 2", share: 0.20, milestones: ["Second wave live", "Value tracking baselined"], deliverables: ["Additional AI products", "Benefits dashboard"] },
      { name: "Scale & Handover", share: 0.15, milestones: ["Internal team certified", "Operating model live"], deliverables: ["Playbooks", "Capability transfer"] },
    ],
    roles: [
      { role: "Programme Manager", count: 1, allocationPct: 80, phases: "1–5", location: "Onshore" },
      { role: "Data / AI Architect", count: 1, allocationPct: 100, phases: "1–4", location: "Onshore" },
      { role: "Data Engineers", count: 3, allocationPct: 100, phases: "1–4", location: "Offshore" },
      { role: "ML / GenAI Engineers", count: 2, allocationPct: 100, phases: "3–4", location: "Hybrid" },
      { role: "Analytics Engineer / BI", count: 1, allocationPct: 100, phases: "2–4", location: "Offshore" },
      { role: "Data Governance Lead", count: 1, allocationPct: 50, phases: "1–5", location: "Onshore" },
      { role: "MLOps Engineer", count: 1, allocationPct: 80, phases: "3–5", location: "Offshore" },
    ],
    risks: [
      { risk: "Source data quality blocks AI use cases", category: "Technical", p: 4, i: 4, mitigation: "Data quality gates and business data ownership from phase 1", owner: "Governance Lead" },
      { risk: "AI use cases chosen by hype, not value", category: "Delivery", p: 3, i: 4, mitigation: "Value/feasibility scoring with executive product owner per use case", owner: "Programme Manager" },
      { risk: "Model behaviour / hallucination in production", category: "Technical", p: 3, i: 4, mitigation: "Evaluation harness, human-in-the-loop and guardrail policies", owner: "AI Architect" },
      { risk: "Regulatory/privacy exposure in training data", category: "Security", p: 3, i: 5, mitigation: "Responsible AI review, masking and DPIA before each use case", owner: "Governance Lead" },
      { risk: "Platform consumption cost overrun", category: "Commercial", p: 4, i: 3, mitigation: "Workload budgets, auto-suspend policies and monthly FinOps review", owner: "MLOps Engineer" },
      { risk: "Client team unable to sustain platform post-handover", category: "People", p: 3, i: 3, mitigation: "Paired delivery and certification-based capability transfer", owner: "Programme Manager" },
    ],
    horizons: [
      { label: "Foundation & Trust", objectives: ["Stand up governed platform", "Ingest priority domains", "Publish first certified data products"], outcomes: ["Single source of truth emerging", "Analytics self-service begins"] },
      { label: "AI in Production", objectives: ["Ship first AI use cases with MLOps", "Prove measurable value", "Harden responsible-AI controls"], outcomes: ["Working AI products", "Quantified ROI evidence"] },
      { label: "Scale & Self-Sufficiency", objectives: ["Expand use-case portfolio", "Transfer capability to internal team", "Institutionalise data product operating model"], outcomes: ["AI delivery as routine capability", "Reduced dependency on partner"] },
    ],
    quickWins: ["Executive KPI dashboard in first quarter", "One high-visibility GenAI assistant early", "Retiring manual reporting effort"],
  },

  itsm: {
    label: "ITSM / service management transformation",
    overview:
      "An ITIL 4 aligned service management transformation: rationalise the practice landscape, implement a modern ITSM platform with a clean CMDB, automate high-volume workflows, and layer AIOps and self-service to shift left and cut cost-per-ticket.",
    layers: [
      { name: "Practices & Process", components: ["Incident/Problem/Change redesign", "Request catalogue", "SLM & XLA framework", "Knowledge management"], rationale: "ITIL 4 value streams before tooling avoids paving cow paths." },
      { name: "Platform", components: ["Modern ITSM platform", "CMDB & discovery", "Service portal", "Workflow automation"], rationale: "Single system of record for services and assets." },
      { name: "Automation & AI", components: ["Virtual agent / AI triage", "Auto-remediation runbooks", "AIOps event correlation", "Predictive alerting"], rationale: "Shift-left automation is where the savings live." },
      { name: "Adoption & Governance", components: ["Process ownership model", "CSI register", "Training & certification", "Performance dashboards"], rationale: "Sustained maturity needs owners, not just go-live." },
    ],
    integrations: ["Monitoring / observability tools", "Identity provider & HR feed", "Asset & endpoint management", "Collaboration platform (chat-based support)"],
    techStack: ["ITSM platform (ServiceNow class)", "CMDB/discovery", "AIOps", "Virtual agent / GenAI", "RPA/workflow", "Dashboards"],
    costs: [
      { item: "Assessment & process design", category: "Services", share: 0.12, effortRate: 1000 },
      { item: "Platform implementation & configuration", category: "Services", share: 0.26, effortRate: 900 },
      { item: "CMDB, discovery & integrations", category: "Services", share: 0.14, effortRate: 900 },
      { item: "Automation & AI use cases", category: "Services", share: 0.14, effortRate: 950 },
      { item: "Platform licences (yr 1)", category: "Software", share: 0.20 },
      { item: "Training & adoption", category: "Services", share: 0.07, effortRate: 800 },
      { item: "Hypercare & managed CSI", category: "Managed Services", share: 0.07, effortRate: 800 },
    ],
    phases: [
      { name: "Assess & Design", share: 0.16, milestones: ["Maturity baseline", "Target processes approved"], deliverables: ["Assessment report", "Process design pack"] },
      { name: "Platform Build", share: 0.28, milestones: ["Core modules configured", "Integrations live in test"], deliverables: ["Configured platform", "Integration suite"] },
      { name: "CMDB & Data", share: 0.16, milestones: ["Discovery deployed", "CI classes populated"], deliverables: ["Trusted CMDB", "Service maps"] },
      { name: "Go-Live & Adoption", share: 0.18, milestones: ["Platform live", "Legacy tool retired"], deliverables: ["Production platform", "Trained user base"] },
      { name: "Automate & Optimise", share: 0.22, milestones: ["Virtual agent live", "Deflection targets met"], deliverables: ["Automation library", "CSI register & dashboards"] },
    ],
    roles: [
      { role: "Programme / Engagement Manager", count: 1, allocationPct: 80, phases: "1–5", location: "Onshore" },
      { role: "ITSM Process Consultant (ITIL 4)", count: 1, allocationPct: 100, phases: "1–4", location: "Onshore" },
      { role: "Platform Architect", count: 1, allocationPct: 100, phases: "2–5", location: "Hybrid" },
      { role: "Platform Developers", count: 3, allocationPct: 100, phases: "2–5", location: "Offshore" },
      { role: "CMDB / Discovery Specialist", count: 1, allocationPct: 100, phases: "3–4", location: "Offshore" },
      { role: "AI / Automation Engineer", count: 1, allocationPct: 100, phases: "5", location: "Hybrid" },
      { role: "OCM & Training Lead", count: 1, allocationPct: 50, phases: "3–5", location: "Onshore" },
    ],
    risks: [
      { risk: "Lift-and-shift of broken processes into new tool", category: "Delivery", p: 4, i: 4, mitigation: "Process redesign gate before configuration begins", owner: "Process Consultant" },
      { risk: "CMDB data quality undermines trust", category: "Technical", p: 4, i: 4, mitigation: "Phased CI class rollout with certification and ownership", owner: "CMDB Specialist" },
      { risk: "Agent resistance to new ways of working", category: "People", p: 3, i: 3, mitigation: "Early agent champions, role-based training, XLA feedback loop", owner: "OCM Lead" },
      { risk: "Over-customisation blocks platform upgrades", category: "Technical", p: 3, i: 4, mitigation: "Out-of-box first policy with design authority exceptions", owner: "Platform Architect" },
      { risk: "Legacy tool decommission slips, doubling cost", category: "Commercial", p: 3, i: 3, mitigation: "Decommission date in plan with executive owner", owner: "Engagement Manager" },
      { risk: "Automation targets not met post go-live", category: "Delivery", p: 3, i: 3, mitigation: "Deflection/automation KPIs in managed CSI phase with monthly review", owner: "Automation Engineer" },
    ],
    horizons: [
      { label: "Stabilise & Standardise", objectives: ["Baseline maturity and redesign core practices", "Implement platform core", "Establish trusted CMDB"], outcomes: ["Single system of record", "Consistent service operations"] },
      { label: "Automate & Shift Left", objectives: ["Deploy virtual agent and self-service", "Automate top request/incident volumes", "Correlate events via AIOps"], outcomes: ["Rising deflection rate", "Falling cost-per-ticket"] },
      { label: "Optimise & Delight", objectives: ["Move from SLA to XLA measurement", "Predictive operations", "Continuous improvement cadence"], outcomes: ["Experience-led IT", "Self-funding CSI pipeline"] },
    ],
    quickWins: ["Service portal + top-10 catalogue items early", "Password reset automation in month one", "Executive service health dashboard"],
  },

  security: {
    label: "Cybersecurity uplift / zero trust",
    overview:
      "A risk-prioritised security uplift: baseline against a recognised framework, close the highest-impact gaps first, deploy zero-trust access and modern detection/response, and transition into a measurable, continuously-tested security operating model.",
    layers: [
      { name: "Identity & Access", components: ["MFA everywhere", "Conditional access / ZTNA", "PAM for privileged accounts", "Joiner-mover-leaver automation"], rationale: "Identity is the modern perimeter; most breaches start here." },
      { name: "Detection & Response", components: ["EDR/XDR rollout", "SIEM & managed SOC", "Playbooks / SOAR", "Threat intel feeds"], rationale: "Assume breach; compress detection and response times." },
      { name: "Data & Infrastructure", components: ["Data classification & DLP", "Vulnerability management", "Cloud security posture (CSPM)", "Backup immutability"], rationale: "Protects the assets attackers actually monetise." },
      { name: "Governance & Resilience", components: ["Policy & standards refresh", "Security awareness programme", "IR plan & tabletop exercises", "Compliance reporting"], rationale: "Sustained posture requires governance and rehearsed response." },
    ],
    integrations: ["Identity provider", "ITSM (security incidents/changes)", "Endpoint management", "Cloud platforms (CSPM feeds)"],
    techStack: ["ZTNA/SASE", "EDR/XDR", "SIEM/SOAR", "PAM", "DLP", "CSPM", "Vulnerability management"],
    costs: [
      { item: "Security assessment & roadmap (framework-based)", category: "Services", share: 0.10, effortRate: 1100 },
      { item: "Identity & zero-trust implementation", category: "Services", share: 0.18, effortRate: 1000 },
      { item: "Detection & response deployment (EDR/SIEM)", category: "Services", share: 0.18, effortRate: 950 },
      { item: "Security tooling licences (yr 1)", category: "Software", share: 0.28 },
      { item: "Data protection & hardening workstream", category: "Services", share: 0.10, effortRate: 950 },
      { item: "Programme management & governance", category: "Services", share: 0.08, effortRate: 1000 },
      { item: "Managed SOC onboarding & hypercare", category: "Managed Services", share: 0.08, effortRate: 850 },
    ],
    phases: [
      { name: "Assess & Prioritise", share: 0.14, milestones: ["Framework baseline complete", "Roadmap approved"], deliverables: ["Gap assessment", "Risk-ranked roadmap"] },
      { name: "Quick-Win Hardening", share: 0.14, milestones: ["MFA coverage complete", "Critical vulns remediated"], deliverables: ["Hardening report", "Updated policies"] },
      { name: "Zero Trust & Identity", share: 0.24, milestones: ["ZTNA live", "PAM onboarded"], deliverables: ["Conditional access model", "Privileged access controls"] },
      { name: "Detect & Respond", share: 0.26, milestones: ["EDR fleet-wide", "SOC service live"], deliverables: ["SIEM use cases", "IR playbooks"] },
      { name: "Operate & Assure", share: 0.22, milestones: ["Tabletop exercise passed", "Posture targets met"], deliverables: ["Metrics dashboard", "Continuous testing cadence"] },
    ],
    roles: [
      { role: "Programme Manager", count: 1, allocationPct: 80, phases: "1–5", location: "Onshore" },
      { role: "Security Architect", count: 1, allocationPct: 100, phases: "1–4", location: "Onshore" },
      { role: "Identity Engineer", count: 2, allocationPct: 100, phases: "2–3", location: "Hybrid" },
      { role: "Security Engineers (EDR/SIEM)", count: 2, allocationPct: 100, phases: "3–4", location: "Offshore" },
      { role: "GRC Consultant", count: 1, allocationPct: 60, phases: "1–5", location: "Onshore" },
      { role: "SOC Transition Lead", count: 1, allocationPct: 60, phases: "4–5", location: "Hybrid" },
    ],
    risks: [
      { risk: "User friction from MFA/ZTNA rollout drives shadow IT", category: "People", p: 4, i: 3, mitigation: "Phased rollout with pilot groups, comms and exception process", owner: "Identity Engineer" },
      { risk: "Alert fatigue from poorly tuned SIEM", category: "Technical", p: 4, i: 3, mitigation: "Use-case-driven detection engineering with tuning sprints", owner: "Security Engineer" },
      { risk: "Legacy systems incompatible with modern controls", category: "Technical", p: 3, i: 4, mitigation: "Compensating controls and segmentation for legacy estate", owner: "Security Architect" },
      { risk: "Active incident during transformation", category: "Security", p: 2, i: 5, mitigation: "Interim IR retainer and playbooks live from phase 1", owner: "SOC Transition Lead" },
      { risk: "Tool sprawl inflates run cost", category: "Commercial", p: 3, i: 3, mitigation: "Platform consolidation review in design; retire overlapping tools", owner: "Programme Manager" },
      { risk: "Compliance deadlines slip against audit calendar", category: "Delivery", p: 3, i: 4, mitigation: "Map roadmap to audit dates; evidence collection built into delivery", owner: "GRC Consultant" },
    ],
    horizons: [
      { label: "Reduce Exposure", objectives: ["Baseline against framework", "Close critical gaps", "MFA and patching discipline"], outcomes: ["Attack surface visibly reduced", "Board-level risk clarity"] },
      { label: "Modernise Controls", objectives: ["Zero-trust access model", "Fleet-wide detection & managed SOC", "Data protection controls"], outcomes: ["Assume-breach posture operational", "Measured detection/response times"] },
      { label: "Assure & Sustain", objectives: ["Test response via exercises", "Continuous posture measurement", "Security-aware culture programme"], outcomes: ["Demonstrable resilience", "Audit-ready evidence on demand"] },
    ],
    quickWins: ["MFA on all remote access in 30 days", "Critical vulnerability purge", "Executive risk dashboard"],
  },
};

/* ── Local generation engine (no API, no cost) ──────────────── */
function generate(form, settings) {
  const bp = BLUEPRINTS[form.type];
  const cur = settings.currency;
  const fx = settings.fx || CURRENCIES[cur].fx;
  const rateMult = 1 + (settings.ratePct || 0) / 100;
  const roundC = (n) => Math.round(n / CURRENCIES[cur].round) * CURRENCIES[cur].round;
  const budget = BUDGET_MID[form.budget] * fx;
  const weeks = TIMELINE_WEEKS[form.timeline];
  const working = budget / 1.1; // reserve ~10% for contingency inside band

  const architecture = {
    overview: bp.overview,
    layers: bp.layers,
    integrations: bp.integrations,
    techStack: bp.techStack,
  };

  const lineItems = bp.costs.map((c) => {
    const cost = roundC(working * c.share);
    const rate = c.effortRate ? Math.round(c.effortRate * fx * rateMult) : null;
    return {
      item: c.item,
      category: c.category,
      rate,
      effortDays: rate ? Math.round(cost / rate) : 0,
      cost,
    };
  });
  const costs = {
    currency: cur,
    lineItems,
    contingencyPct: 10,
    basis: {
      band: form.budget,
      steps: [
        `Anchor: mid-point of the selected budget band (${form.budget}) = ${fmtMoney(budget, cur)}${cur !== "USD" ? ` — converted at ${fx} ${cur}/USD (editable in commercial settings)` : ""}.`,
        `Working budget: anchor ÷ 1.10 = ${fmtMoney(roundC(working), cur)}, reserving 10% for contingency within the band.`,
        `Line items: each workstream takes a fixed share of the working budget from the ${bp.label} blueprint (shown as % in the table), rounded to sensible ${cur} increments. Every figure is click-to-edit.`,
        `Effort days: for services lines, cost ÷ blended day rate for that workstream${settings.ratePct ? ` — day rates adjusted ${settings.ratePct > 0 ? "+" : ""}${settings.ratePct}% via commercial settings` : ""}. Hardware/software lines carry no effort.`,
        "Contingency: 10% of the subtotal (editable), bringing the total back to the band mid-point.",
      ],
    },
    assumptions: [
      `Sizing anchored to the mid-point of the ${form.budget} band; refined after due diligence`,
      "Client provides site/system access, SMEs and timely approvals per RACI",
      "Travel, taxes and third-party carrier/vendor pass-through charges excluded",
      "Rates blended across onshore/offshore delivery model",
    ],
  };

  const phases = bp.phases.map((p) => ({
    name: p.name,
    durationWeeks: Math.max(2, Math.round(weeks * p.share)),
    milestones: p.milestones,
    deliverables: p.deliverables,
  }));
  const plan = { phases };

  const totalWeeks = phases.reduce((s, p) => s + p.durationWeeks, 0);
  const serviceDays = lineItems.reduce((s, x) => s + x.effortDays, 0);
  const peakFte = bp.roles.reduce((s, r) => s + r.count * (r.allocationPct / 100), 0);
  const locFte = { Onshore: 0, Offshore: 0, Hybrid: 0 };
  bp.roles.forEach((r) => (locFte[r.location] += r.count * (r.allocationPct / 100)));
  const pct = (v) => Math.round((v / peakFte) * 100);
  const resources = {
    model: `Blended onshore/offshore delivery model led by an onshore engagement team, scaled for a ~${Math.round(weeks / 4.3)}-month programme in ${form.region || "the target region"}.`,
    roles: bp.roles,
    basis: [
      `Team shape: the ${bp.label} blueprint defines the standard delivery team for this engagement type; counts scale with programme size, not linearly with budget.`,
      `Effort cross-check: the cost estimate carries ≈${serviceDays.toLocaleString()} service days; at ~${Math.round(peakFte * 10) / 10} FTE peak over ${totalWeeks} weeks, utilisation stays realistic because roles ramp up and down by phase rather than running end-to-end.`,
      `Allocation %: share of a full-time week each role commits during its assigned phases (e.g. 50% = ~2.5 days/week). Peak FTE = Σ(headcount × allocation) = ${Math.round(peakFte * 10) / 10}.`,
      `Location mix at peak: ${pct(locFte.Onshore)}% onshore (client-facing leadership, architecture, transition), ${pct(locFte.Offshore)}% offshore (engineering, migration, hypercare), ${pct(locFte.Hybrid)}% hybrid — this mix drives the blended day rates used in costing.`,
    ],
  };

  const risks = {
    risks: bp.risks.map((r, i) => ({
      id: `R${i + 1}`,
      risk: r.risk,
      category: r.category,
      probability: r.p,
      impact: r.i,
      mitigation: r.mitigation,
      owner: r.owner,
    })),
  };

  const third = Math.round(weeks / 3 / 4.3);
  const roadmap = {
    horizons: bp.horizons.map((h, i) => ({
      ...h,
      timeframe: `Months ${i * third + 1}–${(i + 1) * third}`,
    })),
    quickWins: bp.quickWins,
  };

  return { architecture, costs, plan, resources, risks, roadmap };
}

/* ── Agents (presentation layer) ────────────────────────────── */
const AGENTS = [
  { id: "architecture", name: "Solution Architect", deliverable: "Solution Architecture" },
  { id: "costs", name: "Commercial Estimator", deliverable: "Cost Estimation" },
  { id: "plan", name: "Programme Planner", deliverable: "Project Plan" },
  { id: "resources", name: "Resourcing Lead", deliverable: "Resource Plan" },
  { id: "risks", name: "Risk Officer", deliverable: "Risk Register" },
  { id: "roadmap", name: "Roadmap Strategist", deliverable: "Implementation Roadmap" },
];

/* ── UI atoms ───────────────────────────────────────────────── */
const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.inkSoft }}>{children}</div>
);
const Chip = ({ children }) => (
  <span className="inline-block px-2 py-1 mr-2 mb-2 rounded" style={{ background: T.paper, border: `1px solid ${T.hairline}`, fontFamily: T.mono, fontSize: 12, color: T.ink }}>
    {children}
  </span>
);
const fmtMoney = (n, c = "USD") =>
  new Intl.NumberFormat(CURRENCIES[c]?.locale || "en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n || 0);

/* Click-to-edit atoms */
function EdNum({ value, onCommit, format, style, width = 90 }) {
  const [e, setE] = useState(false);
  const [t, setT] = useState("");
  return e ? (
    <input
      autoFocus
      type="number"
      value={t}
      onChange={(ev) => setT(ev.target.value)}
      onBlur={() => { setE(false); const n = parseFloat(t); if (!isNaN(n)) onCommit(n); }}
      onKeyDown={(ev) => { if (ev.key === "Enter") ev.target.blur(); }}
      className="px-1 py-0 rounded"
      style={{ width, border: `1px solid ${T.petrol}`, fontFamily: T.mono, fontSize: 13, outline: "none" }}
    />
  ) : (
    <span onClick={() => { setT(String(value)); setE(true); }} title="Click to edit" style={{ borderBottom: "1px dashed #C9A46A", cursor: "pointer", ...style }}>
      {format ? format(value) : value}
    </span>
  );
}

function EdText({ value, onCommit, style, width = "100%" }) {
  const [e, setE] = useState(false);
  const [t, setT] = useState("");
  return e ? (
    <input
      autoFocus
      type="text"
      value={t}
      onChange={(ev) => setT(ev.target.value)}
      onBlur={() => { setE(false); if (t.trim()) onCommit(t.trim()); }}
      onKeyDown={(ev) => { if (ev.key === "Enter") ev.target.blur(); }}
      className="px-1 py-0 rounded"
      style={{ width, border: `1px solid ${T.petrol}`, fontSize: 13, outline: "none" }}
    />
  ) : (
    <span onClick={() => { setT(String(value)); setE(true); }} title="Click to edit" style={{ borderBottom: "1px dashed #C9A46A", cursor: "pointer", ...style }}>
      {value}
    </span>
  );
}

/* ── Section renderers ──────────────────────────────────────── */
function ArchView({ d }) {
  return (
    <div>
      <p className="mb-6 leading-relaxed" style={{ fontFamily: T.serif, fontSize: 18, color: T.ink }}>{d.overview}</p>
      <div className="space-y-3 mb-6">
        {d.layers.map((l, i) => (
          <div key={i} className="p-4 rounded" style={{ border: `1px solid ${T.hairline}`, borderLeft: `3px solid ${T.petrol}`, background: T.panel }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 600, color: T.ink }}>{l.name}</div>
              <div style={{ fontSize: 12, color: T.inkSoft, maxWidth: 420 }}>{l.rationale}</div>
            </div>
            <div>{l.components.map((c, j) => <Chip key={j}>{c}</Chip>)}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Eyebrow>Key integrations</Eyebrow>
          <ul className="mt-2 space-y-1">{d.integrations.map((x, i) => <li key={i} className="text-sm" style={{ color: T.ink }}>— {x}</li>)}</ul>
        </div>
        <div>
          <Eyebrow>Technology stack</Eyebrow>
          <div className="mt-2">{d.techStack.map((x, i) => <Chip key={i}>{x}</Chip>)}</div>
        </div>
      </div>
    </div>
  );
}

function CostView({ d, up }) {
  const sub = d.lineItems.reduce((s, x) => s + x.cost, 0);
  const cont = Math.round(sub * (d.contingencyPct / 100));
  const edit = (i, k) => (n) =>
    up((dr) => {
      dr.lineItems[i][k] = k === "item" ? n : Math.max(0, n);
      const li = dr.lineItems[i];
      li.effortDays = li.rate ? Math.round(li.cost / li.rate) : 0;
      return dr;
    });
  return (
    <div>
      <div className="overflow-x-auto rounded" style={{ border: `1px solid ${T.hairline}` }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.paper }}>
              {["Line item", "Category", "% of budget", "Day rate", "Effort (days)", "Cost"].map((h, i) => (
                <th key={i} className={`px-4 py-3 ${i >= 2 ? "text-right" : "text-left"}`} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, borderBottom: `1px solid ${T.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.lineItems.map((x, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.hairline}` }}>
                <td className="px-4 py-3" style={{ color: T.ink }}><EdText value={x.item} onCommit={edit(i, "item")} width={220} /></td>
                <td className="px-4 py-3" style={{ color: T.inkSoft, fontSize: 13 }}>{x.category}</td>
                <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono, color: T.inkSoft }}>{Math.round((x.cost / sub) * 100)}%</td>
                <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono, color: T.inkSoft }}>
                  {x.rate ? <EdNum value={x.rate} format={(v) => fmtMoney(v, d.currency)} onCommit={edit(i, "rate")} /> : "—"}
                </td>
                <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono }}>{x.effortDays || "—"}</td>
                <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono }}>
                  <EdNum value={x.cost} format={(v) => fmtMoney(v, d.currency)} onCommit={edit(i, "cost")} width={110} />
                </td>
              </tr>
            ))}
            <tr style={{ borderBottom: `1px solid ${T.hairline}` }}>
              <td className="px-4 py-3" colSpan={5} style={{ color: T.inkSoft }}>
                Contingency (<EdNum value={d.contingencyPct} onCommit={(n) => up((dr) => { dr.contingencyPct = Math.max(0, Math.min(50, n)); return dr; })} width={55} />%)
              </td>
              <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono }}>{fmtMoney(cont, d.currency)}</td>
            </tr>
            <tr style={{ background: T.amberBg }}>
              <td className="px-4 py-3" colSpan={5} style={{ fontFamily: T.serif, fontWeight: 700, color: T.ink }}>Total investment</td>
              <td className="px-4 py-3 text-right" style={{ fontFamily: T.mono, fontWeight: 700, fontSize: 16, color: T.ink }}>{fmtMoney(sub + cont, d.currency)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {d.basis && (
        <div className="mt-5 p-4 rounded" style={{ background: T.paper, border: `1px solid ${T.hairline}` }}>
          <Eyebrow>Basis of estimate — how these numbers are calculated</Eyebrow>
          <ol className="mt-2 space-y-1" style={{ listStyle: "decimal inside" }}>
            {d.basis.steps.map((s, i) => (
              <li key={i} className="text-sm" style={{ color: T.ink }}>{s}</li>
            ))}
          </ol>
        </div>
      )}
      <div className="mt-5">
        <Eyebrow>Commercial assumptions</Eyebrow>
        <ul className="mt-2 space-y-1">{d.assumptions.map((a, i) => <li key={i} className="text-sm" style={{ color: T.inkSoft }}>— {a}</li>)}</ul>
      </div>
    </div>
  );
}

function PlanView({ d, up }) {
  const total = d.phases.reduce((s, p) => s + p.durationWeeks, 0) || 1;
  let acc = 0;
  return (
    <div className="space-y-4">
      {d.phases.map((p, i) => {
        const left = (acc / total) * 100;
        const width = (p.durationWeeks / total) * 100;
        acc += p.durationWeeks;
        return (
          <div key={i} className="p-4 rounded" style={{ border: `1px solid ${T.hairline}`, background: T.panel }}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div style={{ fontFamily: T.serif, fontSize: 16, fontWeight: 600, color: T.ink }}>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.amber, marginRight: 8 }}>P{i + 1}</span>
                {p.name}
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkSoft }}>
                <EdNum value={p.durationWeeks} onCommit={(n) => up((dr) => { dr.phases[i].durationWeeks = Math.max(1, Math.round(n)); return dr; })} width={55} /> wks
              </div>
            </div>
            <div className="my-3 h-2 rounded-full relative" style={{ background: T.paper }}>
              <div className="absolute h-2 rounded-full" style={{ left: `${left}%`, width: `${Math.max(width, 3)}%`, background: T.petrol }} />
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <Eyebrow>Milestones</Eyebrow>
                {p.milestones.map((m, j) => <div key={j} className="mt-1" style={{ color: T.ink }}>◆ {m}</div>)}
              </div>
              <div>
                <Eyebrow>Deliverables</Eyebrow>
                {p.deliverables.map((m, j) => <div key={j} className="mt-1" style={{ color: T.ink }}>— {m}</div>)}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkSoft }}>Total duration · {total} weeks (~{Math.round(total / 4.3)} months)</div>
    </div>
  );
}

function ResourceView({ d, up }) {
  const fte = d.roles.reduce((s, r) => s + r.count * (r.allocationPct / 100), 0);
  return (
    <div>
      <p className="mb-5" style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>{d.model}</p>
      <div className="overflow-x-auto rounded" style={{ border: `1px solid ${T.hairline}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: T.paper }}>
              {["Role", "#", "Allocation", "Phases", "Location"].map((h, i) => (
                <th key={i} className={`px-4 py-3 ${i === 0 ? "text-left" : "text-center"}`} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, borderBottom: `1px solid ${T.hairline}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.roles.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.hairline}` }}>
                <td className="px-4 py-3" style={{ color: T.ink }}>{r.role}</td>
                <td className="px-4 py-3 text-center" style={{ fontFamily: T.mono }}>
                  <EdNum value={r.count} onCommit={(n) => up((dr) => { dr.roles[i].count = Math.max(1, Math.round(n)); return dr; })} width={50} />
                </td>
                <td className="px-4 py-3 text-center" style={{ fontFamily: T.mono }}>
                  <EdNum value={r.allocationPct} onCommit={(n) => up((dr) => { dr.roles[i].allocationPct = Math.max(5, Math.min(100, Math.round(n))); return dr; })} width={55} />%
                </td>
                <td className="px-4 py-3 text-center" style={{ fontFamily: T.mono }}>{r.phases}</td>
                <td className="px-4 py-3 text-center" style={{ color: T.inkSoft }}>{r.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3" style={{ fontFamily: T.mono, fontSize: 12, color: T.inkSoft }}>Blended team · ≈ {fte.toFixed(1)} FTE at peak</div>
      {d.basis && (
        <div className="mt-4 p-4 rounded" style={{ background: T.paper, border: `1px solid ${T.hairline}` }}>
          <Eyebrow>How this team was sized</Eyebrow>
          <ol className="mt-2 space-y-1" style={{ listStyle: "decimal inside" }}>
            {d.basis.map((s, i) => (
              <li key={i} className="text-sm" style={{ color: T.ink }}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function scoreColor(s) {
  if (s >= 15) return { bg: "#F6E3DF", fg: T.red };
  if (s >= 8) return { bg: T.amberBg, fg: T.amber };
  return { bg: "#E5F0E9", fg: T.green };
}

function RiskView({ d, up }) {
  const risks = [...d.risks].sort((a, b) => b.probability * b.impact - a.probability * a.impact);
  const editRisk = (id, k) => (n) =>
    up((dr) => {
      const r = dr.risks.find((x) => x.id === id);
      if (r) r[k] = k === "mitigation" ? n : Math.max(1, Math.min(5, Math.round(n)));
      return dr;
    });
  return (
    <div className="overflow-x-auto rounded" style={{ border: `1px solid ${T.hairline}` }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: T.paper }}>
            {["ID", "Risk", "Category", "P", "I", "Score", "Mitigation", "Owner"].map((h, i) => (
              <th key={i} className="px-3 py-3 text-left" style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkSoft, borderBottom: `1px solid ${T.hairline}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {risks.map((r, i) => {
            const s = r.probability * r.impact;
            const c = scoreColor(s);
            return (
              <tr key={i} style={{ borderBottom: `1px solid ${T.hairline}` }}>
                <td className="px-3 py-3" style={{ fontFamily: T.mono, color: T.inkSoft }}>{r.id}</td>
                <td className="px-3 py-3" style={{ color: T.ink, minWidth: 180 }}>{r.risk}</td>
                <td className="px-3 py-3" style={{ color: T.inkSoft, fontSize: 12 }}>{r.category}</td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: T.mono }}><EdNum value={r.probability} onCommit={editRisk(r.id, "probability")} width={45} /></td>
                <td className="px-3 py-3 text-center" style={{ fontFamily: T.mono }}><EdNum value={r.impact} onCommit={editRisk(r.id, "impact")} width={45} /></td>
                <td className="px-3 py-3">
                  <span className="px-2 py-1 rounded" style={{ background: c.bg, color: c.fg, fontFamily: T.mono, fontSize: 12, fontWeight: 700 }}>{s}</span>
                </td>
                <td className="px-3 py-3" style={{ color: T.inkSoft, fontSize: 13, minWidth: 200 }}><EdText value={r.mitigation} onCommit={editRisk(r.id, "mitigation")} width={220} /></td>
                <td className="px-3 py-3" style={{ color: T.inkSoft, fontSize: 12 }}>{r.owner}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RoadmapView({ d }) {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {d.horizons.map((h, i) => (
          <div key={i} className="p-4 rounded flex flex-col" style={{ border: `1px solid ${T.hairline}`, borderTop: `3px solid ${T.petrol}`, background: T.panel }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.amber }}>{h.timeframe}</div>
            <div className="mb-3" style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>{h.label}</div>
            <Eyebrow>Objectives</Eyebrow>
            {h.objectives.map((o, j) => <div key={j} className="mt-1 text-sm" style={{ color: T.ink }}>— {o}</div>)}
            <div className="mt-3">
              <Eyebrow>Outcomes</Eyebrow>
              {h.outcomes.map((o, j) => <div key={j} className="mt-1 text-sm" style={{ color: T.green }}>✓ {o}</div>)}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded" style={{ background: T.amberBg, border: `1px solid ${T.hairline}` }}>
        <Eyebrow>Quick wins — first 90 days</Eyebrow>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
          {d.quickWins.map((q, i) => <span key={i} className="text-sm" style={{ color: T.ink }}>★ {q}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ── Markdown export ────────────────────────────────────────── */
function toMarkdown(form, out) {
  const L = [];
  L.push(`# Proposal Pack — ${form.title}`, `**Client:** ${form.client} · **Industry:** ${form.industry} · **Budget band:** ${form.budget} · **Timeline:** ${form.timeline}`, "");
  const a = out.architecture, c = out.costs, p = out.plan, r = out.resources, k = out.risks, m = out.roadmap;
  L.push("## 1. Solution Architecture", a.overview, "");
  a.layers.forEach((x) => L.push(`### ${x.name}`, `Components: ${x.components.join(", ")}`, `Rationale: ${x.rationale}`, ""));
  L.push(`**Integrations:** ${a.integrations.join("; ")}`, `**Tech stack:** ${a.techStack.join(", ")}`, "");
  const sub = c.lineItems.reduce((s, x) => s + x.cost, 0);
  const cont = Math.round(sub * (c.contingencyPct / 100));
  L.push("## 2. Cost Estimation", "| Item | Category | % of budget | Day rate | Effort (days) | Cost |", "|---|---|---:|---:|---:|---:|");
  c.lineItems.forEach((x) => L.push(`| ${x.item} | ${x.category} | ${Math.round((x.cost / sub) * 100)}% | ${x.rate ? fmtMoney(x.rate, c.currency) : "—"} | ${x.effortDays || "—"} | ${fmtMoney(x.cost, c.currency)} |`));
  L.push(`| Contingency (${c.contingencyPct}%) | | | | | ${fmtMoney(cont, c.currency)} |`, `| **Total** | | | | | **${fmtMoney(sub + cont, c.currency)}** |`, "");
  if (c.basis) {
    L.push("### Basis of estimate");
    c.basis.steps.forEach((s, i) => L.push(`${i + 1}. ${s}`));
    L.push("");
  }
  L.push(`Assumptions: ${c.assumptions.join("; ")}`, "");
  L.push("## 3. Project Plan");
  p.phases.forEach((x, i) => L.push(`### Phase ${i + 1}: ${x.name} (${x.durationWeeks} wks)`, `Milestones: ${x.milestones.join("; ")}`, `Deliverables: ${x.deliverables.join("; ")}`, ""));
  L.push("## 4. Resource Plan", r.model, "| Role | # | Allocation | Phases | Location |", "|---|---:|---:|---|---|");
  r.roles.forEach((x) => L.push(`| ${x.role} | ${x.count} | ${x.allocationPct}% | ${x.phases} | ${x.location} |`));
  if (r.basis) {
    L.push("", "### How this team was sized");
    r.basis.forEach((s, i) => L.push(`${i + 1}. ${s}`));
  }
  L.push("", "## 5. Risk Register", "| ID | Risk | Category | P | I | Score | Mitigation | Owner |", "|---|---|---|---:|---:|---:|---|---|");
  k.risks.forEach((x) => L.push(`| ${x.id} | ${x.risk} | ${x.category} | ${x.probability} | ${x.impact} | ${x.probability * x.impact} | ${x.mitigation} | ${x.owner} |`));
  L.push("", "## 6. Implementation Roadmap");
  m.horizons.forEach((h) => L.push(`### ${h.label} (${h.timeframe})`, `Objectives: ${h.objectives.join("; ")}`, `Outcomes: ${h.outcomes.join("; ")}`, ""));
  L.push(`Quick wins: ${m.quickWins.join("; ")}`);
  return L.join("\n");
}

/* ── Print / PDF pack ───────────────────────────────────────── */
function PrintPack({ form, out }) {
  if (!out) return null;
  const c = out.costs;
  const sub = c.lineItems.reduce((s, x) => s + x.cost, 0);
  const cont = Math.round(sub * (c.contingencyPct / 100));
  const S = {
    h2: { fontFamily: T.serif, fontSize: 19, borderBottom: "1px solid #999", paddingBottom: 4, margin: "0 0 10px" },
    td: { border: "1px solid #bbb", padding: "5px 8px", fontSize: 11, verticalAlign: "top" },
    th: { border: "1px solid #bbb", padding: "5px 8px", fontSize: 10, textAlign: "left", background: "#eee", textTransform: "uppercase", letterSpacing: "0.06em" },
    sec: { pageBreakBefore: "always", paddingTop: 8 },
    p: { fontSize: 12, lineHeight: 1.5 },
    ol: { fontSize: 11, lineHeight: 1.5, paddingLeft: 18, margin: "4px 0" },
  };
  const Tbl = ({ head, rows }) => (
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
      <thead><tr>{head.map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j} style={S.td}>{cell}</td>)}</tr>)}</tbody>
    </table>
  );
  const risksSorted = [...out.risks.risks].sort((a, b) => b.probability * b.impact - a.probability * a.impact);
  return (
    <div className="print-only" style={{ fontFamily: T.sans, color: "#111" }}>
      <div style={{ paddingTop: 120, textAlign: "center" }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>SD Advisory · Proposal Pack</div>
        <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 700, marginTop: 12 }}>{form.title}</div>
        <div style={{ fontSize: 14, marginTop: 8 }}>Prepared for {form.client}</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 24, color: "#555" }}>{form.industry} · {form.budget} · {form.timeline}{form.region ? ` · ${form.region}` : ""}</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, marginTop: 6, color: "#555" }}>Version 1.0 · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
        <div style={{ marginTop: 80, fontSize: 10, color: "#777" }}>COMMERCIAL IN CONFIDENCE — draft for review; validate scope, rates and commitments before submission.</div>
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>1. Solution Architecture</h2>
        <p style={S.p}>{out.architecture.overview}</p>
        <Tbl head={["Layer", "Components", "Rationale"]} rows={out.architecture.layers.map((l) => [l.name, l.components.join(", "), l.rationale])} />
        <p style={S.p}><b>Integrations:</b> {out.architecture.integrations.join("; ")}<br /><b>Technology stack:</b> {out.architecture.techStack.join(", ")}</p>
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>2. Cost Estimation</h2>
        <Tbl
          head={["Line item", "Category", "% of budget", "Day rate", "Effort (days)", "Cost"]}
          rows={[
            ...c.lineItems.map((x) => [x.item, x.category, `${Math.round((x.cost / sub) * 100)}%`, x.rate ? fmtMoney(x.rate, c.currency) : "—", x.effortDays || "—", fmtMoney(x.cost, c.currency)]),
            [`Contingency (${c.contingencyPct}%)`, "", "", "", "", fmtMoney(cont, c.currency)],
            [<b key="t">Total investment</b>, "", "", "", "", <b key="v">{fmtMoney(sub + cont, c.currency)}</b>],
          ]}
        />
        <p style={{ ...S.p, marginBottom: 2 }}><b>Basis of estimate</b></p>
        <ol style={S.ol}>{c.basis.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        <p style={S.p}><b>Assumptions:</b> {c.assumptions.join("; ")}</p>
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>3. Project Plan</h2>
        <Tbl head={["#", "Phase", "Weeks", "Milestones", "Deliverables"]} rows={out.plan.phases.map((p, i) => [`P${i + 1}`, p.name, p.durationWeeks, p.milestones.join("; "), p.deliverables.join("; ")])} />
        <p style={S.p}>Total duration: {out.plan.phases.reduce((s, p) => s + p.durationWeeks, 0)} weeks.</p>
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>4. Resource Plan</h2>
        <p style={S.p}>{out.resources.model}</p>
        <Tbl head={["Role", "#", "Allocation", "Phases", "Location"]} rows={out.resources.roles.map((r) => [r.role, r.count, `${r.allocationPct}%`, r.phases, r.location])} />
        {out.resources.basis && (<><p style={{ ...S.p, marginBottom: 2 }}><b>How this team was sized</b></p><ol style={S.ol}>{out.resources.basis.map((s, i) => <li key={i}>{s}</li>)}</ol></>)}
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>5. Risk Register</h2>
        <Tbl head={["ID", "Risk", "Category", "P", "I", "Score", "Mitigation", "Owner"]} rows={risksSorted.map((r) => [r.id, r.risk, r.category, r.probability, r.impact, r.probability * r.impact, r.mitigation, r.owner])} />
      </div>
      <div style={S.sec}>
        <h2 style={S.h2}>6. Implementation Roadmap</h2>
        <Tbl head={["Horizon", "Timeframe", "Objectives", "Outcomes"]} rows={out.roadmap.horizons.map((h) => [h.label, h.timeframe, h.objectives.join("; "), h.outcomes.join("; ")])} />
        <p style={S.p}><b>Quick wins (first 90 days):</b> {out.roadmap.quickWins.join("; ")}</p>
        <p style={{ fontSize: 9, color: "#888", marginTop: 24 }}>Generated by the SD Advisory Proposal Automation Platform. Commercial in confidence.</p>
      </div>
    </div>
  );
}

/* ── Main app ───────────────────────────────────────────────── */
export default function ProposalPlatform() {
  const [form, setForm] = useState({ client: "", title: "", industry: INDUSTRIES[0], budget: BUDGETS[2], timeline: TIMELINES[2], region: "", type: "network", brief: "" });
  const [settings, setSettings] = useState({ currency: "USD", fx: 1, ratePct: 0 });
  const [status, setStatus] = useState({});
  const [out, setOut] = useState(null);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState("architecture");
  const timers = useRef([]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateSection = (id) => (fn) =>
    setOut((o) => {
      const copy = JSON.parse(JSON.stringify(o[id]));
      return { ...o, [id]: fn(copy) || copy };
    });
  const ready = form.client && form.title;
  const doneCount = AGENTS.filter((a) => status[a.id] === "done").length;

  function run() {
    if (!ready || running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setOut(null);
    const result = generate(form, settings);
    const st = {};
    AGENTS.forEach((a) => (st[a.id] = "queued"));
    setStatus({ ...st });
    // Reveal sections sequentially for the war-room feel — all computed locally.
    AGENTS.forEach((a, i) => {
      timers.current.push(
        setTimeout(() => {
          setStatus((s) => ({ ...s, [a.id]: "running" }));
          setActive(a.id);
        }, i * 900)
      );
      timers.current.push(
        setTimeout(() => {
          setOut((o) => ({ ...(o || {}), [a.id]: result[a.id] }));
          setStatus((s) => ({ ...s, [a.id]: "done" }));
          if (i === AGENTS.length - 1) {
            setRunning(false);
            setActive("architecture");
          }
        }, i * 900 + 700)
      );
    });
  }

  function exportPack() {
    const md = toMarkdown(form, out);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proposal-pack-${(form.client || "client").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const views = { architecture: ArchView, costs: CostView, plan: PlanView, resources: ResourceView, risks: RiskView, roadmap: RoadmapView };
  const ActiveView = views[active];

  return (
    <div className="min-h-screen" style={{ background: T.paper, fontFamily: T.sans, color: T.ink }}>
      <style>{`
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block; }
          body { background: #fff !important; }
          @page { margin: 16mm; }
        }
      `}</style>
      <PrintPack form={form} out={doneCount === AGENTS.length ? out : null} />
      <div className="no-print">
      <header className="px-6 pt-8 pb-6" style={{ borderBottom: `1px solid ${T.hairline}` }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>SD Advisory · Bid Desk</Eyebrow>
            <h1 style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, marginTop: 6 }}>
              Proposal Automation Platform
            </h1>
            <p className="mt-2 text-sm" style={{ color: T.inkSoft, maxWidth: 560 }}>
              Six specialist agents assemble a full proposal pack — architecture, commercials, plan, team, risks and roadmap — from a built-in delivery knowledge base. Runs fully in your browser, no API costs.
            </p>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.inkSoft }}>{doneCount}/{AGENTS.length} sections drafted</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Brief + agent rail */}
        <div className="lg:col-span-1 space-y-6">
          <section className="p-5 rounded" style={{ background: T.panel, border: `1px solid ${T.hairline}` }}>
            <div className="flex items-center justify-between mb-4">
              <Eyebrow>Engagement brief</Eyebrow>
              <button onClick={() => setForm(SAMPLE)} className="text-xs underline" style={{ color: T.petrol }}>
                Load sample brief
              </button>
            </div>
            <div className="space-y-3">
              <input value={form.client} onChange={set("client")} placeholder="Client name (use a codename if confidential)" className="w-full px-3 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, outline: "none" }} />
              <input value={form.title} onChange={set("title")} placeholder="Engagement title" className="w-full px-3 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, outline: "none" }} />
              <select value={form.type} onChange={set("type")} className="w-full px-2 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, background: T.panel }}>
                {Object.entries(BLUEPRINTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.industry} onChange={set("industry")} className="px-2 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, background: T.panel }}>
                  {INDUSTRIES.map((x) => <option key={x}>{x}</option>)}
                </select>
                <select value={form.budget} onChange={set("budget")} className="px-2 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, background: T.panel }}>
                  {BUDGETS.map((x) => <option key={x}>{x}</option>)}
                </select>
                <select value={form.timeline} onChange={set("timeline")} className="px-2 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, background: T.panel }}>
                  {TIMELINES.map((x) => <option key={x}>{x}</option>)}
                </select>
                <input value={form.region} onChange={set("region")} placeholder="Region / scale" className="px-3 py-2 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, outline: "none" }} />
              </div>
              <div className="p-3 rounded" style={{ border: `1px dashed ${T.hairline}`, background: T.paper }}>
                <Eyebrow>Commercial settings — rate card</Eyebrow>
                <div className="mt-2 grid grid-cols-2 gap-3 items-center">
                  <select
                    value={settings.currency}
                    onChange={(e) => { const cu = e.target.value; setSettings((s) => ({ ...s, currency: cu, fx: CURRENCIES[cu].fx })); }}
                    className="px-2 py-2 rounded text-sm"
                    style={{ border: `1px solid ${T.hairline}`, background: T.panel }}
                  >
                    {Object.keys(CURRENCIES).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-xs" style={{ color: T.inkSoft }}>
                    FX / USD
                    <input type="number" step="0.01" value={settings.fx} onChange={(e) => setSettings((s) => ({ ...s, fx: parseFloat(e.target.value) || s.fx }))} className="w-full px-2 py-1 rounded text-sm" style={{ border: `1px solid ${T.hairline}`, fontFamily: T.mono }} />
                  </label>
                </div>
                <label className="block mt-3 text-xs" style={{ color: T.inkSoft }}>
                  Day-rate adjustment: <span style={{ fontFamily: T.mono, color: T.ink }}>{settings.ratePct > 0 ? "+" : ""}{settings.ratePct}%</span>
                  <input type="range" min={-30} max={30} value={settings.ratePct} onChange={(e) => setSettings((s) => ({ ...s, ratePct: parseInt(e.target.value) }))} className="w-full mt-1" />
                </label>
                <div className="mt-1 text-xs" style={{ color: T.inkSoft }}>Applied on the next run. Every generated figure remains click-to-edit afterwards.</div>
              </div>
              <textarea value={form.brief} onChange={set("brief")} placeholder="Optional: paste RFP notes for your own reference (kept in the export header context)…" rows={5} className="w-full px-3 py-2 rounded text-sm leading-relaxed" style={{ border: `1px solid ${T.hairline}`, outline: "none", resize: "vertical" }} />
              <button
                onClick={run}
                disabled={!ready || running}
                className="w-full py-3 rounded text-sm font-semibold"
                style={{ background: !ready || running ? T.hairline : T.petrol, color: !ready || running ? T.inkSoft : "#fff", cursor: !ready || running ? "default" : "pointer", transition: "background 0.2s" }}
              >
                {running ? "Assembling proposal pack…" : "Run the bid desk"}
              </button>
              {!ready && <div className="text-xs" style={{ color: T.inkSoft }}>Add a client name (or codename) and engagement title to start.</div>}
            </div>
          </section>

          {/* Agent rail */}
          <section className="p-5 rounded" style={{ background: T.ink, color: "#E8EDEB" }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9FB3AE" }}>Agent rail · offline engine</div>
            <div className="mt-4">
              {AGENTS.map((a, i) => {
                const s = status[a.id] || "idle";
                const dot = s === "done" ? T.green : s === "running" ? T.amber : "#54666E";
                return (
                  <div key={a.id} className="flex items-start gap-3 relative pb-4">
                    {i < AGENTS.length - 1 && <div className="absolute" style={{ left: 5, top: 14, bottom: 0, width: 1, background: "#3A4B53" }} />}
                    <div className="mt-1 rounded-full flex-shrink-0" style={{ width: 11, height: 11, background: dot, boxShadow: s === "running" ? "0 0 0 4px rgba(185,119,30,0.25)" : "none" }} />
                    <button onClick={() => out?.[a.id] && setActive(a.id)} className="text-left flex-1">
                      <div className="text-sm font-medium" style={{ color: out?.[a.id] ? "#fff" : "#B8C6C2" }}>{a.name}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 11, color: "#7E938E" }}>
                        {a.deliverable} · {s === "idle" ? "standing by" : s}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            {doneCount === AGENTS.length && (
              <div className="mt-2 space-y-2">
                <button onClick={exportPack} className="w-full py-2 rounded text-sm font-semibold" style={{ background: T.amber, color: "#fff" }}>
                  Export proposal pack (.md)
                </button>
                <button onClick={() => window.print()} className="w-full py-2 rounded text-sm font-semibold" style={{ background: "transparent", color: "#E8EDEB", border: "1px solid #54666E" }}>
                  Print / Save as PDF
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Output */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-5">
            {AGENTS.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                className="px-3 py-2 rounded text-sm"
                style={{
                  background: active === a.id ? T.petrol : T.panel,
                  color: active === a.id ? "#fff" : out?.[a.id] ? T.ink : T.inkSoft,
                  border: `1px solid ${active === a.id ? T.petrol : T.hairline}`,
                }}
              >
                <span style={{ fontFamily: T.mono, fontSize: 11, marginRight: 6, opacity: 0.7 }}>{i + 1}</span>
                {a.deliverable}
              </button>
            ))}
          </div>

          <section className="p-6 rounded min-h-96" style={{ background: T.panel, border: `1px solid ${T.hairline}` }}>
            <div className="mb-5 pb-4 flex items-baseline justify-between" style={{ borderBottom: `1px solid ${T.hairline}` }}>
              <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 700 }}>{AGENTS.find((a) => a.id === active)?.deliverable}</h2>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.inkSoft }}>drafted by {AGENTS.find((a) => a.id === active)?.name}</div>
            </div>

            {out?.[active] ? (
              <ActiveView d={out[active]} up={updateSection(active)} />
            ) : status[active] === "running" ? (
              <div className="py-16 text-center">
                <div className="inline-block rounded-full animate-pulse mb-3" style={{ width: 14, height: 14, background: T.amber }} />
                <div style={{ fontFamily: T.serif, fontSize: 18, color: T.inkSoft }}>
                  {AGENTS.find((a) => a.id === active)?.name} is drafting this section…
                </div>
              </div>
            ) : (
              <div className="py-16 text-center" style={{ color: T.inkSoft }}>
                <div style={{ fontFamily: T.serif, fontSize: 18 }}>Nothing drafted yet.</div>
                <div className="text-sm mt-1">Complete the brief and run the bid desk — sections appear here as each agent finishes.</div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="px-6 py-6 text-center" style={{ fontFamily: T.mono, fontSize: 11, color: T.inkSoft }}>
        Generated from SD Advisory's delivery knowledge base — tailor scope, rates and commitments before submission.
      </footer>
      </div>
    </div>
  );
}
