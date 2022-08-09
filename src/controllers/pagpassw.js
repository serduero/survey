import { getUrlParameter } from './funciones.js';

/*
   Mostramos las opciones de cambio palabra clave
*/

const chgPassw = (req, res) => {

    var idioma = getUrlParameter('id',req.url);

    if (idioma != 1 && idioma != 0) {
      // mostramos pantalla de no encuestas
      res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N', idioma: 0});
      return;
    }

    res.render('password', {titulo: 'Canvi paraula clau', idioma: idioma})
}

export default chgPassw;