import { AppSidebar } from "../sidebar"
import Topbar from "../topbar"
import { SidebarProvider } from "../ui/sidebar"


interface Props {
    children: React.ReactNode
}

export default function PrivateTemplate({ children }: Props) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <Topbar />
            <main className="mt-16 p-5 w-full h-full">
                {children}
            </main>
        </SidebarProvider>
    )
}