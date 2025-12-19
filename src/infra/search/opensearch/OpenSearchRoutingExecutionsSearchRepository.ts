/* eslint-disable @typescript-eslint/no-explicit-any */
import { openSearchClient } from "./openSearchClient";
import {
    IRoutingExecutionSearchRepository,
    RoutingExecutionSearchParams,
    RoutingExecutionSearchResult,
} from "../../../core/domain/routing/repositories/IRoutingExecutionSearchRepository";
import { TotalHits } from "@opensearch-project/opensearch/api/_types/_core.search";

export class OpenSearchRoutingExecutionsSearchRepository
    implements IRoutingExecutionSearchRepository {
    async search(
        params: RoutingExecutionSearchParams
    ): Promise<RoutingExecutionSearchResult<any>> {
        const { routingId, status, text, from, to, page, perPage } = params;

        // Build the query
        const must: any[] = [];

        if (routingId) {
            must.push({ term: { "routingId.keyword": routingId } });
        }

        if (status) {
            must.push({ term: { "status.keyword": status } });
        }

        if (text) {
            must.push({
                multi_match: {
                    query: text,
                    fields: ["payload", "params", "logExecution"],
                },
            });
        }

        if (from || to) {
            const range: any = {};
            if (from) range.gte = from;
            if (to) range.lte = to;
            must.push({
                range: {
                    "@timestamp": range,
                },
            });
        }

        // Calculate pagination
        const offset = (page - 1) * perPage;

        console.log(must);
        console.log(JSON.stringify({
            query: {
                bool: {
                    must: must.length > 0 ? must : [{ match_all: {} }],
                },
            },
        }))

        // Execute search
        const result = await openSearchClient.search({
            index: "routing-executions",
            body: {
                query: {
                    bool: {
                        must: must.length > 0 ? must : [{ match_all: {} }],
                    },
                },
                from: offset,
                size: perPage,
                sort: [{ "@timestamp": { order: "desc" } }],
            },
        });


        // Extract items from hits
        const items = result.body.hits.hits.map((hit: any) => ({
            id: hit._source.id,
            routingId: hit._source.routingId,
            status: hit._source.success ? "COMPLETED" : "FAILED",
            payload: hit._source.payload,
            params: hit._source.params,
            logExecution: hit._source.logExecution,
            createdAt: hit._source.createdAt,
            updatedAt: hit._source["@timestamp"],
        }));

        return {
            items,
            total: (result.body.hits.total as TotalHits).value,
            page,
            perPage,
        };
    }
}