let metadata: any = {};

interface ClassType<T> {
    new (...args: any[]): T;
}

type MapperConfig = {
    metadata: string;
    class?: ClassType<any>;
    beforeMapping?: (self: any, originalValue: any) => void;
    afterMapping?: (self: any, originalValue: any) => void;
}

export function findKey(obj: any, key: string): any | null {
    let splitted = key.split('.');
    let result:  any = JSON.parse(JSON.stringify(obj));
    
    for (let step of splitted) {
        if (!isNaN(step as any))
            result = result[Number(step)];
        else if (result[step] !== undefined)
            result = result[step];
        else
            return null
    }
    return result;
}

export default function Mapper<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            
            Object.keys(this).forEach((key: any) => {
                let storage;
                //effettuo il reatrieve dell'oggetto da mappare
                if (metadata[key])
                    storage = findKey(args[0], metadata[key]['metadata']);
                else
                    storage = findKey(args[0], key);
                //eseguo la callback pre
                if (metadata[key]?.beforeMapping)
                    metadata[key]?.beforeMapping(this, storage);

                //se è un array di oggetti mappo ogni oggetto
                if (Array.isArray(storage)){
                    let mapped  = [];
                    for(let el of storage){
                        if (metadata[key]?.class){
                            let instantiated = new metadata[key]['class'](el);
                            
                            mapped.push(instantiated);
                        }
                    }
                    (this as any)[key] = mapped;
                }
                //se è un oggetto mappo l'oggetto
                else if (typeof storage === 'object') {
                    if (!metadata[key]?.class)
                        (this as any)[key] = null;
                    else
                        (this as any)[key] = new metadata[key]['class'](storage);
                }
                //altrimenti mappo il valore
                else{
                    (this as any)[key] = storage;
                }

                //eseguo la callback post
                if (metadata[key]?.afterMapping)
                    metadata[key]?.afterMapping(this, storage);
            });
            console.log(this)
        }
    };
}

export function Map(config?: MapperConfig) {
    return function(target: any, propertyKey: string) {
        metadata[propertyKey] = config
    };
}
