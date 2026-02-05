import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/shared/components/ui/pagination"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

interface PaginationProps {
    total: number
    page: number
    perPage: number
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
}

function generatePages(current: number, total: number) {
    const pages: (number | "ellipsis")[] = []

    if (current > 2) pages.push(1)
    if (current > 3) pages.push("ellipsis")

    for (let i = Math.max(1, current - 1); i <= Math.min(total, current + 1); i++) {
        pages.push(i)
    }

    if (current < total - 2) pages.push("ellipsis")
    if (current < total - 1) pages.push(total)

    return pages
}

export function DataPagination({
    total,
    page,
    perPage,
    onPageChange,
    onPerPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(total / perPage)

    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)

    const pages = generatePages(page, totalPages)

    return (
        <div className="w-full grid grid-cols-3 items-center gap-4">
            {/* ESQUERDA */}
            <p className="text-sm text-muted-foreground justify-self-start">
                Exibindo <strong>{start}</strong>–<strong>{end}</strong> de <strong>{total}</strong> registros
            </p>

            {/* CENTRO */}
            <div className="justify-self-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(Math.max(1, page - 1))}
                            />
                        </PaginationItem>

                        {pages.map((p, i) =>
                            p === "ellipsis" ? (
                                <PaginationItem key={i}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        isActive={p === page}
                                        onClick={() => onPageChange(p)}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* DIREITA */}
            <div className="flex items-center gap-2 justify-self-end">
                <span className="text-sm text-muted-foreground">Por página</span>
                <Select
                    value={String(perPage)}
                    onValueChange={(v) => onPerPageChange(Number(v))}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
