/**
 * Liveness vs readiness — Kubernetes / load balancer concepts.
 *
 * C# equivalent:
 *   /health/live  ≈  "Is the process running?" (IHealthCheck that always passes)
 *   /health/ready ≈  "Can we accept traffic?" (DB connected, config valid, warm)
 */

export type HealthStatus = 'ok' | 'degraded' | 'down';

export type LivenessResponse = {
  status: HealthStatus;
  uptimeSeconds: number;
};

export type ReadinessResponse = {
  status: HealthStatus;
  checks: {
    openaiApiKeyConfigured: boolean;
  };
};

const startedAt = Date.now();

export function getLiveness(): LivenessResponse {
  return {
    status: 'ok',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  };
}

export function getReadiness(openaiApiKeySet: boolean): ReadinessResponse {
  const ready = openaiApiKeySet;

  return {
    status: ready ? 'ok' : 'down',
    checks: {
      openaiApiKeyConfigured: openaiApiKeySet,
    },
  };
}
