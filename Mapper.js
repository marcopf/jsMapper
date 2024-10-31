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
                if (metadata[key])
                    (this as any)[key] = findKey(args[0], metadata[key]);
                else
                    (this as any)[key] = findKey(args[0], key);
            });
            console.log(this)
        }
    };
}

export function Map(metadataKey: string) {
    return function(target: any, propertyKey: string) {
        metadata[propertyKey] = metadataKey;
    };
}
