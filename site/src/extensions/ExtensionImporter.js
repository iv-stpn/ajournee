import { useState, useEffect } from "react";
import { View } from "react-native";

export const ExtensionImporter = ({ path }) => {
    const [module, setModule] = useState(null);
    // useEffect(() => {
    //     import(`${path}`).then((module) => setModule(module));
    // }, [path]);
    return <View>{module && <module.default />}</View>;
};
