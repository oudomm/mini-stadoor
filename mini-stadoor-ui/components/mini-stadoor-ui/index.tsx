"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  initialConsumerForm,
  initialConsumerLoginForm,
  initialGatewayForm,
  initialRouteForm,
  initialServiceForm,
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
} from "@/components/mini-stadoor-ui/model";
import {
  ClientTabPlaceholder,
  IamSettingsPlaceholder,
  RoleTabPlaceholder,
  TunnelCliPlaceholder,
  UserTabPlaceholder,
} from "@/components/mini-stadoor-ui/iam-placeholder-tabs";
import {
  ConsumersTabPanel,
  DashboardTabPanel,
  GatewaysTabPanel,
  RoutesTabPanel,
  ServicesTabPanel,
} from "@/components/mini-stadoor-ui/tabs";
import {
  countProtectedRoutes,
  countProtectedRoutesInGateway,
  toAllRoutes,
  toAllServices,
  toGatewayRows,
  toProtectedGateways,
} from "@/components/mini-stadoor-ui/selectors";

type WizardStep = 1 | 2;

export function DeveloperPortal({
  activeTab,
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
        workspaceType: gatewayForm.workspaceType,
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
        workspaceType: initialGatewayForm.workspaceType,
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

    const payload = { ...routeForm };

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
    }));
  }

  function handleRouteServiceChange(serviceId: string) {
    const service = selectedRouteGateway?.services.find((item) => item.serviceId === serviceId);
    setRouteForm((current) => ({
      ...current,
      serviceId,
      uri: service ? `lb://${service.serviceName}` : current.uri,
    }));
  }

  const allServices = useMemo(() => toAllServices(gateways), [gateways]);
  const allRoutes = useMemo(() => toAllRoutes(gateways, allServices), [gateways, allServices]);
  const selectedRouteGateway =
    gateways.find((gateway) => gateway.gatewayId === routeForm.gatewayId) ?? gateways[0] ?? null;
  const selectedServiceGateway =
    gateways.find((gateway) => gateway.gatewayId === serviceForm.gatewayId) ?? gateways[0] ?? null;
  const selectedConsumerGateway =
    gateways.find((gateway) => gateway.gatewayId === selectedConsumerGatewayId) ?? gateways[0] ?? null;
  const selectedConsumer =
    consumers.find((consumer) => consumer.username === selectedConsumerUsername) ?? consumers[0] ?? null;
  const selectedServiceGatewayAuthType = selectedServiceGateway?.authType ?? "NONE";
  const selectedRouteGatewayAuthType = selectedRouteGateway?.authType ?? "NONE";

  const protectedRouteCount = useMemo(() => countProtectedRoutes(allRoutes), [allRoutes]);
  const gatewayCount = gateways.length;
  const serviceCount = allServices.length;
  const routeCount = allRoutes.length;
  const protectedGateways = useMemo(() => toProtectedGateways(gateways), [gateways]);
  const basicGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "BASIC").length;
  const apiKeyGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "API_KEY").length;
  const jwtGatewayCount = protectedGateways.filter((gateway) => gateway.authType === "JWT").length;
  const selectedConsumerGatewayProtectedRouteCount = countProtectedRoutesInGateway(selectedConsumerGateway);

  const gatewayRows = useMemo(() => toGatewayRows(gateways), [gateways]);

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
        <DashboardTabPanel
          gatewayCount={gatewayCount}
          serviceCount={serviceCount}
          routeCount={routeCount}
          protectedRouteCount={protectedRouteCount}
          gatewayRows={gatewayRows}
        />
      );
    }

    if (tab === "gateways") {
      return (
        <GatewaysTabPanel
          showGatewayForm={showGatewayForm}
          setShowGatewayForm={setShowGatewayForm}
          gatewayWizardSteps={gatewayWizardSteps}
          gatewayStep={gatewayStep}
          setGatewayStep={setGatewayStep}
          gatewayForm={gatewayForm}
          setGatewayForm={setGatewayForm}
          canGoNext={canGoNext}
          isPending={isPending}
          onSubmitGateway={() => submitGateway()}
          gatewayStatus={gatewayStatus}
          gatewayRows={gatewayRows}
          onRefreshGateways={() => loadGateways()}
        />
      );
    }

    if (tab === "services") {
      return (
        <ServicesTabPanel
          allServices={allServices}
          gateways={gateways}
          showServiceForm={showServiceForm}
          setShowServiceForm={setShowServiceForm}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          serviceBaseUrl={serviceBaseUrl}
          setServiceBaseUrl={setServiceBaseUrl}
          selectedServiceGatewayAuthType={selectedServiceGatewayAuthType}
          onSubmitService={submitService}
          serviceStatus={serviceStatus}
        />
      );
    }

    if (tab === "routes") {
      return (
        <RoutesTabPanel
          allRoutes={allRoutes}
          gateways={gateways}
          selectedRouteGateway={selectedRouteGateway}
          routeForm={routeForm}
          setRouteForm={setRouteForm}
          showRouteForm={showRouteForm}
          setShowRouteForm={setShowRouteForm}
          selectedRouteGatewayAuthType={selectedRouteGatewayAuthType}
          onRouteGatewayChange={handleRouteGatewayChange}
          onRouteServiceChange={handleRouteServiceChange}
          onSubmitRoute={submitRoute}
          routeStatus={routeStatus}
        />
      );
    }

    if (tab === "clients") {
      return <ClientTabPlaceholder />;
    }

    if (tab === "roles") {
      return <RoleTabPlaceholder />;
    }

    if (tab === "consumers") {
      return (
        <ConsumersTabPanel
          gateways={gateways}
          consumers={consumers}
          selectedConsumerGatewayId={selectedConsumerGatewayId}
          setSelectedConsumerGatewayId={setSelectedConsumerGatewayId}
          selectedConsumerGateway={selectedConsumerGateway}
          selectedConsumerGatewayProtectedRouteCount={selectedConsumerGatewayProtectedRouteCount}
          showConsumerForm={showConsumerForm}
          setShowConsumerForm={setShowConsumerForm}
          consumerForm={consumerForm}
          setConsumerForm={setConsumerForm}
          onSubmitConsumer={submitConsumer}
          consumerStatus={consumerStatus}
          selectedConsumer={selectedConsumer}
          selectConsumer={selectConsumer}
          consumerLoginForm={consumerLoginForm}
          setConsumerLoginForm={setConsumerLoginForm}
          onIssueConsumerJwt={issueConsumerJwt}
          consumerJwtStatus={consumerJwtStatus}
          tokenToValidate={tokenToValidate}
          setTokenToValidate={setTokenToValidate}
          onValidateConsumerJwt={validateConsumerJwt}
          consumerTokenValidationStatus={consumerTokenValidationStatus}
          issuedConsumerToken={issuedConsumerToken}
          validatedConsumerToken={validatedConsumerToken}
          recentConsumerCredential={recentConsumerCredential}
          onCopyValue={copyValue}
          onRefreshConsumers={() => loadConsumers(selectedConsumerGatewayId, selectedConsumer?.username)}
          protectedGateways={protectedGateways}
          basicGatewayCount={basicGatewayCount}
          apiKeyGatewayCount={apiKeyGatewayCount}
          jwtGatewayCount={jwtGatewayCount}
        />
      );
    }

    if (tab === "users") {
      return <UserTabPlaceholder />;
    }

    if (tab === "tunnel-cli") {
      return <TunnelCliPlaceholder />;
    }

    if (tab === "settings") {
      return <IamSettingsPlaceholder />;
    }

    return null;
  }

  return renderContent(activeTab);
}
