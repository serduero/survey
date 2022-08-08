// Obtiene la fecha del servidor en AAAAMMDD (en número)
function obtenerAhora() {
    let date_ob = new Date();
  
    let date = ('0' + date_ob.getDate()).slice(-2);
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
  
    let fecha = parseInt(year + month + date);
    
    return fecha;
  }

function getUrlParameter(sParam, sPageURL) {
    var sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    // console.log('en get url');    
    // console.log(sParam);
    // console.log(sPageURL);
    // console.log(sURLVariables);

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        // console.log('dentro');
        // console.log(sParameterName);

        if (sParameterName[0] == sParam) {
            return sParameterName[1] == undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
  }

export { getUrlParameter , obtenerAhora};