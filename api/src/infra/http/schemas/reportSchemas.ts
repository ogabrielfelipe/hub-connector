import z from "zod";

export const dashReportResponseSchema = z.object({
  total_routes: z.number(),
  requests_today: z.number(),
  latency_average: z.number(),
  percent_error_per_route: z.record(z.string(), z.number()),
  traffic_per_route: z.record(z.string(), z.number()),
});
