import { unlink, existsSync, readdir, unlinkSync } from 'fs';

const delImag = (req, res) => {

    if (req.headers['file'][0] === '*') {
        
        let idUsuario = req.headers['file'].slice(1);
        var numero = 0;
         
        readdir('./src/public/images/', async (err, files) => {
            if (err) throw err;

            // Sólo entra aquí una vez, y deja en files el vector de
            // ficheros encontrado
            var fichero = '';

            for await (const file of files) {
                
              if (file.split('-')[1] == idUsuario) {
                fichero = './src/public/images/' + file;

                unlinkSync(fichero, (err) => {
                    if (err) {
                        res.json({resul: 'KO', adicional:err.toString()});
                        res.end();
                        return;
                    }
                });
                numero ++;
              }
            }
            res.json({resul: 'OK', adicional: numero.toString()});
            res.end();
        });
    }
    else {
        // borrar sólo el demandado
        let fichero = './src/public/images/' + req.headers['file'];
        
        if (existsSync(fichero)) {
            unlink(fichero, (err) => {
                if (err) {
                    res.json({resul: 'KO', adicional:err.toString()});
                    res.end();
                    return;
                }
                else {
                    res.json({resul: 'OK', adicional: '1'});
                    res.end();
                }
            });
        } else {
            res.json({resul: 'OK', adicional: '0'});
            res.end();
        }
    }
}
  
export default delImag;