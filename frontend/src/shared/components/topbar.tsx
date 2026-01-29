
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"

import { Button } from "@/shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/shared/components/ui/item"

import { Bell, CircleQuestionMark, Pin } from "lucide-react"
import { Separator } from "./ui/separator"


export default function Topbar() {
    return (
        <div className="fixed top-0 left-64 right-0 flex items-center justify-between p-4 w-[calc(100%-256px)] h-16 bg-muted border-b  ">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Library</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-row items-center gap-2">


                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button variant="outline">
                            <Bell fill="currentColor" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-96 flex flex-col gap-2 p-2" align="start">
                        <h2 className="text-lg font-semibold">Notificações</h2>
                        <Separator />
                        <Item variant="outline">
                            <ItemMedia variant="icon">
                                <Pin />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle>Notificação 1</ItemTitle>
                                <ItemDescription>
                                    Detalhes da notificação 1
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                    </DropdownMenuContent>
                </DropdownMenu>

                <a href="#" className="flex items-center gap-2 hover:bg-primary/20 hover:border p-2 rounded-md scale-90">
                    <CircleQuestionMark />
                    Ajuda
                </a>
            </div>
        </div>
    )
}