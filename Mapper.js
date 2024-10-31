let metadata: any = {}

export function findKey(obj: any, key: string): any | null {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            const result = findKey(obj[k], key);
            if (result !== null) {
                return result; 
            }
        }
    }
    return null;
}

export function updateValueByKey(obj: any, keyToFind: string, newValue: any): boolean {
    if (obj.hasOwnProperty(keyToFind)) {
        obj[keyToFind] = newValue;
        return true;
    }
    
    for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            const result = updateValueByKey(obj[k], keyToFind, newValue);

            if (result) {
                return true;
            }
        }
    }
    return false;
}


export default function Mapper<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
          
            Object.keys(this).forEach((key: any) => {
                let storage;
                if (metadata[key]){
                    storage = findKey(args[0], metadata[key]['metadata']);
                    (this as any)[key] = storage;
                }
                else
                    storage = findKey(args[0], key);
                if (Array.isArray(storage)){
                    let mapped  = [];
                    for(let el of storage){
                        let instantiated = new metadata[key]['class'](el);
                        mapped.push(instantiated);
                    }
                    (this as any)[key] = mapped;
                }
                else if (typeof storage === 'object' && metadata[key]) {
                    (this as any)[key] = new metadata[key]['class'](storage);
                }
            });
        }
    };
}

export function Map(metadataKey: string, classRef?: any) {
    return function(target: any, propertyKey: string) {
        metadata[propertyKey] = {
            metadata: metadataKey,
            class: classRef
        };
    };
}
