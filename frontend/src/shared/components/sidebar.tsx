import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarGroupContent
} from "@/shared/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { History, LayoutDashboard, LogOut, Server, SignpostBig, User, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "./ui/avatar"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <img src="https://placehold.co/150x50" alt="Hub Connector" />
            </SidebarHeader>
            <SidebarContent className="flex flex-col gap-2 p-2">
                <a href="/" className="hover:bg-primary/20 hover:border w-full h-8 flex items-center justify-start p-5 rounded-md  text-gray-500 hover:text-primary-foreground">
                    <LayoutDashboard className="mr-2" fill="currentColor" />
                    Visão Geral
                </a>

                <a href="/users" className="hover:bg-primary/20 hover:border w-full h-8 flex items-center justify-start p-5 rounded-md  text-gray-500 hover:text-primary-foreground">
                    <Users className="mr-2" fill="currentColor" />
                    Acessos
                </a>

                <SidebarGroup>
                    <SidebarGroupLabel>GERENCIAMENTO</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <a href="#" className="hover:bg-primary/20 hover:border w-full h-8 flex items-center justify-start p-5 rounded-md  text-gray-500 hover:text-primary-foreground">
                            <SignpostBig />
                            Rotas
                        </a>

                        <a href="#" className="hover:bg-primary/20 hover:border w-full h-8 flex items-center justify-start p-5 rounded-md  text-gray-500 hover:text-primary-foreground">
                            <Server className="mr-2" />
                            Gateways
                        </a>

                    </SidebarGroupContent>

                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>MONITORIA</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <a href="#" className="hover:bg-primary/20 hover:border w-full h-8 flex items-center justify-start p-5 rounded-md  text-gray-500 hover:text-primary-foreground">
                            <History className="mr-2" />
                            Logs de Transações
                        </a>


                    </SidebarGroupContent>

                </SidebarGroup>


            </SidebarContent>
            <SidebarFooter>
                <DropdownMenu modal>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center p-2 h-auto">
                            <Avatar className="size-10">
                                <AvatarFallback>JS</AvatarFallback>
                                <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" />
                            </Avatar>
                            <div>
                                <h1 className="text-sm font-medium">Nome do Usuário</h1>
                                <p className="text-xs text-muted-foreground">email@usuario.com</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer p-2">
                                <User className="mr-2" />
                                Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer p-2">
                                <LogOut className="mr-2" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </SidebarFooter>
        </Sidebar>
    )
}