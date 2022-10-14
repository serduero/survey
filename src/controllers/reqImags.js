import { readdir } from 'fs';

export const reqImags = (req, res) => {

  if (req.headers['id']) {
      let idUsuario = req.headers['id'];

      readdir('./src/public/images/', (err, files) => {
        if (err) throw err;

        let vector = [];

        for (const file of files) {
          if (file.split('-')[1] == idUsuario) {
            vector.push(file);
          }
        }
        res.send({res: 'OK', ficheros: vector});
      });
  } else {
      res.send({res: 'No indicat Id'});
  }
}

// export default { reqImags };
