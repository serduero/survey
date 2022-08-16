import { varios } from './database.js';
import { getUrlParameter } from './funciones.js';

/*
    Control de inserción y borrado de imágenes
*/
const control = (req, res, next) => {

    // console.log('en control');
    // console.log(req.params['0']);
    
    let ruta = req.params['0'].split('/')[1];
    let rutasValidas = ['isrtImag', 'delImag', 'sendMail'];
    
    // console.log('ruta: ' + ruta);

    if (rutasValidas.includes(ruta)) {

        var acc = getUrlParameter('acc',req.url);
        
        if (acc === false) {
            res.send('Error parámetro no informado');
            return;
        } else {
            if (acc !== varios.clau) {
                res.send('Error parámetro erróneo');
                return;
            }
        }
    }
    next();
}
  
export default control;
  