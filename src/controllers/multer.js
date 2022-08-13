import multer  from 'multer';

/*
   Para poder Guardar la imagen en servidor
*/

// Obtenemos la imagen via multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        // directorio donde se guardará la imagen
        callBack(null, './src/public/images/');
    },
    filename: (req, file, callBack) => {
        // nombre que contendrá la imagen
        callBack(null, file.originalname);
    }
});

var mImage = multer({
    storage: storage
});

export default mImage;