# Utilizzo
il file contenuto nella repo va importato nella classe sulla quale si vuole utilizzare, va definito il decorator @Mapper sopra la classe e i decorator @Map sulle singole proprietà.
```js
@Mapper
export default class User {
    @Map("username")
    username: string = '';
    @Map("nome")
    firstName: string = '';
    @Map("cognome")
    lastName: string = '';

    constructor(userObj: any) {
    }
}
```
in fase di costruzione, in modo automatico verranno mappati i valori da **userObj** passato come parametro al costruttore.
Per accedere ai valori verranno utilizzate le chiavi definite all'interno del decorator @Map o quelle di default qualora il decorator fosse mancante.

> [!Warning]
> tutti i valori della classe devono essere inizializzati altrimenti il mapping non funzionerà
