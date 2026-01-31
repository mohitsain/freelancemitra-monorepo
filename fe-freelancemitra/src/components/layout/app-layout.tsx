import { Box } from "@chakra-ui/react";
import React from "react";
import AppBar from "./appbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            style={{
                height: "100vh",
                width: "100vw",
                display:"flex",
                flexDirection:"column",
            }}
            suppressHydrationWarning
        >
            <AppBar />
            <Box style={{
                flex:1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                padding: "16px",
            }}>
                {children}
            </Box>
        </Box>
    );
};

export default AppLayout;
