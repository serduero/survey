import { unlink, existsSync } from 'fs';

const delImag = (req, res) => {

    // console.log('en delete');
    // console.log(req.headers['file']);

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
}
  
export default delImag;