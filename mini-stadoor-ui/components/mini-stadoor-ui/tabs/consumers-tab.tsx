"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { KeyRound, Plus, RefreshCcw, Shield, ShieldCheck, UserRound, Waypoints, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type ConsumerForm,
  type ConsumerLoginForm,
  type ConsumerRegistrationResult,
  type ConsumerSummary,
  type ConsumerTokenResult,
  type ConsumerTokenValidationResult,
  type GatewaySummary,
  type ProtectedGatewaySummary,
  type StatusState,
} from "@/components/mini-stadoor-ui/model";
import {
  AuthChip,
  CodePanel,
  consumerFlowHint,
  CredentialLine,
  EmptyRow,
  Field,
  formatShortDate,
  InfoLine,
  MetricCard,
  StatusBadge,
  StatusPanel,
} from "@/components/mini-stadoor-ui/ui-primitives";

type RecentConsumerCredential = ConsumerRegistrationResult & { password: string };

type ConsumersTabProps = {
  gateways: GatewaySummary[];
  consumers: ConsumerSummary[];
  selectedConsumerGatewayId: string;
  setSelectedConsumerGatewayId: Dispatch<SetStateAction<string>>;
  selectedConsumerGateway: GatewaySummary | null;
  selectedConsumerGatewayProtectedRouteCount: number;
  showConsumerForm: boolean;
  setShowConsumerForm: Dispatch<SetStateAction<boolean>>;
  consumerForm: ConsumerForm;
  setConsumerForm: Dispatch<SetStateAction<ConsumerForm>>;
  onSubmitConsumer: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  consumerStatus: StatusState;
  selectedConsumer: ConsumerSummary | null;
  selectConsumer: (username: string) => void;
  consumerLoginForm: ConsumerLoginForm;
  setConsumerLoginForm: Dispatch<SetStateAction<ConsumerLoginForm>>;
  onIssueConsumerJwt: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  consumerJwtStatus: StatusState;
  tokenToValidate: string;
  setTokenToValidate: Dispatch<SetStateAction<string>>;
  onValidateConsumerJwt: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  consumerTokenValidationStatus: StatusState;
  issuedConsumerToken: ConsumerTokenResult | null;
  validatedConsumerToken: ConsumerTokenValidationResult | null;
  recentConsumerCredential: RecentConsumerCredential | null;
  onCopyValue: (value: string, successMessage: string) => Promise<void>;
  onRefreshConsumers: () => void | Promise<void>;
  protectedGateways: ProtectedGatewaySummary[];
  basicGatewayCount: number;
  apiKeyGatewayCount: number;
  jwtGatewayCount: number;
};

export function ConsumersTabPanel({
  gateways,
  consumers,
  selectedConsumerGatewayId,
  setSelectedConsumerGatewayId,
  selectedConsumerGateway,
  selectedConsumerGatewayProtectedRouteCount,
  showConsumerForm,
  setShowConsumerForm,
  consumerForm,
  setConsumerForm,
  onSubmitConsumer,
  consumerStatus,
  selectedConsumer,
  selectConsumer,
  consumerLoginForm,
  setConsumerLoginForm,
  onIssueConsumerJwt,
  consumerJwtStatus,
  tokenToValidate,
  setTokenToValidate,
  onValidateConsumerJwt,
  consumerTokenValidationStatus,
  issuedConsumerToken,
  validatedConsumerToken,
  recentConsumerCredential,
  onCopyValue,
  onRefreshConsumers,
  protectedGateways,
  basicGatewayCount,
  apiKeyGatewayCount,
  jwtGatewayCount,
}: ConsumersTabProps) {
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
              onClick={() => void onRefreshConsumers()}
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
              onSubmit={onSubmitConsumer}
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
                        onCopy={() => void onCopyValue(recentConsumerCredential.username, "Username copied")}
                      />
                      <CredentialLine
                        label="Password"
                        value={recentConsumerCredential.password}
                        onCopy={() => void onCopyValue(recentConsumerCredential.password, "Password copied")}
                      />
                      <CredentialLine
                        label="API Key"
                        value={recentConsumerCredential.apiKey}
                        onCopy={() => void onCopyValue(recentConsumerCredential.apiKey, "API key copied")}
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
                  onSubmit={onIssueConsumerJwt}
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
                  onSubmit={onValidateConsumerJwt}
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
                          onClick: () => void onCopyValue(issuedConsumerToken.accessToken, "Access token copied"),
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
