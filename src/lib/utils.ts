import { existsSync, mkdirSync, writeFile } from "fs";

export const ensureFolderExist = (folder: string) => {
    if (!existsSync(folder)) {
        mkdirSync(folder);
    }
}

export const getFormattedDateString = () => {
    let currentData = new Date(Date.now()).toJSON();
    // Regex to match both . and : in returned datestring
    // TODO: Date is not yet important for file name, might be used to grab latest export in the future
    currentData = currentData.replace(/[:\.]/g, "-");
    return currentData;
}

export const writeData = async (path: string, data: any): Promise<void> => {
    writeFile(path, JSON.stringify(data), (x => log(`Succesfully wrote ${path} with ${data.length} pokemon`)));
}

export const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const log = (text: string) => {
    let currentFunction = (new Error().stack.split("at ")[2]);
    console.log(`DEBUG->${getFormattedDateString()}-*  ${text}  *-(${currentFunction})`);
}