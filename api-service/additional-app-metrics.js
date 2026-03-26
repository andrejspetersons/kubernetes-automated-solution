import { collectDefaultMetrics, Counter, Histogram } from "prom-client";

collectDefaultMetrics()

export const apiServiceRequestCounter =new Counter({
    name: "api_service_request_total",
    help: "Total number of requests to Service API",
    labelNames: ["endpoint","method","status"]
})

export const apiRequestDuration = new Histogram({
    name: "api_service_request_duration",
    help: "API request duration in seconds",
    labelNames: ["endpoint"],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5]
})