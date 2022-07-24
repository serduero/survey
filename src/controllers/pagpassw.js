/*
   Mostramos las opciones de cambio palabra clave
*/

const chgPassw = (req, res) => {

    res.render('password', {titulo: 'Canvi paraula clau'})
}

export default chgPassw;