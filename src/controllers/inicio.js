/*
   Mostramos pantalla de inicio/fin
*/

const inicio = (req, res) => {
  res.render('inicio', {titulo: 'Res més a dir'})
}

export default inicio;
