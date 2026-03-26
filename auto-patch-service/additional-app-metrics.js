import { Counter, Histogram } from "prom-client";


export const patchAttempts = new Counter({
    name: "patch_attempts_total",
    help: "Total number of image patch attempts",
    labelNames: ["status"]
})

export const patchDuration = new Histogram({
    name: "image_patch_duration_seconds",
    help: "Time spent on auto-patching",
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30]
})