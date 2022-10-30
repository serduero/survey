// Recogemos los datos que vienen de la página sobre el encuestado
var cajetines = document.currentScript.getAttribute('cajetines');
var cajs = JSON.parse(cajetines);
 
var exclusiones = document.currentScript.getAttribute('exclusiones');

// DOM cargado
$(function () {
    // Se selecciona volver
    $("#tornar").on("click", function () {
        history.back();
    });

    // obtenemos los parámetros de idurl de la encuesta y su idioma
    var idurl = getUrlParameter('idurl');
    var idioma = getUrlParameter('id');

    if ((idurl == false) || (idioma != 0 && idioma != 1)) {
        $("#msgerr").html('Adreça desconeguda.. què has fet?');
        $("#msgerr").removeClass('d-none').addClass('d-block');
        return false;
    }
             
    // Quitamos mensaje de error ante cualquier click
    $(document).on('click', function(){
        treureMsg();
    });

    // Pulsado botón de reinicilizar datos de listas
    $("#clean").on("click", function () {
        for (var i=0; i<cajs.length; i++) {
            if (cajs[i].caj_tipo == "CH") {
                let cajet = $(`#valch${cajs[i].caj_num}`);
                cajet.html(cajet.attr("defecto"));
            }
        }
    });    

    // Tratamiento tras seleccionar un elemento de las listas
    $("#listbloc a").on("click", function () {
        var seleccionado = $(this).data('pdsa-dropdown-val');
        var idDato = Number($(this).attr("id").split("val")[1]);
        var cajNum = $(this).attr("cajnum");
         
        // Se pone el seleccionado en el cajetín
        $(`#valch${cajNum}`).html(seleccionado);

        // Tratamos las posibles exclusiones
        var excl = JSON.parse(exclusiones);
        var tieneExclusion = excl[0].exc_id1.includes(idDato) || 
                             excl[0].exc_id2.includes(idDato);

        // Si tiene exclusiones eliminamos el valor de los otros cajetines

        // vemos si es un elemento del primer vector: en ese caso eliminamos del 2º vector/cajetín
        // y aprovechamos para dejarlo oculto o visible el resto
        for (var i1=0; i1<excl[0].exc_id1.length; i1++) {
            // console.log('bucle1');
            // console.log('indice donde está: ' + i1);
            
            // me posiciono en el otro cajetín-elemento que contenciona
            var valorCaj = $(`#val${excl[0].exc_id2[i1]}`);
                
            if (tieneExclusion && excl[0].exc_id1[i1] == idDato) {
                var cajnum = valorCaj.attr("cajnum");
                // console.log('cajnum del otro cajetín: ' + cajnum);

                // posiciono en el cajetín que contenciona
                var cajet = $(`#valch${cajnum}`);
                
                // console.log('valor del cajetín contencionado: ' + cajet.html().trim());
                // console.log('valor del cajetín contencionado no permitido: ' + valorCaj.html());

                // Lo quitamos si está seleccionado
                if (valorCaj.html() == cajet.html().trim()) {
                    // console.log('lo cambio ' + cajet.attr("defecto"));
                    cajet.html(cajet.attr("defecto"));
                }
            }
        }

        // vemos si es un elemento del segundo vector: en ese caso eliminamos del 1º vector/cajetín
        for (var i2=0; i2<excl[0].exc_id2.length; i2++) {
            // console.log('bucle2');
            // console.log('indice donde está: ' + i2);
            
            // me posiciono en el otro cajetín-elemento que contenciona
            var valorCaj = $(`#val${excl[0].exc_id1[i2]}`);
            
            if (tieneExclusion && excl[0].exc_id2[i2] == idDato) {
                var cajnum = valorCaj.attr("cajnum");
                // console.log('cajnum del otro cajetín: ' + cajnum);
                
                // posiciono en el cajetín que contenciona
                var cajet = $(`#valch${cajnum}`);  
                    
                // console.log('valor del cajetín contencionado: ' + cajet.html().trim());
                // console.log('valor del cajetín contencionado no permitido: ' + valorCaj.html());
                if (valorCaj.html() == cajet.html().trim()) {
                    // console.log('lo cambio ' + cajet.attr("defecto"));
                    cajet.html(cajet.attr("defecto"));
                }
            } 
        }

        // recorremos todos los cajetines y los ponemos visibles todos sus valores

        // console.log('visibles todos');
        // console.log(cajs);
        for(var j=0; j<cajs.length; j++){
            if (cajs[j].caj_tipo == "CH") {
                // console.log(cajs[j].val_idDato);
                for (var k=0; k<cajs[j].val_idDato.length; k++){
                    $(`#val${cajs[j].val_idDato[k]}`).show();
                    // console.log(a.html());
                }
            }
        }

        // recorremos las exclusiones y ocultamos
        for(var j=0; j<cajs.length; j++){
            if (cajs[j].caj_tipo == "CH") {
                // miramos si este cajetín está ya seleccionado
                var a =  $(`#valch${cajs[j].caj_num}`);
                var selec = a.html().trim();
                
                if (selec != a.attr("defecto").trim()) {
                    // Si ya seleccionado ocultamos lo que proceda al resto
                    
                    var index = cajs[j].val_txt.indexOf(a.html().trim());
                    // en cajs[j].val_idDato[index] está el id del elemento seleccionado en
                    // este cajetín
                    var dato = Number(cajs[j].val_idDato[index]);
                    // console.log('idDato a mirar sus exclusiones: ' + dato);

                    if (excl[0].exc_id1.includes(dato)) {
                        for (var i1=0; i1<excl[0].exc_id1.length; i1++) {
                            if (excl[0].exc_id1[i1] == dato) {
                                // ocultamos su exclusión
                                $(`#val${excl[0].exc_id2[i1]}`).hide();
                            }
                        }
                    }

                    // console.log('Está en excl2: ' +excl[0].exc_id2.includes(dato));
                    if (excl[0].exc_id2.includes(dato)) {
                        for (var i2=0; i2<excl[0].exc_id2.length; i2++) {
                            if (excl[0].exc_id2[i2] == dato) {
                                // console.log('está en '+i2);
                                // ocultamos su exclusión
                                $(`#val${excl[0].exc_id1[i2]}`).hide();
                                // console.log('ocultamos: ' +  $(`#val${excl[0].exc_id1[i2]}`).html());

                            }
                        }
                    }
                }
            }
        }
    });
    // En caso de pulsar "+info" mostramos las observaciones en una alerta
    $(".helpi").each(function(){
        $(this).on('click', function() {
            alert($(this).attr('valor'));
        });
    });
    
    // Enviar formulario tras validarlo
    $("form").on("submit", function( event ) {

        event.preventDefault();

        // ocultamos botón de enviar y volver
        $("#send").hide();
        $("#tornar").hide();
        
        //
        // Validamos que todas los cajetines se han informado
        //
        // var cajs = JSON.parse(cajetines);
        var msgtxt = '', encuestado = '';

        // console.log('enviando form');
        // console.log(cajs);

        for(var j=cajs.length-1; j>=0; j--){
            // Si es campo libre, que tenga algo
            if (cajs[j].caj_tipo == "LI") {
                var a =  $(`#vallib${cajs[j].caj_num}`);
                
                if (a.val().trim() == '') {
                    msgtxt = idioma == 0 ? 'No informat ' : 'No informado ';
                    msgtxt += cajs[j].caj_lit;
                } else {
                    // cambiamos todos los ~ por -
                    encuestado = a.val().trim().replace(/~/g, "-") + encuestado;
                }
            }
                     
            // Si es lista de valores se ha debido seleccionar uno
            if (cajs[j].caj_tipo == "CH") {
                var a =  $(`#valch${cajs[j].caj_num}`);
                
                if (a.html().trim() == a.attr("defecto").trim()) {
                    msgtxt = idioma == 0 ? 'No informat ' : 'No informado ';
                    msgtxt += cajs[j].caj_lit;
                } else {
                    encuestado = a.html().trim() + encuestado;
                }
            }
             
            // Si es un número que esté informado y esté dentro del rango
            if (cajs[j].caj_tipo == "NU") {
                var a =  $(`#valnum${cajs[j].caj_num}`);
                var numero = a.val().trim();
                
                if (numero == '') {
                    msgtxt = idioma == 0 ? 'No informat ' : 'No informado ';
                    msgtxt += cajs[j].caj_lit;
                } else {
                    // que sólo contenga números
                    let isnum = /^\d+$/.test(numero);
                    if(!isnum) {
                        msgtxt = idioma == 0 ? 'Número incorrecte (' : 'Número incorrecto (';
                        msgtxt += cajs[j].caj_lit.trim() + ')';
                    } else {
                        if (isNaN(parseFloat(numero)) || !isFinite(numero)) {
                            msgtxt = idioma == 0 ? 'Número incorrecte (' : 'Número incorrecto (';
                            msgtxt += cajs[j].caj_lit.trim() + ')';
                        } else {
                            // Validamos posibles decimales
                            const num_dec = parseFloat(numero);
                            const num_int = parseInt(numero);
                            if (num_dec != num_int) {
                                msgtxt = idioma == 0 ? 'Número incorrecte (' : 'Número incorrecto (';
                                msgtxt += cajs[j].caj_lit.trim() + ')';
                            } else {
                                // Y que sea un número OK
                                if (numero < cajs[j].caj_min || num_int > cajs[j].caj_max) {
                                    msgtxt = idioma == 0 ? 'Número fóra de rang (' : 'Número fuera de rango (';
                                    msgtxt += cajs[j].caj_lit.trim() + ').  ';
                                    if (idioma == 0) {
                                        msgtxt = msgtxt + 'Mín: ' + cajs[j].caj_min + '  Màx:' + cajs[j].caj_max;
                                    }
                                    else {
                                        msgtxt = msgtxt + 'Mín: ' + cajs[j].caj_min + '  Máx:' + cajs[j].caj_max;
                                    }
                                } else {
                                    encuestado = numero + encuestado;
                                }
                            }
                        }
                    }
                }
            }

            if (j>0) {
                encuestado = '~' + encuestado;
            }
        }

        if (msgtxt != '') {
            $("#msgerr").html(msgtxt);
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return;
        } 
        // console.log(encuestado);

        //
        // validamos el número de opciones informadas
        //
        var encuesta = new Object();

        var primero = true;
        var isChecked = false;

        var pregunta = [];
        var numopciones = [];
        var operador = [];
        var respuestas = [];
        var respondido = [];
        var txt_adic = [];

        var textoadic = [];

        $("#formulario div div div input").each(function(){

            if (primero) {
                primero = false;

                encuesta.id = $(this).attr('tagenc');
                isChecked = $(this).is(':checked');

                pregunta = [ $(this).attr('tagpreg') ];
                numopciones = [ $(this).attr('tagnopc') ];
                operador = [ $(this).attr('tagoper') ];
                respuestas = [ $(this).attr('tagrespuesta') ];
                respondido = [ isChecked ];
                txt_adic.push( '' );

            } else {
                if ( $(this).attr('tagtxt') )
                {
                    textoadic = $(this).val().trim();
                    if (textoadic.length > 120) {
                        textoadic = textoadic.substring(0,120);
                    }
                    txt_adic.pop(); // el añadido por la propia pregunta
                    txt_adic.push( textoadic );
                } else {
                    isChecked = $(this).is(':checked');
    
                    pregunta.push( $(this).attr('tagpreg') );
                    numopciones.push( $(this).attr('tagnopc') );
                    operador.push( $(this).attr('tagoper') );
                    respuestas.push( $(this).attr('tagrespuesta') );
                    respondido.push( isChecked );
                    txt_adic.push( '' );
                }
            }
        });
        
        // console.log('pregunta:');
        // console.log(pregunta);
        // console.log('numopciones:');
        // console.log(numopciones);
        // console.log('operadores:');
        // console.log(operador);
        // console.log('respuestas:');
        // console.log(respuestas);
        // console.log('respondido:');
        // console.log(respondido);
        // console.log('textos:');
        // console.log(txt_adic);

        encuesta.pregunta = pregunta;
        encuesta.numopciones = numopciones;
        encuesta.operador = operador;
        encuesta.respuestas = respuestas;
        encuesta.respondido = respondido;
        encuesta.txt_adic = txt_adic;

        // console.log('encuesta con todos los bloques:');
        // console.log(encuesta);
         
        // Si alguna pregunta es con texto, y lo tiene, y no se ha seleccionado se da error
        // sin embargo permitiremos seleccionar una respuesta con texto y no poner nada en el cajetín
        var incoherencia = false;
        for (var i=0; i<encuesta.txt_adic.length && !incoherencia; i++) {
            if (encuesta.txt_adic[i] != '' && !encuesta.respondido[i]) {
                incoherencia = true;
            }
        }
        if (incoherencia) {
            msgtxt = idioma == 0 ? "Text introduït a resposta no seleccionada" :
                                   'Texto introducido en respuesta no seleccionada';
            $("#msgerr").html(msgtxt);
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return false;
        }

        // Validamos que se ha contestado a todas las preguntas y el número que toca
        var hay_una = false;
        primero = true;
        var hayError = -1;
        var i = 0;
        var respondidas = 0;
        var por_numero = false;

        for (i=0; i<pregunta.length && hayError == -1; i++){
            if (!primero) {
                if (pregunta[i] != pregunta[i-1] || i == pregunta.length-1) {
                    
                    //
                    // si cambio de pregunta sin finalizar vector
                    if (i != pregunta.length-1) {

                        // daremos error si no se ha contestado ninguna o si no coincide el número de respuestas
                        switch(operador[i-1]) {
                            case 'igual':
                                if (respondidas != numopciones[i-1]) {
                                    por_numero = true;
                                }
                            break;
                            case 'menor':
                                if (respondidas >= numopciones[i-1]) {
                                    por_numero = true;
                                }
                            break;
                            default:  // 'mayor'
                                if (respondidas <= numopciones[i-1]) {
                                    por_numero = true;
                                }
                        }

                        if (!hay_una || por_numero) {
                            // if (numopciones[i-1] > 1 && hay_una) por_numero=true;
                            hayError = pregunta[i-1];
                        } else {
                            // si no hay error reiniciamos "hay_una" y "respondidas" con la respuesta leída
                            hay_una = respondido[i];
                            respondidas = hay_una ? 1 : 0;
                        }
                    } else {
                        //
                        // Si fin de cuestionario
                        if (respondido[pregunta.length-1]) {
                            hay_una = true;
                            respondidas++;
                        }

                        if (!hay_una) {
                            hayError = pregunta[pregunta.length-1];
                        } else {
                            // daremos error si no se ha contestado ninguna o si no coincide el número de respuestas
                            switch(operador[pregunta.length-1]) {
                                case 'igual':
                                    if (respondidas != numopciones[pregunta.length-1]) {
                                        por_numero = true;
                                    }
                                break;
                                case 'menor':
                                    if (respondidas >= numopciones[pregunta.length-1]) {
                                        por_numero = true;
                                    }
                                break;
                                default:  // 'mayor'
                                    if (respondidas <= numopciones[pregunta.length-1]) {
                                        por_numero = true;
                                    }
                            }

                            if (por_numero) {
                                hayError = pregunta[pregunta.length-1];
                            }
                        }
                    }
                } else {
                    if (respondido[i]) {
                        hay_una = true;
                        respondidas++;
                    }
                }
            } else {
                primero = false;

                if (respondido[i]) {
                    hay_una = true;
                    respondidas = 1;
                }
            }
        }
        
        // Hay alguna pregunta sin contestar
        if (hayError != -1) {
            // Un elemento por cada valor distinto
            const distinctPregs = [...new Set(pregunta)];
             
            if (!por_numero) {
                if (distinctPregs.length>1) {
                    msgtxt = idioma == 0 ? 'Respondre totes les preguntes' : 'Responder todas las preguntas';
                    $("#msgerr").html(msgtxt);
                } else {
                    msgtxt = idioma == 0 ? 'Respondre a la pregunta' : 'Responder a la pregunta';
                    $("#msgerr").html(msgtxt);
                }
            } else {
                msgtxt = idioma == 0 ? 'No coincideix el nombre de respostes amb el demanat' :
                                       'No coincide el número de respuestas con lo pedido';
                $("#msgerr").html(msgtxt);
            }
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return false;
        }

        // Todo OK: enviamos las respuestas
        // console.log(encuesta);
        
        var url = `/insform/&idurl=${idurl}&id=${idioma}`;

        // console.log(url);

        $.ajax({
            url : url,
            type: 'POST',
            data: JSON.stringify([encuesta, encuestado]),
            contentType: "application/json",
            // dataType   : "json",
            success: function(resp) {
                let txt = idioma == 0 ? 'Enquesta enviada':'Encuesta enviada';

                alert(txt);
                if (resp == '') {
                    // para evitar que el "back" regrese a la encuesta
                    history.replaceState(null, null, `/fi/&id=${idioma}`)
                    // mostramos la pantalla de fin
                    window.location.replace(`/fi/&id=${idioma}`);
                } else {
                    $("#msgerr").html(resp);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        });
    });
});

// Muestra el mensaje por pantalla
function treureMsg() {
    $("#msgerr").removeClass('d-block').addClass('d-none');
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.pathname,
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
    
