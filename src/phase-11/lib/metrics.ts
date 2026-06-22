/**
 * Minimal in-process metrics — conceptual stand-in for Prometheus / Application Insights.
 *
 * Production: export counters/histograms via prom-client or OpenTelemetry SDK.
 * C# equivalent: System.Diagnostics.Metrics / OpenTelemetry.Instrumentation.AspNetCore
 */

const counters = new Map<string, number>();

export function incrementCounter(name: string, delta = 1): void {
  counters.set(name, (counters.get(name) ?? 0) + delta);
}

export function getMetricsSnapshot(): Record<string, number> {
  return Object.fromEntries(counters);
}
