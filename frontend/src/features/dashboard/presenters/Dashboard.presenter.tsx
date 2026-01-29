import PrivateTemplate from "@/shared/components/templates/privateTemplate";
import { Button } from "@/shared/components/ui/button";
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
import { Circle, Waypoints } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";


export default function DashboardPresenter() {

    const chartData = [
        { dia: "27/01", desktop: 186 },
        { dia: "28/01", desktop: 305 },
        { dia: "29/01", desktop: 237 },
        { dia: "30/01", desktop: 73 },
        { dia: "31/01", desktop: 209 },
        { dia: "01/02", desktop: 214 },
    ]


    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig


    return (
        <PrivateTemplate>
            <div>
                <h1 className="text-2xl font-bold">Visão Geral</h1>
                <p className="text-muted-foreground">Status em tempo real da infraestrutura de APIs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-auto my-16 justify-items-center">
                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                                <Waypoints className="w-12 h-12 p-2  rounded-lg" />
                            </div>
                            <div className="w-12 h-auto flex items-center justify-center bg-green-600 text-white p-1 rounded-lg">
                                <span className="text-sm">+2,4%</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Rotas Ativas</h4>
                            <p className="text-muted-foreground text-5xl">245</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                                <Waypoints className="w-12 h-12 p-2  rounded-lg" />
                            </div>
                            <div className="w-12 h-auto flex items-center justify-center bg-green-600 text-white p-1 rounded-lg">
                                <span className="text-sm">+2,4%</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Rotas Ativas</h4>
                            <p className="text-muted-foreground text-5xl">245</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-80 h-auto">
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-row gap-2 items-center justify-between">
                            <div className="w-12 h-12 flex items-center justify-center bg-accent p-1 rounded-lg">
                                <Waypoints className="w-12 h-12 p-2  rounded-lg" />
                            </div>
                            <div className="w-12 h-auto flex items-center justify-center bg-green-600 text-white p-1 rounded-lg">
                                <span className="text-sm">+2,4%</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold">Rotas Ativas</h4>
                            <p className="text-muted-foreground text-5xl">245</p>
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

                        <div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue defaultValue="7d" placeholder="7d" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d" >7 Dias</SelectItem>
                                    <SelectItem value="30d">30 Dias</SelectItem>
                                    <SelectItem value="3m">3 Meses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="dia"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 5)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="w-full h-auto col-span-1">
                    <CardHeader>
                        <h1>Status das Rotas</h1>
                        <p>Monitoramento de rotas</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 max-h-[calc(100vh-25rem)] overflow-y-auto">
                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>

                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>


                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>



                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>

                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>

                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>

                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                        <Item variant="default" className="bg-red-500/10 border-red-500/20">
                            <ItemMedia variant="default" className="">
                                <Circle className="w-4 h-4 text-red-500" fill="currentColor" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm">Criação de Pedido (v2/create-products)</ItemTitle>
                                <ItemDescription className="text-xs">
                                    95% de erros
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                    </CardContent>
                </Card>
            </div>
        </PrivateTemplate>
    )
}