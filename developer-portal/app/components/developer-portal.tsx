"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Copy,
  KeyRound,
  Plus,
  RefreshCcw,
  Route,
  Server,
  Shield,
  ShieldCheck,
  Trash2,
  UserRound,
  Waypoints,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  initialConsumerForm,
  initialConsumerLoginForm,
  futureSecurityModes,
  initialGatewayForm,
  initialRouteForm,
  initialServiceForm,
  supportedSecurityModes,
  type ConsumerForm,
  type ConsumerLoginForm,
  type ConsumerRegistrationResult,
  type ConsumerSummary,
  type ConsumerTokenResult,
  type ConsumerTokenValidationResult,
  type DashboardTab,
  type DeveloperPortalProps,
  type GatewayForm,
  type GatewaySummary,
  type RouteForm,
  type ServiceForm,
  type StatusState,
} from "@/app/components/developer-portal/model";

type WizardStep = 1 | 2;

export function DeveloperPortal({
  activeTab,
  operatorName = "Developer",
  operatorEmail = "dev@stadoor.com",
}: DeveloperPortalProps) {
  const [gatewayForm, setGatewayForm] = useState<GatewayForm>(initialGatewayForm);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(initialServiceForm);
  const [routeForm, setRouteForm] = useState<RouteForm>(initialRouteForm);
  const [gateways, setGateways] = useState<GatewaySummary[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<StatusState>(null);
  const [serviceStatus, setServiceStatus] = useState<StatusState>(null);
  const [routeStatus, setRouteStatus] = useState<StatusState>(null);
  const [isPending, startTransition] = useTransition();

  const [gatewayStep, setGatewayStep] = useState<WizardStep>(1);
  const [showGatewayForm, setShowGatewayForm] = useState(false);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceBaseUrl, setServiceBaseUrl] = useState("http://localhost:8082");

  const [showRouteForm, setShowRouteForm] = useState(false);
  const [consumers, setConsumers] = useState<ConsumerSummary[]>([]);
  const [selectedConsumerGatewayId, setSelectedConsumerGatewayId] = useState(initialConsumerForm.gatewayId);
  const [showConsumerForm, setShowConsumerForm] = useState(false);
  const [consumerForm, setConsumerForm] = useState<ConsumerForm>(initialConsumerForm);
  const [consumerLoginForm, setConsumerLoginForm] = useState<ConsumerLoginForm>(initialConsumerLoginForm);
  const [selectedConsumerUsername, setSelectedConsumerUsername] = useState("");
  const [consumerStatus, setConsumerStatus] = useState<StatusState>(null);
  const [consumerJwtStatus, setConsumerJwtStatus] = useState<StatusState>(null);
  const [consumerTokenValidationStatus, setConsumerTokenValidationStatus] = useState<StatusState>(null);
  const [issuedConsumerToken, setIssuedConsumerToken] = useState<ConsumerTokenResult | null>(null);
  const [validatedConsumerToken, setValidatedConsumerToken] = useState<ConsumerTokenValidationResult | null>(null);
  const [tokenToValidate, setTokenToValidate] = useState("");
  const [recentConsumerCredential, setRecentConsumerCredential] = useState<(ConsumerRegistrationResult & { password: string }) | null>(null);

  const [profileName, setProfileName] = useState(operatorName);
  const [profileEmail, setProfileEmail] = useState(operatorEmail);
  const [defaultBaseUrl, setDefaultBaseUrl] = useState("https://api.stadoor.com");
  const [defaultTimeout, setDefaultTimeout] = useState("5000");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  useEffect(() => {
    setProfileName(operatorName);
    setProfileEmail(operatorEmail);
  }, [operatorEmail, operatorName]);

  useEffect(() => {
    void loadGateways();
  }, []);

  useEffect(() => {
    if (gateways.length === 0) {
      setConsumers([]);
      setSelectedConsumerUsername("");
      return;
    }

    const nextGatewayId = gateways.some((gateway) => gateway.gatewayId === selectedConsumerGatewayId)
      ? selectedConsumerGatewayId
      : gateways[0].gatewayId;

    if (nextGatewayId !== selectedConsumerGatewayId) {
      setSelectedConsumerGatewayId(nextGatewayId);
      return;
    }

    setConsumerForm((current) => (current.gatewayId === nextGatewayId ? current : { ...current, gatewayId: nextGatewayId }));
    setConsumerLoginForm((current) =>
      current.gatewayId === nextGatewayId ? current : { ...current, gatewayId: nextGatewayId },
    );
    void loadConsumers(nextGatewayId);
  }, [gateways, selectedConsumerGatewayId]);

  async function loadGateways(preferredGatewayId?: string, preferredServiceId?: string) {
    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/gateways", { cache: "no-store" });
        const data = (await response.json().catch(() => ({ gateways: [] }))) as { gateways?: GatewaySummary[] };
        const gatewayList = Array.isArray(data.gateways) ? data.gateways : [];
        setGateways(gatewayList);
        syncSelections(gatewayList, preferredGatewayId, preferredServiceId);
      })();
    });
  }

  async function loadConsumers(gatewayId: string, preferredUsername?: string) {
    startTransition(() => {
      void (async () => {
        const response = await fetch(`/api/consumers?gatewayId=${encodeURIComponent(gatewayId)}`, { cache: "no-store" });
        const data = (await response.json().catch(() => [])) as ConsumerSummary[] | { message?: string };
        const consumerList = Array.isArray(data) ? data : [];
        setConsumers(consumerList);

        const nextUsername =
          preferredUsername && consumerList.some((consumer) => consumer.username === preferredUsername)
            ? preferredUsername
            : selectedConsumerUsername && consumerList.some((consumer) => consumer.username === selectedConsumerUsername)
              ? selectedConsumerUsername
              : consumerList[0]?.username ?? "";

        setSelectedConsumerUsername(nextUsername);
        if (nextUsername) {
          setConsumerLoginForm((current) => ({
            gatewayId,
            password:
              recentConsumerCredential?.username === nextUsername
                ? recentConsumerCredential.password
                : current.username === nextUsername
                  ? current.password
                  : "",
            username: nextUsername,
          }));
        }
      })();
    });
  }

  function selectConsumer(username: string) {
    setSelectedConsumerUsername(username);
    setConsumerLoginForm({
      gatewayId: selectedConsumerGatewayId,
      username,
      password: recentConsumerCredential?.username === username ? recentConsumerCredential.password : "",
    });
    setConsumerJwtStatus(null);
    setConsumerTokenValidationStatus(null);
    setIssuedConsumerToken(null);
    setValidatedConsumerToken(null);
    setTokenToValidate("");
  }

  function syncSelections(gatewayList: GatewaySummary[], preferredGatewayId?: string, preferredServiceId?: string) {
    if (gatewayList.length === 0) {
      return;
    }

    const gatewayId =
      preferredGatewayId && gatewayList.some((gateway) => gateway.gatewayId === preferredGatewayId)
        ? preferredGatewayId
        : gatewayList.some((gateway) => gateway.gatewayId === serviceForm.gatewayId)
          ? serviceForm.gatewayId
          : gatewayList[0].gatewayId;

    const activeGateway = gatewayList.find((gateway) => gateway.gatewayId === gatewayId) ?? gatewayList[0];
    const serviceId =
      preferredServiceId && activeGateway.services.some((service) => service.serviceId === preferredServiceId)
        ? preferredServiceId
        : activeGateway.services.some((service) => service.serviceId === routeForm.serviceId)
          ? routeForm.serviceId
          : activeGateway.services[0]?.serviceId ?? "";

    const activeService = activeGateway.services.find((service) => service.serviceId === serviceId);

    setServiceForm((current) => ({
      ...current,
      gatewayId: activeGateway.gatewayId,
    }));

    setRouteForm((current) => ({
      ...current,
      gatewayId: activeGateway.gatewayId,
      serviceId,
      uri: activeService ? `lb://${activeService.serviceName}` : current.uri,
    }));
  }

  function parseServiceBaseUrl(rawUrl: string) {
    const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `http://${rawUrl}`;
    const parsed = new URL(withProtocol);
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
    return {
      normalized: withProtocol,
      address: parsed.hostname,
      port,
    };
  }

  async function submitGateway() {
    setGatewayStatus({ tone: "loading", message: "Creating gateway..." });

    const description =
      gatewayForm.description.trim() || "Gateway workspace for grouped services and routes.";

    const response = await fetch("/api/gateways", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gatewayId: gatewayForm.gatewayId.trim(),
        gatewayName: gatewayForm.gatewayName.trim(),
        description,
        authType: gatewayForm.authType,
      }),
    });

    const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
    setGatewayStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Gateway created successfully." : "Failed to create gateway.",
      payload: data,
    });

    if (response.ok) {
      void loadGateways(gatewayForm.gatewayId.trim());
      setGatewayStep(1);
      setGatewayForm((current) => ({
        ...current,
        gatewayId: "",
        gatewayName: "",
        description: "",
        authType: initialGatewayForm.authType,
      }));
    }
  }

  async function submitService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServiceStatus({ tone: "loading", message: "Registering service..." });

    try {
      const parsed = parseServiceBaseUrl(serviceBaseUrl);
      const payload = {
        gatewayId: serviceForm.gatewayId,
        serviceId: serviceForm.serviceId,
        serviceName: serviceForm.serviceName,
        address: parsed.address,
        port: Number(parsed.port),
        tags: serviceForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        authType: serviceForm.authType || null,
      };

      const response = await fetch("/api/services/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
      setServiceStatus({
        tone: response.ok ? "success" : "error",
        message: response.ok ? "Service registered successfully." : "Failed to register service.",
        payload: data,
      });

      if (response.ok) {
        setRouteForm((current) => ({
          ...current,
          gatewayId: serviceForm.gatewayId,
          serviceId: serviceForm.serviceId,
          uri: `lb://${serviceForm.serviceName}`,
          authType: "",
        }));
        setShowServiceForm(false);
        void loadGateways(serviceForm.gatewayId, serviceForm.serviceId);
      }
    } catch {
      setServiceStatus({
        tone: "error",
        message: "Invalid base URL. Use format like https://api.internal.com",
      });
    }
  }

  async function submitRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRouteStatus({ tone: "loading", message: "Creating route..." });

    const payload = {
      ...routeForm,
      authType: inheritedServiceAuthType ? null : routeForm.authType || null,
    };

    const response = await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ message: "Unable to parse response" }));
    setRouteStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Route created and synced with resolved security." : "Failed to create route.",
      payload: data,
    });

    if (response.ok) {
      setShowRouteForm(false);
      void loadGateways(routeForm.gatewayId, routeForm.serviceId);
    }
  }

  async function submitConsumer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsumerStatus({ tone: "loading", message: "Registering consumer..." });

    const response = await fetch("/api/consumers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...consumerForm,
        gatewayId: selectedConsumerGatewayId,
      }),
    });

    const data = (await response.json().catch(() => ({ message: "Unable to parse response" }))) as
      | ConsumerRegistrationResult
      | { message?: string };

    setConsumerStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Consumer registered successfully." : "Failed to register consumer.",
      payload: data,
    });

    if (response.ok && "username" in data && "apiKey" in data) {
      setRecentConsumerCredential({
        id: data.id,
        gatewayId: data.gatewayId,
        consumerName: data.consumerName,
        username: data.username,
        apiKey: data.apiKey,
        password: consumerForm.password,
      });
      setConsumerLoginForm({
        gatewayId: data.gatewayId,
        username: data.username,
        password: consumerForm.password,
      });
      setSelectedConsumerUsername(data.username);
      setConsumerForm((current) => ({
        ...initialConsumerForm,
        gatewayId: current.gatewayId,
      }));
      setShowConsumerForm(false);
      void loadConsumers(data.gatewayId, data.username);
    }
  }

  async function issueConsumerJwt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsumerJwtStatus({ tone: "loading", message: "Issuing consumer JWT..." });

    const response = await fetch("/api/consumers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...consumerLoginForm,
        gatewayId: selectedConsumer?.gatewayId ?? selectedConsumerGatewayId,
      }),
    });

    const data = (await response.json().catch(() => ({ message: "Unable to parse response" }))) as
      | ConsumerTokenResult
      | { message?: string };

    setConsumerJwtStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "JWT issued for selected consumer." : "Failed to issue JWT.",
      payload: data,
    });

    if (response.ok && "accessToken" in data) {
      setIssuedConsumerToken(data);
      setValidatedConsumerToken(null);
      setTokenToValidate(data.accessToken);
    }
  }

  async function validateConsumerJwt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsumerTokenValidationStatus({ tone: "loading", message: "Validating token..." });

    const response = await fetch("/api/consumers/token/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gatewayId: selectedConsumer?.gatewayId ?? selectedConsumerGatewayId,
        token: tokenToValidate,
      }),
    });

    const data = (await response.json().catch(() => ({ message: "Unable to parse response" }))) as
      | ConsumerTokenValidationResult
      | { message?: string };

    setConsumerTokenValidationStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Token validation completed." : "Failed to validate token.",
      payload: data,
    });

    if (response.ok && "authenticated" in data) {
      setValidatedConsumerToken(data);
    }
  }

  async function copyValue(value: string, successMessage: string) {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setConsumerStatus({
        tone: "success",
        message: successMessage,
      });
    } catch {
      setConsumerStatus({
        tone: "error",
        message: "Clipboard copy failed.",
      });
    }
  }

  function handleRouteGatewayChange(gatewayId: string) {
    const gateway = gateways.find((item) => item.gatewayId === gatewayId);
    const firstService = gateway?.services[0];

    setRouteForm((current) => ({
      ...current,
      gatewayId,
      serviceId: firstService?.serviceId ?? "",
      uri: firstService ? `lb://${firstService.serviceName}` : current.uri,
      authType: "",
    }));
  }

  function handleRouteServiceChange(serviceId: string) {
    const service = selectedRouteGateway?.services.find((item) => item.serviceId === serviceId);
    setRouteForm((current) => ({
      ...current,
      serviceId,
      uri: service ? `lb://${service.serviceName}` : current.uri,
      authType: "",
    }));
  }

  const allServices = gateways.flatMap((gateway) => gateway.services);
  const allRoutes = allServices.flatMap((service) =>
    service.routes.map((route) => ({
      ...route,
      serviceName: service.serviceName,
      gatewayName: gateways.find((gateway) => gateway.gatewayId === route.gatewayId)?.gatewayName ?? route.gatewayId,
    })),
  );
  const selectedRouteGateway =
    gateways.find((gateway) => gateway.gatewayId === routeForm.gatewayId) ?? gateways[0] ?? null;
  const selectedServiceGateway =
    gateways.find((gateway) => gateway.gatewayId === serviceForm.gatewayId) ?? gateways[0] ?? null;
  const selectedConsumerGateway =
    gateways.find((gateway) => gateway.gatewayId === selectedConsumerGatewayId) ?? gateways[0] ?? null;
  const selectedConsumer =
    consumers.find((consumer) => consumer.username === selectedConsumerUsername) ?? consumers[0] ?? null;
  const selectedRouteService =
    selectedRouteGateway?.services.find((service) => service.serviceId === routeForm.serviceId) ?? null;
  const inheritedServiceAuthType = selectedRouteService?.authType ?? null;
  const routePreviewAuthType =
    inheritedServiceAuthType ??
    (routeForm.authType || selectedRouteGateway?.authType || "NONE");
  const selectedServiceGatewayAuthType = selectedServiceGateway?.authType ?? "NONE";
  const selectedRouteGatewayAuthType = selectedRouteGateway?.authType ?? "NONE";
  const allowedServiceSecurityModes = supportedSecurityModes.filter(
    (mode) => mode.label === selectedServiceGatewayAuthType,
  );
  const allowedRouteSecurityModes = supportedSecurityModes.filter(
    (mode) => mode.label === selectedRouteGatewayAuthType,
  );

  const protectedRouteCount = allRoutes.filter((route) => (route.authType ?? "NONE") !== "NONE").length;
  const jwtRouteCount = allRoutes.filter((route) => route.authType === "JWT").length;
  const basicRouteCount = allRoutes.filter((route) => route.authType === "BASIC").length;
  const apiKeyRouteCount = allRoutes.filter((route) => route.authType === "API_KEY").length;
  const oauth2RouteCount = allRoutes.filter((route) => route.authType === "OAUTH2").length;
  const openRouteCount = allRoutes.filter((route) => !route.authType || route.authType === "NONE").length;
  const gatewayCount = gateways.length;
  const serviceCount = allServices.length;
  const routeCount = allRoutes.length;
  const protectedGateways = gateways
    .filter((gateway) => (gateway.authType ?? "NONE") !== "NONE")
    .map((gateway) => ({
      gatewayId: gateway.gatewayId,
      gatewayName: gateway.gatewayName,
      authType: gateway.authType ?? "NONE",
      routeCount: gateway.services.reduce((total, service) => total + service.routes.length, 0),
      serviceCount: gateway.services.length,
    }));
  const protectedGatewayCount = protectedGateways.length;
  const basicGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "BASIC").length;
  const apiKeyGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "API_KEY").length;
  const jwtGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "JWT").length;
  const selectedConsumerGatewayProtectedRouteCount =
    selectedConsumerGateway?.services.reduce(
      (total, service) => total + service.routes.filter((route) => (route.authType ?? "NONE") !== "NONE").length,
      0,
    ) ?? 0;

  const gatewayRows = useMemo(
    () =>
      gateways.map((gateway) => {
        const serviceTotal = gateway.services.length;
        const routeTotal = gateway.services.reduce((total, service) => total + service.routes.length, 0);
        const primaryAuth = gateway.authType ?? "NONE";

        return {
          gateway,
          serviceTotal,
          routeTotal,
          primaryAuth,
        };
      }),
    [gateways],
  );

  const gatewayWizardSteps = [
    { id: 1 as WizardStep, label: "Basic Information" },
    { id: 2 as WizardStep, label: "Review" },
  ];

  const canGoNext = gatewayStep === 1
    ? gatewayForm.gatewayName.trim().length > 1 && gatewayForm.gatewayId.trim().length > 1
    : true;

  function renderContent(tab: DashboardTab) {
    if (tab === "dashboard") {
      return (
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Waypoints className="h-5 w-5" />}
              value={gatewayCount}
              label="Total Gateways"
              helper={`+${Math.max(gatewayCount, 1)} this month`}
            />
            <MetricCard
              icon={<Server className="h-5 w-5" />}
              value={serviceCount}
              label="Registered Services"
              helper={`+${Math.max(serviceCount, 1)} this month`}
            />
            <MetricCard
              icon={<Route className="h-5 w-5" />}
              value={routeCount}
              label="Active Routes"
              helper={`+${Math.max(routeCount, 1)} this month`}
            />
            <MetricCard
              icon={<Shield className="h-5 w-5" />}
              value={protectedRouteCount}
              label="Protected Routes"
              helper={routeCount > 0 ? `${Math.round((protectedRouteCount / routeCount) * 100)}% coverage` : "0% coverage"}
            />
          </div>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Your Gateways</p>
                <p className="mt-0.5 text-[1rem] text-[var(--text-muted)]">Manage and monitor your API Gateway instances</p>
              </div>
              <LinkButton href="/dashboard?tab=gateways" label="View All" />
            </header>

            <div className="space-y-3 px-4 py-4">
              {gatewayRows.length === 0 ? (
                <EmptyRow message="No gateways yet. Go to Gateways and create your first workspace." />
              ) : (
                gatewayRows.map((row) => (
                  <div
                    key={row.gateway.gatewayId}
                    className="flex flex-wrap items-center gap-3 rounded-[0.9rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--accent-soft)]">
                      <Waypoints className="h-5 w-5" />
                    </div>
                    <div className="min-w-[220px] flex-1">
                      <p className="text-[1.35rem] font-semibold text-[var(--text-strong)]">{row.gateway.gatewayName}</p>
                      <p className="text-[1rem] text-[var(--text-muted)]">
                        {row.serviceTotal} services • {row.routeTotal} endpoints • {row.gateway.gatewayId}
                      </p>
                    </div>
                    <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] px-3 py-1 text-sm font-semibold text-[var(--accent-soft)]">
                      Active
                    </span>
                    <span className="rounded-full border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] px-3 py-1 text-sm text-[var(--text-muted)]">
                      {row.primaryAuth}
                    </span>
                    <Button
                      variant="secondary"
                      asChild
                      className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                    >
                      <Link href="/dashboard?tab=gateways">Manage</Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      );
    }

    if (tab === "gateways") {
      return (
        <section className="space-y-4">
          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
              <div>
                <p className="text-[2.15rem] font-semibold tracking-[-0.05em] text-[var(--text-strong)]">Create New Gateway</p>
                <p className="text-[1rem] text-[var(--text-muted)]">Set up a new gateway workspace for your services and routes.</p>
              </div>
              <Button
                type="button"
                variant="brand"
                className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                onClick={() => setShowGatewayForm((current) => !current)}
              >
                {showGatewayForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showGatewayForm ? "Close" : "Add Gateway"}
              </Button>
            </header>

            {showGatewayForm ? (
              <>
                <div className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    {gatewayWizardSteps.map((step, index) => {
                      const isActive = step.id === gatewayStep;
                      const isDone = step.id < gatewayStep;
                      return (
                        <div key={step.id} className="flex items-center gap-2.5">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                              isActive || isDone
                                ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                                : "bg-[color:color-mix(in_srgb,var(--surface-muted)_96%,transparent)] text-[var(--text-muted)]"
                            }`}
                          >
                            {isDone ? <Check className="h-4 w-4" /> : step.id}
                          </div>
                          <p className="text-[1rem] font-medium text-[var(--accent-soft)]">{step.label}</p>
                          {index < gatewayWizardSteps.length - 1 ? (
                            <div className="hidden h-px flex-1 bg-[color:color-mix(in_srgb,var(--border-soft)_80%,transparent)] md:block" />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="px-5 py-5">
                  {gatewayStep === 1 ? (
                    <div className="space-y-4">
                      <Field label="Gateway Name">
                        <Input
                          value={gatewayForm.gatewayName}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayName: event.target.value })}
                          placeholder="e.g., E-Commerce API Gateway"
                          className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                        />
                      </Field>
                      <Field label="Gateway ID">
                        <Input
                          value={gatewayForm.gatewayId}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, gatewayId: event.target.value })}
                          placeholder="e.g., ecommerce-gateway"
                          className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                        />
                      </Field>
                      <Field label="Description (optional)">
                        <Textarea
                          value={gatewayForm.description}
                          onChange={(event) => setGatewayForm({ ...gatewayForm, description: event.target.value })}
                          placeholder="What this gateway is for (e.g., product, checkout, partner APIs)"
                          className="min-h-[96px] border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                        />
                      </Field>
                      <Field label="Gateway Default Security">
                        <select
                          className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                          value={gatewayForm.authType}
                          onChange={(event) =>
                            setGatewayForm((current) => ({
                              ...current,
                              authType: event.target.value as GatewayForm["authType"],
                            }))
                          }
                        >
                          {supportedSecurityModes.map((mode) => (
                            <option key={mode.label} value={mode.label}>
                              {mode.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  ) : null}

                  {gatewayStep === 2 ? (
                    <div className="space-y-4">
                      <p className="text-[1.2rem] font-semibold text-[var(--accent-soft)]">Review Configuration</p>
                      <div className="rounded-[0.85rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-4">
                        <ReviewRow label="Gateway Name" value={gatewayForm.gatewayName || "-"} />
                        <ReviewRow label="Gateway ID" value={gatewayForm.gatewayId || "-"} />
                        <ReviewRow label="Default Security" value={gatewayForm.authType || "NONE"} />
                        <ReviewRow label="Description" value={gatewayForm.description || "No description"} />
                      </div>
                    </div>
                  ) : null}
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-5 py-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                    onClick={() => setGatewayStep((current) => (current > 1 ? ((current - 1) as WizardStep) : current))}
                    disabled={gatewayStep === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    variant="brand"
                    className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
                    disabled={!canGoNext || isPending}
                    onClick={() => {
                      if (gatewayStep < 2) {
                        setGatewayStep((current) => (current + 1) as WizardStep);
                        return;
                      }
                      void submitGateway();
                    }}
                  >
                    {gatewayStep === 2 ? "Create Gateway" : "Next"}
                    {gatewayStep < 2 ? <ChevronRight className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                </footer>
              </>
            ) : null}
          </section>
          <StatusPanel status={gatewayStatus} />

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <div>
                <p className="text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Existing Gateways</p>
                <p className="text-[1rem] text-[var(--text-muted)]">Gateway workspaces already registered in your control plane.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-10 rounded-[0.72rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                onClick={() => void loadGateways()}
              >
                Refresh
              </Button>
            </header>

            <div className="overflow-x-auto px-4 py-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Services</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Routes</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Default Auth</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gatewayRows.length === 0 ? (
                    <tr>
                      <td className="px-3 py-5 text-[1rem] text-[var(--text-muted)]" colSpan={5}>
                        No gateways registered yet.
                      </td>
                    </tr>
                  ) : (
                    gatewayRows.map((row) => (
                      <tr key={row.gateway.gatewayId} className="text-[1rem] text-[var(--text-strong)]">
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <p className="font-semibold">{row.gateway.gatewayName}</p>
                          <p className="text-sm text-[var(--text-muted)]">{row.gateway.gatewayId}</p>
                        </td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{row.serviceTotal}</td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{row.routeTotal}</td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                            {row.primaryAuth}
                          </span>
                        </td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              asChild
                              className="h-8 rounded-[0.6rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent px-3 text-sm text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                            >
                              <Link href="/dashboard?tab=services">Services</Link>
                            </Button>
                            <Button
                              variant="secondary"
                              asChild
                              className="h-8 rounded-[0.6rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent px-3 text-sm text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                            >
                              <Link href="/dashboard?tab=routes">Routes</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      );
    }

    if (tab === "services") {
      return (
        <section className="space-y-4">
          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Registered Services</p>
                <p className="text-[1rem] text-[var(--text-muted)]">{allServices.length} services registered across your gateways</p>
              </div>
              <Button
                type="button"
                variant="brand"
                className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                onClick={() => setShowServiceForm((current) => !current)}
              >
                {showServiceForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showServiceForm ? "Close" : "Add Service"}
              </Button>
            </header>

            {showServiceForm ? (
              <form className="grid gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4 md:grid-cols-2" onSubmit={submitService}>
                <Field label="Service Name">
                  <Input
                    value={serviceForm.serviceName}
                    onChange={(event) =>
                      setServiceForm((current) => ({
                        ...current,
                        serviceName: event.target.value,
                        serviceId: event.target.value.replace(/\s+/g, "-").toLowerCase() + "-manual-1",
                      }))
                    }
                    placeholder="e.g., Payment Service"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                <Field label="Assign to Gateway">
                  <select
                    className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                    value={serviceForm.gatewayId}
                    onChange={(event) =>
                      setServiceForm((current) => ({
                        ...current,
                        gatewayId: event.target.value,
                        authType: "",
                      }))
                    }
                  >
                    {gateways.length === 0 ? <option value="">Create a gateway first</option> : null}
                    {gateways.map((gateway) => (
                      <option key={gateway.gatewayId} value={gateway.gatewayId}>
                        {gateway.gatewayName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Base URL">
                  <Input
                    value={serviceBaseUrl}
                    onChange={(event) => setServiceBaseUrl(event.target.value)}
                    placeholder="https://api.internal.com/service"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                <Field label="Tags">
                  <Input
                    value={serviceForm.tags}
                    onChange={(event) => setServiceForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder="manual-registration,ecommerce,spring"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                <Field label="Service Security (optional)">
                  <select
                    className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                    value={serviceForm.authType}
                    onChange={(event) =>
                      setServiceForm((current) => ({
                        ...current,
                        authType: event.target.value as typeof current.authType,
                      }))
                    }
                  >
                    <option value="">No service-level policy (inherit {selectedServiceGatewayAuthType})</option>
                    {allowedServiceSecurityModes.map((mode) => (
                      <option key={mode.label} value={mode.label}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="md:col-span-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="brand"
                    disabled={gateways.length === 0}
                    className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
                  >
                    Register Service
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                    onClick={() => setShowServiceForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}

            <div className="overflow-x-auto px-4 py-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service Name</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Base URL</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service Auth</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Status</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allServices.length === 0 ? (
                    <tr>
                      <td
                        className="px-3 py-5 text-[1rem] text-[var(--text-muted)]"
                        colSpan={6}
                      >
                        No services registered yet.
                      </td>
                    </tr>
                  ) : (
                    allServices.map((service) => {
                      const gateway = gateways.find((item) => item.gatewayId === service.gatewayId);
                      return (
                        <tr key={service.serviceId} className="text-[1rem] text-[var(--text-strong)]">
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <p className="font-semibold">{service.serviceName}</p>
                            <p className="text-sm text-[var(--text-muted)]">{service.serviceId}</p>
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3 font-mono text-sm">
                            https://{service.address}:{service.port}
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            {gateway?.gatewayName ?? service.gatewayId}
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                              {service.authType ?? "Per Route"}
                            </span>
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                              Healthy
                            </span>
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Server className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[color:color-mix(in_srgb,#e05f49_90%,#bc422f)]">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <StatusPanel status={serviceStatus} />
        </section>
      );
    }

    if (tab === "routes") {
      return (
        <section className="space-y-4">
          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Routes</p>
                <p className="text-[1rem] text-[var(--text-muted)]">Configure API routes and map public endpoints to backend services</p>
              </div>
              <Button
                type="button"
                variant="brand"
                className="h-10 rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                onClick={() => setShowRouteForm((current) => !current)}
              >
                {showRouteForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showRouteForm ? "Close" : "Add Route"}
              </Button>
            </header>

            {showRouteForm ? (
              <form className="grid gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4 md:grid-cols-2" onSubmit={submitRoute}>
                <Field label="Gateway">
                  <select
                    className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                    value={routeForm.gatewayId}
                    onChange={(event) => handleRouteGatewayChange(event.target.value)}
                  >
                    {gateways.length === 0 ? <option value="">Create a gateway first</option> : null}
                    {gateways.map((gateway) => (
                      <option key={gateway.gatewayId} value={gateway.gatewayId}>
                        {gateway.gatewayName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Target Service">
                  <select
                    className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                    value={routeForm.serviceId}
                    onChange={(event) => handleRouteServiceChange(event.target.value)}
                  >
                    {!selectedRouteGateway?.services.length ? <option value="">Register a service first</option> : null}
                    {selectedRouteGateway?.services.map((service) => (
                      <option key={service.serviceId} value={service.serviceId}>
                        {service.serviceName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Public Path">
                  <Input
                    value={routeForm.path}
                    onChange={(event) => setRouteForm((current) => ({ ...current, path: event.target.value }))}
                    placeholder="/api/endpoint"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                <Field label="Route ID">
                  <Input
                    value={routeForm.id}
                    onChange={(event) => setRouteForm((current) => ({ ...current, id: event.target.value }))}
                    placeholder="product-route-jwt"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                <Field label="Target URI">
                  <Input
                    value={routeForm.uri}
                    onChange={(event) => setRouteForm((current) => ({ ...current, uri: event.target.value }))}
                    placeholder="lb://product-service"
                    className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                  />
                </Field>
                {inheritedServiceAuthType ? (
                  <div className="rounded-[0.8rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-3 md:col-span-2">
                    <p className="text-sm font-medium text-[var(--accent-soft)]">Service Security (inherited)</p>
                    <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
                      This service enforces <span className="font-semibold text-[var(--text-strong)]">{inheritedServiceAuthType}</span>, so all routes in this service use the same security.
                    </p>
                  </div>
                ) : (
                  <>
                    <Field label="Route Security">
                      <select
                        className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                        value={routeForm.authType}
                        onChange={(event) =>
                          setRouteForm((current) => ({
                            ...current,
                            authType: event.target.value as typeof current.authType,
                          }))
                        }
                      >
                        <option value="">Use gateway default ({selectedRouteGatewayAuthType})</option>
                        {allowedRouteSecurityModes.map((mode) => (
                          <option key={mode.label} value={mode.label}>
                            {mode.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="rounded-[0.8rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-3 md:col-span-2">
                      <p className="text-sm font-medium text-[var(--accent-soft)]">Effective Security Preview</p>
                      <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
                        This route will resolve to <span className="font-semibold text-[var(--text-strong)]">{routePreviewAuthType}</span>.
                      </p>
                    </div>
                  </>
                )}
                <div className="md:col-span-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="brand"
                    disabled={!routeForm.gatewayId || !routeForm.serviceId}
                    className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)] disabled:opacity-50"
                  >
                    Create Route
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                    onClick={() => setShowRouteForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}

            <div className="overflow-x-auto px-4 py-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Route</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Service</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Auth</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allRoutes.length === 0 ? (
                    <tr>
                      <td className="px-3 py-5 text-[1rem] text-[var(--text-muted)]" colSpan={5}>
                        No routes published yet.
                      </td>
                    </tr>
                  ) : (
                    allRoutes.map((route) => (
                      <tr key={`${route.id}-${route.serviceId}`} className="text-[1rem] text-[var(--text-strong)]">
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <p className="font-semibold">{route.id}</p>
                          <p className="font-mono text-sm text-[var(--text-muted)]">{route.path}</p>
                        </td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{route.gatewayName}</td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">{route.serviceName}</td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <span className="rounded-full bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)] px-2.5 py-1 text-sm font-medium text-[var(--accent-soft)]">
                            {route.authType ?? "NONE"}
                          </span>
                        </td>
                        <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                          <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Route className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[color:color-mix(in_srgb,#e05f49_90%,#bc422f)]">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <StatusPanel status={routeStatus} />
        </section>
      );
    }

    if (tab === "security") {
      return (
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard icon={<Shield className="h-5 w-5" />} value={openRouteCount} label="Open (NONE)" helper="no auth policy" />
            <MetricCard icon={<Shield className="h-5 w-5" />} value={basicRouteCount} label="Basic Auth" helper="username/password" />
            <MetricCard icon={<Shield className="h-5 w-5" />} value={apiKeyRouteCount} label="API Key" helper="header or query key" />
            <MetricCard icon={<Shield className="h-5 w-5" />} value={jwtRouteCount} label="JWT" helper="token protected" />
            <MetricCard icon={<Shield className="h-5 w-5" />} value={oauth2RouteCount} label="OAuth2" helper="IAM bearer token" />
          </div>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Route Security Matrix</p>
            <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
              Security resolves in this order: service policy (if set), otherwise route policy, otherwise gateway default.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {supportedSecurityModes.map((mode) => (
                <div
                  key={mode.label}
                  className="rounded-[0.85rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-4 py-3"
                >
                  <p className="text-[1.08rem] font-semibold text-[var(--accent-soft)]">{mode.label}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{mode.detail}</p>
                </div>
              ))}
              {futureSecurityModes.map((mode) => (
                <div
                  key={mode.label}
                  className="rounded-[0.85rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_76%,transparent)] px-4 py-3"
                >
                  <p className="text-[1.08rem] font-semibold text-[var(--text-muted)]">{mode.label}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{mode.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      );
    }

    if (tab === "consumers") {
      return (
        <section className="space-y-4">
          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <div>
                <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Consumers</p>
                <p className="mt-1 max-w-3xl text-[1rem] text-[var(--text-muted)]">
                  Create reusable client identities, hand off credentials, and test JWT issuance for Basic Auth, API Key,
                  and JWT protected gateways.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                  onClick={() => void loadConsumers(selectedConsumerGatewayId, selectedConsumer?.username)}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                  onClick={() => setShowConsumerForm((current) => !current)}
                >
                  {showConsumerForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {showConsumerForm ? "Close form" : "Add Consumer"}
                </Button>
              </div>
            </header>

            <div className="space-y-4 px-4 py-4">
              <StatusPanel status={consumerStatus} />
              <div className="grid gap-4 rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                <Field label="Gateway Workspace">
                  <select
                    value={selectedConsumerGatewayId}
                    onChange={(event) => setSelectedConsumerGatewayId(event.target.value)}
                    className="h-11 w-full rounded-[0.7rem] border border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] bg-[var(--surface)] px-3 text-[var(--text-strong)]"
                  >
                    {gateways.map((gateway) => (
                      <option key={gateway.gatewayId} value={gateway.gatewayId}>
                        {gateway.gatewayName}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="rounded-[0.8rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-3">
                  <p className="text-sm font-medium text-[var(--accent-soft)]">Gateway Scope</p>
                  <p className="mt-1 text-[1rem] text-[var(--text-muted)]">
                    Consumers in <span className="font-semibold text-[var(--text-strong)]">{selectedConsumerGateway?.gatewayName ?? "this gateway"}</span> can
                    authenticate only against routes resolved inside this gateway.
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {selectedConsumerGatewayProtectedRouteCount} protected routes currently depend on consumer credentials here.
                  </p>
                </div>
              </div>
              {showConsumerForm ? (
                <form
                  onSubmit={submitConsumer}
                  className="grid gap-4 rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <Field label="Consumer Name">
                    <Input
                      value={consumerForm.consumerName}
                      onChange={(event) => setConsumerForm((current) => ({ ...current, consumerName: event.target.value }))}
                      placeholder="e.g., Partner Mobile App"
                      className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <Field label="Consumer Username">
                    <Input
                      value={consumerForm.username}
                      onChange={(event) => setConsumerForm((current) => ({ ...current, username: event.target.value }))}
                      placeholder="e.g., partner-client-1"
                      className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <Field label="Temporary Password">
                    <Input
                      type="password"
                      value={consumerForm.password}
                      onChange={(event) => setConsumerForm((current) => ({ ...current, password: event.target.value }))}
                      placeholder="Choose the password used for BASIC and JWT login"
                      className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                    />
                  </Field>
                  <div className="flex items-end gap-2">
                    <Button
                      type="submit"
                      variant="brand"
                      className="h-11 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                    >
                      <Plus className="h-4 w-4" />
                      Register Consumer
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-11 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                      onClick={() => setShowConsumerForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] xl:col-span-3">
                    Flow: create the identity in one gateway workspace, then use its username/password or API key only on
                    routes that resolve inside that same gateway.
                  </p>
                </form>
              ) : null}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<UserRound className="h-5 w-5" />}
              value={consumers.length}
              label="Registered Consumers"
              helper={consumers.length > 0 ? "Gateway-scoped client identities" : "Create your first consumer"}
            />
            <MetricCard
              icon={<Shield className="h-5 w-5" />}
              value={basicGatewayCount}
              label="Basic Auth Gateways"
              helper="Username + password traffic"
            />
            <MetricCard
              icon={<KeyRound className="h-5 w-5" />}
              value={apiKeyGatewayCount}
              label="API Key Gateways"
              helper="Header-based partner access"
            />
            <MetricCard
              icon={<ShieldCheck className="h-5 w-5" />}
              value={jwtGatewayCount}
              label="JWT Gateways"
              helper="Token issuance and bearer validation"
            />
          </div>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <p className="text-[1.3rem] font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Registered Consumers</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Manage gateway-scoped client identities the same way you manage services and routes, then open a consumer to issue JWTs or copy credentials.
              </p>
            </header>
            <div className="overflow-x-auto px-4 py-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Consumer</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Gateway</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Credentials</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">API Key</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Status</th>
                    <th className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consumers.length === 0 ? (
                    <tr>
                      <td className="px-3 py-5 text-[1rem] text-[var(--text-muted)]" colSpan={6}>
                        No consumers yet. Add a consumer first so you can issue JWTs or hand off API keys.
                      </td>
                    </tr>
                  ) : (
                    consumers.map((consumer) => {
                      const isSelected = selectedConsumer?.id === consumer.id;
                      return (
                        <tr
                          key={consumer.id}
                          className={`text-[1rem] text-[var(--text-strong)] ${isSelected ? "bg-[color:color-mix(in_srgb,var(--surface-soft)_38%,transparent)]" : ""}`}
                        >
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <p className="font-semibold">{consumer.consumerName}</p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {consumer.username} • Created {formatShortDate(consumer.createdAt)}
                            </p>
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            {selectedConsumerGateway?.gatewayId === consumer.gatewayId
                              ? selectedConsumerGateway.gatewayName
                              : gateways.find((gateway) => gateway.gatewayId === consumer.gatewayId)?.gatewayName ?? consumer.gatewayId}
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <AuthChip label="BASIC" active={basicGatewayCount > 0} />
                              <AuthChip label="API_KEY" active={apiKeyGatewayCount > 0} />
                              <AuthChip label="JWT" active={jwtGatewayCount > 0} />
                            </div>
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3 font-mono text-sm text-[var(--accent-soft)]">
                            {consumer.apiKeyPreview}
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <StatusBadge label={consumer.status} tone="success" />
                          </td>
                          <td className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_64%,transparent)] px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant={isSelected ? "brand" : "secondary"}
                                className={`h-9 rounded-[0.7rem] ${
                                  isSelected
                                    ? "border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                                    : "border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                                }`}
                                onClick={() => selectConsumer(consumer.username)}
                              >
                                {isSelected ? "Selected" : "Manage"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <p className="text-[1.3rem] font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Credential Workspace</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Select a consumer from the table above, then issue JWTs, validate bearer tokens, or hand off the API key to an API client.
              </p>
            </header>

            <div className="space-y-4 px-4 py-4">
              {selectedConsumer ? (
                <>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4">
                      <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">Identity</p>
                      <div className="mt-3 space-y-2">
                        <InfoLine label="Consumer Name" value={selectedConsumer.consumerName} />
                        <InfoLine label="Username" value={selectedConsumer.username} />
                        <InfoLine label="Gateway" value={selectedConsumerGateway?.gatewayName ?? selectedConsumer.gatewayId} />
                        <InfoLine label="Status" value={selectedConsumer.status} />
                        <InfoLine label="Created" value={formatShortDate(selectedConsumer.createdAt)} />
                        <InfoLine label="API Key Preview" value={selectedConsumer.apiKeyPreview} mono />
                      </div>
                    </div>

                    <div className="rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4">
                      <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">Credential Handoff</p>
                      {recentConsumerCredential?.username === selectedConsumer.username ? (
                        <div className="mt-3 space-y-3">
                          <CredentialLine
                            label="Username"
                            value={recentConsumerCredential.username}
                            onCopy={() => void copyValue(recentConsumerCredential.username, "Username copied")}
                          />
                          <CredentialLine
                            label="Password"
                            value={recentConsumerCredential.password}
                            onCopy={() => void copyValue(recentConsumerCredential.password, "Password copied")}
                          />
                          <CredentialLine
                            label="API Key"
                            value={recentConsumerCredential.apiKey}
                            onCopy={() => void copyValue(recentConsumerCredential.apiKey, "API key copied")}
                            mono
                          />
                          <p className="text-sm text-[var(--text-muted)]">
                            Full API key is only shown right after registration. Store it now, then use the preview for later reference.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-3">
                          <p className="text-[1rem] text-[var(--text-muted)]">
                            Passwords are not retrievable after creation. Use the original password for BASIC auth and JWT login,
                            and hand off the stored API key to clients that call API_KEY gateways.
                          </p>
                          <CredentialLine
                            label="API Key Preview"
                            value={selectedConsumer.apiKeyPreview}
                            mono
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <StatusPanel status={consumerJwtStatus} />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <form
                      onSubmit={issueConsumerJwt}
                      className="space-y-4 rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4"
                    >
                      <div>
                        <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">Issue JWT</p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          Use the consumer username/password pair to mint an access token scoped to the selected gateway.
                        </p>
                      </div>
                      <Field label="Consumer Username">
                        <Input
                          value={consumerLoginForm.username}
                          onChange={(event) =>
                            setConsumerLoginForm((current) => ({ ...current, username: event.target.value }))
                          }
                          className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                        />
                      </Field>
                      <Field label="Password">
                        <Input
                          type="password"
                          value={consumerLoginForm.password}
                          onChange={(event) =>
                            setConsumerLoginForm((current) => ({ ...current, password: event.target.value }))
                          }
                          placeholder="Enter the consumer password"
                          className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                        />
                      </Field>
                      <Button
                        type="submit"
                        variant="brand"
                        className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Issue Access Token
                      </Button>
                    </form>

                    <form
                      onSubmit={validateConsumerJwt}
                      className="space-y-4 rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4"
                    >
                      <div>
                        <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">Validate JWT</p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          Paste a bearer token or pull in the latest token issued from this workspace.
                        </p>
                      </div>
                      <Field label="Access Token">
                        <Textarea
                          value={tokenToValidate}
                          onChange={(event) => setTokenToValidate(event.target.value)}
                          placeholder="Paste bearer token here"
                          className="min-h-[132px] border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)] font-mono text-sm"
                        />
                      </Field>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="submit"
                          variant="brand"
                          className="h-10 rounded-[0.7rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
                        >
                          <Shield className="h-4 w-4" />
                          Validate Token
                        </Button>
                        {issuedConsumerToken ? (
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
                            onClick={() => setTokenToValidate(issuedConsumerToken.accessToken)}
                          >
                            Use latest token
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </div>

                  <StatusPanel status={consumerTokenValidationStatus} />

                  <div className="grid gap-4 lg:grid-cols-2">
                    <CodePanel
                      title="Latest JWT Session"
                      emptyMessage="Issue a JWT to see access and refresh tokens here."
                      primaryAction={
                        issuedConsumerToken
                          ? {
                              label: "Copy access token",
                              onClick: () => void copyValue(issuedConsumerToken.accessToken, "Access token copied"),
                            }
                          : null
                      }
                    >
                      {issuedConsumerToken ? (
                        <div className="space-y-3">
                          <InfoLine label="Principal" value={issuedConsumerToken.principal} />
                          <InfoLine label="Type" value={issuedConsumerToken.tokenType} />
                          <InfoLine label="Expires In" value={`${issuedConsumerToken.expiresIn} seconds`} />
                          <CredentialLine label="Access Token" value={issuedConsumerToken.accessToken} mono />
                          <CredentialLine label="Refresh Token" value={issuedConsumerToken.refreshToken} mono />
                        </div>
                      ) : null}
                    </CodePanel>

                    <CodePanel
                      title="Validation Result"
                      emptyMessage="Run token validation to confirm the JWT before calling the protected route."
                    >
                      {validatedConsumerToken ? (
                        <div className="space-y-2">
                          <InfoLine
                            label="Authenticated"
                            value={validatedConsumerToken.authenticated ? "true" : "false"}
                          />
                          <InfoLine label="Principal" value={validatedConsumerToken.principal} />
                          <InfoLine label="Type" value={validatedConsumerToken.authenticationType} />
                        </div>
                      ) : null}
                    </CodePanel>
                  </div>
                </>
              ) : (
                <EmptyRow message="Choose a consumer from the table above or register a new one to start issuing credentials." />
              )}
            </div>
          </section>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)]">
            <header className="border-b border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] px-4 py-4">
              <p className="text-[1.3rem] font-semibold tracking-[-0.04em] text-[var(--text-strong)]">Protected Gateway Coverage</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Consumers are reusable identities. Choose the credential format that matches the gateway security type, then
                call the route through the standard gateway.
              </p>
            </header>

            <div className="space-y-3 px-4 py-4">
              {protectedGateways.length === 0 ? (
                <EmptyRow message="No protected gateways yet. Create BASIC, API_KEY, or JWT gateways to make this tab operational." />
              ) : (
                protectedGateways.map((gateway) => (
                  <div
                    key={gateway.gatewayId}
                    className="flex flex-wrap items-center gap-3 rounded-[0.9rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--accent-soft)]">
                      <Waypoints className="h-5 w-5" />
                    </div>
                    <div className="min-w-[220px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">{gateway.gatewayName}</p>
                        <AuthChip label={gateway.authType} active />
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {gateway.serviceCount} services • {gateway.routeCount} routes • {consumerFlowHint(gateway.authType)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </section>
      );
    }

    if (tab === "settings") {
      return (
        <section className="space-y-4">
          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Profile Information</p>
            <div className="mt-4 grid gap-3">
              <Field label="Name">
                <Input
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                />
              </Field>
              <Field label="Email">
                <Input
                  value={profileEmail}
                  onChange={(event) => setProfileEmail(event.target.value)}
                  className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                />
              </Field>
              <Button
                type="button"
                variant="brand"
                className="h-10 w-fit rounded-[0.72rem] border border-[var(--border-strong)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-bright)]"
              >
                Save Changes
              </Button>
            </div>
          </section>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">API Configuration</p>
            <div className="mt-4 grid gap-3">
              <Field label="Default Base URL">
                <Input
                  value={defaultBaseUrl}
                  onChange={(event) => setDefaultBaseUrl(event.target.value)}
                  className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                />
              </Field>
              <Field label="Default Timeout (ms)">
                <Input
                  value={defaultTimeout}
                  onChange={(event) => setDefaultTimeout(event.target.value)}
                  className="h-11 border-[color:color-mix(in_srgb,var(--border-soft)_78%,transparent)]"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
            <p className="text-[2rem] font-semibold tracking-[-0.045em] text-[var(--text-strong)]">Notifications</p>
            <div className="mt-4 space-y-3">
              <ToggleRow
                label="Email Notifications"
                detail="Receive alerts about gateway status"
                checked={emailNotifications}
                onToggle={() => setEmailNotifications((current) => !current)}
              />
              <ToggleRow
                label="Security Alerts"
                detail="Get notified about route security events"
                checked={securityAlerts}
                onToggle={() => setSecurityAlerts((current) => !current)}
              />
            </div>
          </section>
        </section>
      );
    }

    return null;
  }

  return renderContent(activeTab);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[var(--accent-soft)]">
      {label}
      {children}
    </label>
  );
}

function MetricCard({
  icon,
  value,
  label,
  helper,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  helper: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[color:color-mix(in_srgb,var(--border-soft)_72%,transparent)] bg-[var(--surface)] px-4 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] text-[var(--accent-soft)]">
        {icon}
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--accent-soft)]">{value}</p>
      <p className="mt-1 text-[1rem] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm text-[color:color-mix(in_srgb,#c9852b_92%,#a7641b)]">{helper}</p>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-2 border-b border-[color:color-mix(in_srgb,var(--border-soft)_60%,transparent)] py-2 last:border-0">
      <p className="text-[1rem] text-[var(--text-muted)]">{label}</p>
      <p className="text-[1rem] font-medium text-[var(--accent-soft)]">{value}</p>
    </div>
  );
}

function StatusPanel({ status }: { status: StatusState }) {
  if (!status) {
    return null;
  }

  const toneClass =
    status.tone === "success"
      ? "border-[color:color-mix(in_srgb,var(--accent)_26%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_92%,transparent)]"
      : status.tone === "error"
        ? "border-[color:color-mix(in_srgb,#e05f49_42%,transparent)] bg-[color:color-mix(in_srgb,#ffcfca_36%,transparent)]"
        : "border-[color:color-mix(in_srgb,#d8aa45_40%,transparent)] bg-[color:color-mix(in_srgb,#ffe4a8_28%,transparent)]";

  return (
    <div className={`rounded-[0.8rem] border px-4 py-3 ${toneClass}`}>
      <div className="flex items-center gap-2">
        <CircleAlert className="h-4 w-4 text-[var(--text-muted)]" />
        <p className="text-[1rem] font-medium text-[var(--text-strong)]">{status.message}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  detail,
  checked,
  onToggle,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-3 rounded-[0.8rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] px-4 py-3 text-left"
    >
      <div>
        <p className="text-[1.05rem] font-medium text-[var(--text-strong)]">{label}</p>
        <p className="text-sm text-[var(--text-muted)]">{detail}</p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-sm font-medium ${
          checked
            ? "bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] text-[var(--accent-soft)]"
            : "bg-[color:color-mix(in_srgb,var(--surface-muted)_92%,transparent)] text-[var(--text-muted)]"
        }`}
      >
        {checked ? "On" : "Off"}
      </span>
    </button>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Button
      variant="secondary"
      asChild
      className="h-10 rounded-[0.7rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
    >
      <a href={href}>
        {label}
        <ChevronRight className="h-4 w-4" />
      </a>
    </Button>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-[0.85rem] border border-dashed border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,transparent)] px-4 py-6 text-[1rem] text-[var(--text-muted)]">
      {message}
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "neutral";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        tone === "success"
          ? "bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] text-[var(--accent-soft)]"
          : "bg-[color:color-mix(in_srgb,var(--surface-muted)_90%,transparent)] text-[var(--text-muted)]"
      }`}
    >
      {label}
    </span>
  );
}

function AuthChip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold tracking-[0.18em] ${
        active
          ? "border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_90%,transparent)] text-[var(--accent-soft)]"
          : "border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] text-[var(--text-muted)]"
      }`}
    >
      {label}
    </span>
  );
}

function InfoLine({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 border-b border-[color:color-mix(in_srgb,var(--border-soft)_60%,transparent)] py-2 last:border-0">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p className={`text-sm text-[var(--text-strong)] ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function CredentialLine({
  label,
  value,
  mono = false,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="rounded-[0.8rem] border border-[color:color-mix(in_srgb,var(--border-soft)_74%,transparent)] bg-[var(--surface)] px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
          <p className={`mt-1 break-all text-sm text-[var(--text-strong)] ${mono ? "font-mono" : ""}`}>{value}</p>
        </div>
        {onCopy ? (
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-[0.65rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function CodePanel({
  title,
  emptyMessage,
  primaryAction,
  children,
}: {
  title: string;
  emptyMessage: string;
  primaryAction?: { label: string; onClick: () => void } | null;
  children: ReactNode;
}) {
  const hasContent = Boolean(children);

  return (
    <div className="rounded-[0.95rem] border border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-[color:color-mix(in_srgb,var(--surface)_96%,transparent)] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[1.08rem] font-semibold text-[var(--text-strong)]">{title}</p>
        {primaryAction ? (
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-[0.65rem] border-[color:color-mix(in_srgb,var(--border-soft)_76%,transparent)] bg-transparent text-[var(--accent-soft)] hover:bg-[var(--surface-soft)]"
            onClick={primaryAction.onClick}
          >
            <Copy className="h-4 w-4" />
            {primaryAction.label}
          </Button>
        ) : null}
      </div>

      <div className="mt-3">
        {hasContent ? (
          children
        ) : (
          <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function consumerFlowHint(authType: string) {
  if (authType === "BASIC") {
    return "Use the consumer username and password directly on the route.";
  }

  if (authType === "API_KEY") {
    return "Hand off the issued API key and send it as X-API-Key.";
  }

  if (authType === "JWT") {
    return "Login here first, then forward the access token as Bearer.";
  }

  return "Open route with no consumer credential required.";
}
