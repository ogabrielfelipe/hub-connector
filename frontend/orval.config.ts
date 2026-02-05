export default {
    hub: {
        input: "../api/swagger.json",
        output: {
            target: "src/shared/api",
            client: "react-query",
            override: {
                mutator: {
                    path: "src/shared/api/http.ts",
                    name: "customFetcher",
                },
            }
        },
    },
};
