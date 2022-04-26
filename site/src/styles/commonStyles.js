import { Platform, StyleSheet } from "react-native";

export const MIN_HEIGHT = 1200;
export const HOUR_GUIDE_WIDTH = 50;
export const OVERLAP_OFFSET = Platform.OS === "web" ? 20 : 8;
export const OVERLAP_PADDING = Platform.OS === "web" ? 3 : 0;

export const CHAT_INPUT_MARGIN_X = 8;

export const selectNone = Platform.select({
    web: { userSelect: "none" },
});

export const outlineNone = Platform.select({
    web: { outline: "none" },
});

export const breakWord = Platform.select({
    web: { wordBreak: "break-word" },
});

export const eventCellCss = StyleSheet.create({
    style: {
        zIndex: 100,
        borderRadius: 3,
        padding: 4,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        minWidth: "33%",
    },
});
