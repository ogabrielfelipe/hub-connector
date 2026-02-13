import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"

import { Link, useLocation } from "react-router-dom"

const breadcrumbNameMap: Record<string, string> = {
    "dashboard": "Dashboard",
    "users": "Acessos",
    "gateways": "Gateways",
    "routes": "Rotas",
    "transactions": "Transações",
    "edit": "Editar",
    "new": "Novo",
}

export function BreadcrumbCustom() {
    const location = useLocation()

    const paths = location.pathname
        .split("/")
        .filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Início</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {paths.map((path, index) => {
                    const route = "/" + paths.slice(0, index + 1).join("/")
                    const isLast = index === paths.length - 1

                    return (
                        <span key={route} className="flex items-center gap-2">
                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {breadcrumbNameMap[path] ?? path}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={route}>
                                            {breadcrumbNameMap[path] ?? path}
                                        </Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </span>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
