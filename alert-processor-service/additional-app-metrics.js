import { collectDefaultMetrics, Counter, Histogram } from "prom-client";

collectDefaultMetrics();

export const alertsReceived = new Counter({
    name: 'alerts_received_total',
    help: 'Total number of alerts received from Alertmanager'
})

export const alertsForwarded = new Counter({
    name: 'alerts_forwarded_total',
    help: 'Total number of alerts forwarded to save',
    labelNames: ['status']
})

export const alertsDuration = new Histogram({
  name: 'alerts_processing_duration_seconds',
  help: 'Time spent on processing alerts',
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
})
