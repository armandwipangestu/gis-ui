import Header from "../components/App/Header";

type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Header />
                {/* Content at flow normal. Not absolute */}
                <main className="min-h-[calc(100vh-72px)]">{children}</main>
            </div>
        </>
    );
};

export default AppLayout;
