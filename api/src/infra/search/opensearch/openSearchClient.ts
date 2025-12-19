import { env } from "@/infra/config/env";
import { Client } from "@opensearch-project/opensearch";

export const openSearchClient = new Client({
  node: env.OPENSEARCH_URI,
});
