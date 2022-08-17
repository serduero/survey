import { unlink, existsSync } from 'fs';

const delImag = (req, res) => {

    // console.log('en delete');
    // console.log(req.headers['file']);

    // if (req.headers['file'][0] === '*') {
    //     // borrar todos los ficheros de un usuario
    //     res.send('KO');
    // }
    // else {
        // borrar sólo el demandado
        let fichero = './src/public/images/' + req.headers['file'];
        
        if (existsSync(fichero)) {
            unlink(fichero, (err) => {
                if (err) {
                    res.send(err.tostring());
                }
                else {
                    res.send('');
                }
            });
        } else {
            res.send('');
        }
    // }
}
  
export default delImag;