export default {
    hub: {
        input: "../api/swagger.json",
        output: {
            target: "src/api",
            client: "react-query",
            override: {
                mutator: {
                    path: "src/api/http.ts",
                    name: "customFetcher",
                },
            }
        },
    },
};
