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

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet"

import { Bell, CircleQuestionMark, Pin } from "lucide-react"
import { Separator } from "./ui/separator"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { BreadcrumbCustom } from "./breadcrumb-custom"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { useAuth } from "../contexts/authContext"

export default function Topbar() {
    const { open } = useSidebar();
    const { userLogged } = useAuth();

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

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <CircleQuestionMark />
                            Ajuda
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Ajuda</SheetTitle>
                            <SheetDescription>
                                Informações sobre como usar o sistema.
                            </SheetDescription>
                        </SheetHeader>

                        {(userLogged?.role === "admin" || userLogged?.role === "dev") && (

                            <div className="flex flex-col gap-2 m-2">
                                <Dialog >
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Documentação Execução Rotas
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[calc(100vw-100px)] h-[calc(100vh-200px)]">
                                        <div className="flex flex-col w-full h-full ">
                                            <iframe src={import.meta.env.VITE_API_URL + "/docs/swagger"} className="w-full h-full" />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}