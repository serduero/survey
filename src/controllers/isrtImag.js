const isrtImag = (req, res) => {

  if (!req.file) {
    res.send('Sense fitxer');
    return;
  }
  // console.log('recibido fichero');
  // console.log(req.file.filename)
  // console.log(req.file.originalname);
  // console.log(req.body['id']);

  res.send('');
}

export default isrtImag;
