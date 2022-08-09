import { getUrlParameter } from './funciones.js';
/*
   Mostramos pantalla de inicio/fin
*/

const inicio = (req, res) => {

  var idioma = getUrlParameter('id',req.url);

  if (idioma != 1 && idioma != 0) {
    // mostramos pantalla de no encuestas
    res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N', idioma: 0});
    return;
  }
   
  res.render('inicio', {titulo: 'Res més a dir', idioma: idioma})
}

export default inicio;
