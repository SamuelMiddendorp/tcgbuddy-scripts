import { existsSync, mkdirSync, readdirSync, readFile, writeFile } from "fs";
import { promises as fs} from 'fs';

export const ensureFolderExist = (folder: string) => {
    if (!existsSync(folder)) {
        mkdirSync(folder);
    }
}

export const getFormattedDateString = () => {
    let currentDate = new Date(Date.now()).toJSON();
    // Regex to match both . and : in returned datestring
    // TODO: Date is not yet important for file name, might be used to grab latest export in the future
    currentDate = currentDate.replace(/[:\.]/g, "-");
    return currentDate;
}

export const writeData = async (path: string, data: any): Promise<void> => {
    writeFile(path, JSON.stringify(data), (x => log(`Succesfully wrote ${path} with ${data.length} pokemon`)));
}

export const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const log = (text: any) => {
    let currentFunction = (new Error().stack.split("at ")[2]);
    console.log(`DEBUG->${getFormattedDateString()}-*  ${text}  *-(${currentFunction})`);
}

export const getCurrentlyAvailableData = async () : Promise<any[]> => {
    let rootDir = "__dirname"+ "/../";
    let folders = readdirSync(rootDir);
    //TODO: Can be any export at this moment
    let setFolder = folders.find(x => x.startsWith("sets"));
    let currentPath = rootDir + "/" + setFolder;
    let setPaths = readdirSync(currentPath);
    let res = await Promise.all(setPaths.map(sp => readJson(currentPath + "/" + sp)));
    return res;
}
const readJson = async <T,>(path: string) : Promise<T> => {
        let data = await fs.readFile(path);
        return JSON.parse(data.toString());
} 

const enhance = <T,>(obj: T, operation: (obj:T) => T) : T =>  {
    return operation(obj);
} 
