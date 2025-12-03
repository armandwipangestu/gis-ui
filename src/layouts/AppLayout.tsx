import Header from "../components/App/Header";

interface AppLayoutProps {
    childern: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ childern }) => {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Header />
                {/* Content at flow normal. Not absolute */}
                <main className="min-h-[calc(100vh-72px)]">{childern}</main>
            </div>
        </>
    );
};

export default AppLayout;
