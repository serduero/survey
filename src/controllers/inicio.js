import { getUrlParameter } from './funciones.js';
/*
   Mostramos pantalla de inicio/fin
*/

const inicio = (req, res) => {

  var idioma = getUrlParameter('id',req.url);

  if (idioma != 1 && idioma != 0) {
    // mostramos pantalla de no encuestas
    res.render('index', {titulo: 'No trobada', navPasw: false, hay: false, visible: 'N',
                         idioma: 0, imagen: ''});
    return;
  }
  
  var tit = idioma == 0 ? 'Res més a dir' : 'Nada más que decir';
  res.render('inicio', {titulo: tit, idioma: idioma})
}

export default inicio;
