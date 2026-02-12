import { useState } from "react"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import { ChevronDown, ChevronUp, ExternalLink, RotateCcw } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { format } from "date-fns"
import { Link } from "react-router-dom"

type Props = {
    id: string
    status: number
    timestamp: string
    method: string
    route: { url: string, name: string }
    latency: string
    requestPayload: object
    responseTrace: object
}

export function RequestLogItem({
    id,
    status,
    timestamp,
    method,
    route,
    latency,
    requestPayload,
    responseTrace,
}: Props) {
    const [open, setOpen] = useState(false)

    const statusColor =
        status >= 500
            ? "bg-red-100 text-red-600"
            : status >= 400
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"

    const statusColorBar =
        status >= 500
            ? "border-l-red-500"
            : status >= 400
                ? "border-l-yellow-500"
                : "border-l-green-500"

    const methodColor =
        method === "POST"
            ? "bg-purple-100 text-purple-700"
            : method === "GET"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"

    return (
        <div className="border rounded-md mt-4">
            <div
                className={`flex items-center justify-evenly px-4 py-3 cursor-pointer hover:bg-muted/40 transition
                ${open ? "border-l-4  rounded-t-md " + statusColorBar : "border-l-4  rounded-md " + statusColorBar}
                `}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center justify-evenly gap-6 text-sm w-full">
                    <Badge className={cn("rounded-md", statusColor)}>
                        {status}
                    </Badge>

                    <span className="text-muted-foreground whitespace-nowrap">
                        {format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss")}
                    </span>

                    <Badge variant="secondary" className={methodColor}>
                        {method}
                    </Badge>

                    <span className="font-medium truncate">{route.name} <h6 className="text-muted-foreground text-xs">{route.url}</h6></span>

                    <span className="text-red-500 font-medium whitespace-nowrap">
                        {latency}<h6 className="text-muted-foreground text-xs inline-block">ms</h6>
                    </span>

                </div>

                {open ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </div>

            {open && (
                <>
                    <Separator />

                    {/* BODY */}
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-muted/20">
                        {/* REQUEST */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                                REQUEST PAYLOAD
                            </h4>

                            <div className="bg-slate-950 text-slate-100 rounded-xl p-4 text-xs overflow-auto">
                                <pre>
                                    {JSON.stringify(requestPayload, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* RESPONSE */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                                RESPONSE TRACE
                            </h4>

                            <div className="bg-slate-950 text-red-400 rounded-xl p-4 text-xs overflow-auto">
                                <pre>
                                    {JSON.stringify(responseTrace, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 p-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/transactions/${id}`} target="_blank">
                                Log Completo
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>

                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reenviar
                        </Button>
                    </div>
                </>
            )}
        </div>

    )
}
