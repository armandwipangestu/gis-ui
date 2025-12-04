import { type FC } from "react";
import AppRoutes from "./routes"
import { Toaster } from "react-hot-toast";

const App: FC = () => {
    return (
        <>
            <AppRoutes />
            <Toaster />
        </>
    );
};

export default App;
