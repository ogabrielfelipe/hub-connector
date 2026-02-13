import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/shared/components/ui/item"
import { ChartNoAxesColumn, Circle, Timer, Waypoints } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { GetReportDashboard200 } from "@/shared/api/hubConnectorAPI";

interface DashboardPresenterProps {
    dashboardData: GetReportDashboard200 | undefined;
    isLoading: boolean;
}

export default function DashboardPresenter({ dashboardData, isLoading }: DashboardPresenterProps) {

    const chartConfig = {
        traffic: {
            label: "Tráfego",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    return (
        <PrivateTemplate title="Visão Geral" isLoading={isLoading}>
            <div>
                <h1 className="text-2xl font-bold">Visão Geral</h1>
                <p className="text-muted-foreground">Monitoramento das ultimas 24h.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-auto my-16 justify-items-center">
                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                            <Waypoints className="w-12 h-12 p-2  rounded-lg" />
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Rotas Ativas</h4>
                            <p className="text-muted-foreground text-5xl">{dashboardData?.total_routes}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                            <ChartNoAxesColumn className="w-12 h-12 p-2  rounded-lg" />
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Requisições</h4>
                            <p className="text-muted-foreground text-5xl">{dashboardData?.requests_today}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                            <Timer className="w-12 h-12 p-2  rounded-lg" />
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Latência Média</h4>
                            <p className="text-muted-foreground text-5xl">{dashboardData?.latency_average.toFixed(2)}<span className="text-xl">ms</span></p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2 w-full">
                <Card className="w-full h-auto col-span-2">
                    <CardHeader className="flex flex-row justify-between">
                        <div>
                            <h4 className="text-lg font-bold">Tráfego de APIs</h4>
                            <p className="text-muted-foreground">Volume de requisições por API</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={Object.entries(dashboardData?.traffic_per_route ?? {})
                                    .map(([key, value]) => ({
                                        route: key,
                                        traffic: value,
                                    }))
                                    .sort((a, b) => b.traffic - a.traffic)}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />

                                <XAxis
                                    dataKey="route"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value: string) => value.slice(0, 10) + "..."}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    allowDecimals={false}
                                />

                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />

                                <Area
                                    dataKey="traffic"
                                    type="natural"
                                    fill="var(--color-traffic)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-traffic)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>

                    </CardContent>
                </Card>

                <Card className="w-full h-auto col-span-1">
                    <CardHeader>
                        <h1>Monitoramento de rotas</h1>
                        <p>Rotas com erros</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 max-h-[calc(100vh-25rem)] overflow-y-auto">

                        {Object.entries(dashboardData?.percent_error_per_route ?? {}).map(([key, value]) => (
                            <Item variant="default" className="bg-red-500/10 border-red-500/20">
                                <ItemMedia variant="default" className="">
                                    <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className="text-sm">{key}</ItemTitle>
                                    <ItemDescription className="text-xs">
                                        {value} requisições com erro
                                    </ItemDescription>
                                </ItemContent>
                            </Item>
                        ))}


                    </CardContent>
                </Card>
            </div>
        </PrivateTemplate>
    )
}