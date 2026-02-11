


export default function Loading() {
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-white/50 z-50">
            <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </div>
    );
}