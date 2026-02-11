import Loading from "../loading"
import { AppSidebar } from "../sidebar"
import Topbar from "../topbar"
import { SidebarProvider } from "../ui/sidebar"
import { Toaster } from "../ui/sonner"
import React from "react"


interface Props {

    title: string;
    children: React.ReactNode
    isLoading?: boolean
}

export default function PrivateTemplate({ title, children, isLoading }: Props) {
    React.useEffect(() => {
        document.title = title ? `${title} | Hub Connector` : "Hub Connector";
    }, [title]);
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <Topbar />
                <main className="mt-16 p-5 w-full h-full">
                    {children}
                    {isLoading && <Loading />}
                    <Toaster
                        position="top-right"
                        duration={5000}
                        richColors
                        closeButton
                        toastOptions={{
                            className:
                                "border border-border bg-background text-foreground shadow-lg",
                            classNames: {
                                title: "text-sm font-semibold",
                                description: "text-xs text-muted-foreground",
                                actionButton:
                                    "bg-primary text-primary-foreground hover:bg-primary/90",
                                cancelButton:
                                    "bg-muted text-muted-foreground hover:bg-muted/80",
                            },
                        }}
                    />
                </main>
            </SidebarProvider>
        </>
    )
}