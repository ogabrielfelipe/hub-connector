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
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { BreadcrumbCustom } from "./breadcrumb-custom"


export default function Topbar() {
    const { open } = useSidebar();

    return (
        <div className={`fixed top-0 ${open ? 'left-64 w-[calc(100%-256px)] transition-all duration-300' : 'left-0 w-full transition-all duration-300'} right-0 flex items-center justify-between p-4  h-16 bg-muted border-b  `}>

            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger className="mr-5" />
                <BreadcrumbCustom />


            </div>

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