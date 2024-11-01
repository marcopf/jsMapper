# Introduzione

L'obiettivo di questo progetto è creare una libreria in JavaScript che emuli il comportamento di Mapstruct in Java, un framework utilizzato per il mapping automatico di dati tra strutture di oggetti diversi. Mapstruct permette di ridurre la complessità del codice necessario per la mappatura dei dati, offrendo un'astrazione pulita e leggibile, ideale per trasformare e trasferire dati tra modelli di business, DTO (Data Transfer Objects), e altre strutture dati. Emulando queste funzionalità in JavaScript, il progetto si propone di offrire un tool robusto per chi lavora con TypeScript o ES6, garantendo un codice leggibile, manutenibile e altamente flessibile.

## Installazione
Per iniziare a utilizzare i decorator è sufficente copiare il file nel proprio progetto e importarlo nelle classi dove si vuole utilizzare.

## Utilizzo
**mapper-js** permette di mappare automaticamente i campi di una classe in base all'oggetto passatto al costruttore.

```js
import Indirizzo from "./Indirizzo";
import Mapper, { Map }  from "./Mapper.decorator";

@Mapper
export default class User {

    //tutti gli attributi devo essere inizializati
    //per poter essere mappati correttamente
    
    @Map()
    username: any = '';

    @Map({metadata: "nome"})
    firstName: any = '';

    @Map({
        metadata: "cognome",
        afterMapping: (self: User, originalValue: any) => {
            console.log("codice custom dopo il mapping")
        },
        beforeMapping: (self: User, originalValue: any) => {
            console.log("codice custom prima del mapping")
        }
    })
    lastName: any = '';

    @Map({
        metadata: "address",
        class: Indirizzo
    })
    indirizzi: Indirizzo[] = [];

    @Map({
        metadata: "address.0",
        class: Indirizzo
    })
    indirizzoDefault: Indirizzo | undefined = undefined;

    @Map({
        metadata: "address.0.cap"
    })
    capDefault: string = '';

    constructor(userObj: any) {
    }
}
```
esempio di classe con tutte le possibili configurazione supportate
```js
import Mapper, { Map } from "./Mapper.decorator";

@Mapper
export default class Indirizzo {

    via: string = '';
    civico: string = '';
    citta: string = '';
    cap: string = '';

    constructor(userObj: any) {
    }
}
```
classe referenziata dalla classe User e utilizzata come schema per mappare l'attributo indirizzi[]

```js
{
    username: 'lverdi',
    nome: 'luigi',
    cognome: 'verdi',
    address: [
        {
            via: 'via roma',
            civico: 12,
            citta: 'roma',
            cap: 00100
        },
        {
            via: 'via milano',
            civico: 13,
            citta: 'milano',
            cap: 20100
        }
    ]
}
```
Appena sopra troviamo il json passo in input al costruttore della classe User.

Di base applicando l'annotation **@Mapper** sulla classe di riferimento verrà fatto in automatico un mapping basandosi sui nomi degli attributi cercandoli direttamente nell'oggetto passato in input.

### Configurazioni aggiuntive
In aggiunta al comportamento di defualt è possibile utilizzare il decorator **@Map** sul singolo attributo per definire comportamenti specifici:
- **metadata**:  definisce il campo del json in input da prendere in esame
- **class**: definisce la classe dell'oggetto che si sta mappando (obbligatoria per oggetti e liste di oggetti)
- **afterMapping**: definisce la callback che viene chiamata dopo aver terminato il mapping, pass in input 2 parametri:
1 self ovvero una referenza alla classe che si sta mappando
2 originalObj ovvero l'intero oggetto che sti stava provando a mappare
- **beforeMapping**: callback che viene eseguita prima di effettuare il mapping, riceve in input i stessi parametri di afterMapping 
