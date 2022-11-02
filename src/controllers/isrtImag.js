const isrtImag = (req, res) => {

  if (!req.file) {
    res.send('Sense fitxer');
    return;
  }

  res.send('');
}

export default isrtImag;
