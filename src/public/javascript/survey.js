// DOM cargado
$(function () {

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

    // En caso de pulsar "+info" mostramos las observaciones en una alerta
    $(".helpi").each(function(){
        $(this).on('click', function() {
            alert($(this).attr('valor'));
        });
    });
    
    // Enviar formulario tras validarlo
    $("form").on("submit", function( event ) {

        event.preventDefault();
        
        //
        // Validamos bloque, piso y puerta informados y ok's
        //
        var strplaza = $('#plaza').length ? $("#plaza").val().trim() : '';
        
        var strbloc =  $('#bloc').length ?
                         $("#bloc").html().trim() :
                         $('#blocfix').length ?
                           $("#blocfix").html().trim() :
                           '';

        var strpis =  $('#pis').length ? $("#pis").html().trim() : '';
        var strporta =  $('#porta').length ? $("#porta").html().trim() : '';

        // console.log(strplaza);
        // console.log(strbloc);
        // console.log(strpis);
        // console.log(strporta);

        var msgtxt = idioma == 0 ? 'No informat el Bloc' : 'No informado el Bloque';

        // Validamos bloque, piso y puerta se han informado en caso de estar
        if( strbloc == 'Bloc' || strbloc == 'Bloque') {
            $("#msgerr").html(msgtxt);
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return false;
        } else {
            if( strpis == 'Pis' || strpis == 'Piso') {
                msgtxt = idioma == 0 ? 'No informat el Pis' : 'No informado el Piso';
                $("#msgerr").html(msgtxt);
                $("#msgerr").removeClass('d-none').addClass('d-block');
                return false;
            } else {
                if( strporta == 'Porta' || strporta == 'Puerta') {
                    msgtxt = idioma == 0 ? 'No informada la Porta' : 'No informada la Puerta';
                    $("#msgerr").html(msgtxt);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        }

        //
        // Validamos que se haya indicado una plaza de parking y sea correcta
        //
        if ($('#plaza').length) {
            if (strplaza == '') {
                msgtxt = idioma == 0 ? 'No informada la plaça de parking' : 'No informada la plaza de parking';
                $("#msgerr").html(msgtxt);
                $("#msgerr").removeClass('d-none').addClass('d-block');
                return false;
            } else {
                if (isNaN(parseFloat(strplaza)) || !isFinite(strplaza)) {
                    msgtxt = idioma == 0 ? 'Plaça de parking incorrecta' : 'Plaza de parking incorrecta';
                    $("#msgerr").html(msgtxt);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                } else {
                    // Validamos posibles decimanles
                    const num_dec = parseFloat(strplaza);
                    const num_int = parseInt(strplaza);
                    if (num_dec != num_int) {
                        msgtxt = idioma == 0 ? 'Número de plaça de parking incorrecta' : 'Número de plaza de parking incorrecta';
                        $("#msgerr").html(msgtxt);
                        $("#msgerr").removeClass('d-none').addClass('d-block');
                        return false;
                    } else {
                        // Y que sea un número OK
                        if (num_int < 1 || num_int > 77) {
                            msgtxt = idioma == 0 ? 'Plaça de parking inexistent' : 'Plaza de parking inexistente';
                            $("#msgerr").html(msgtxt);
                            $("#msgerr").removeClass('d-none').addClass('d-block');
                            return false;
                        }
                    }
                }
            }
        } else {
            // Validamos la coherencia entre bloque y piso
            if (strbloc == '2A' || strbloc == '2B') {
                if (strpis == 'B') {
                    msgtxt = idioma == 0 ? 'No hi ha baixos en aquest Bloc' : 'No hay bajos en aquest Bloque';
                    $("#msgerr").html(msgtxt);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            } else {
                if (strpis == '4' || strpis == '5') {
                    msgtxt = idioma == 0 ? 'Solament hi ha 3 pisos en aquest Bloc' : 'Solamente hay pisos en este Bloque';
                    $("#msgerr").html(msgtxt);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        }

        //
        // validamos el número de opciones informadas
        //
        var encuesta = new Object();

        var primero = true;
        var isChecked = false;

        var pregunta = [];
        var numopciones = [];
        var respuestas = [];
        var respondido = [];
        var txt_adic = [];

        $("#formulario div div div input").each(function(){

            if (primero) {
                primero = false;

                encuesta.id = $(this).attr('tagenc');
                isChecked = $(this).is(':checked');

                pregunta = [ $(this).attr('tagpreg') ];
                numopciones = [ $(this).attr('tagnopc') ];
                respuestas = [ $(this).attr('tagrespuesta') ];
                respondido = [ isChecked ];

            } else {
                // pregunta.splice(0,0, $(this).attr('tagpreg') );
                // numopciones.splice(0,0, $(this).attr('tagnopc') );
                // respuestas.splice(0,0, $(this).attr('tagrespuesta') );
                // respondido.splice(0,0, isChecked );

                if ( $(this).attr('tagtxt') )
                {
                    txt_adic.pop(); // el añadido por la propia pregunta
                    txt_adic.push( $(this).val().trim() );
                } else {
                    isChecked = $(this).is(':checked');
    
                    pregunta.push( $(this).attr('tagpreg') );
                    numopciones.push( $(this).attr('tagnopc') );
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
        // console.log('respuestas:');
        // console.log(respuestas);
        // console.log('respondido:');
        // console.log(respondido);
        // console.log('textos:');
        // console.log(txt_adic);

        encuesta.pregunta = pregunta;
        encuesta.numopciones = numopciones;
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
                    // Cambio de pregunta sin finalizar vector
                    if (i != pregunta.length-1) {

                        // daremos error si no se ha conntestado ninguna o si no coincide el número de respuestas
                        if (!hay_una || respondidas != numopciones[i-1]) {
                            if (numopciones[i-1] > 1 && hay_una) {
                                por_numero = true;
                            }
                            hayError = pregunta[i-1];
                        } else {
                            hay_una = respondido[i];
                            respondidas = hay_una ? 1 : 0;
                        }
                    } else {
                        // Fin del vector
                        if (respondido[pregunta.length-1]) {
                            respondidas++;
                        }

                        if (!hay_una && !respondido[pregunta.length-1]) {
                            hayError = pregunta[pregunta.length-1];
                        }
                        if (respondidas != numopciones[pregunta.length-1]) {
                            hayError = pregunta[pregunta.length-1];
                            if (hay_una) {
                                por_numero = true;
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
        // console.log('se envía: ' + strbloc + ' ' + strpis + ' ' + strporta + ' '+ strplaza);
        // console.log(encuesta);
        
        var url = `/insform/&idurl=${idurl}&id=${idioma}`;

        // console.log(url);

        $.ajax({
            url : url,
            type: 'POST',
            data: JSON.stringify([encuesta, strbloc, strpis, strporta, strplaza]),
            contentType: "application/json",
            // dataType   : "json",
            success    : function(resp) {
                let txt = idioma == 0 ? 'Enquesta enviada':'Encuesta enviada';

                alert(txt);
                if (resp == '') {
                    window.location.replace(`/fi/&id=${idioma}`);
                } else {
                    $("#msgerr").html(resp);
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        });
    });

    // Se selecciona un elemento de la lista bloc
    $("#listbloc a").on("click", function () {
        // Se pone el seleccionado
        var id = $(this).data('pdsa-dropdown-val');
        $("#bloc").html(id);

        // En caso de que haya un piso seleccionado y no exista se reinicia con "Piso"
        // En cualquier caso se oculta para que no sea seleccionable

        let piso = idioma == 0 ? 'Pis' : 'Piso';

        // 2A y 2B no tienen bajos
        if (id == '2A' || id == '2B') {
            if ($("#pis").html() == 'B') {
                $("#pis").html(piso);
            };
            $("#lbajos").hide();
            $("#lcuatro").show();
            $("#lcinco").show();
        } else {
        // El resto sólo tienen 3 alturas
            if ($("#pis").html() == '4' || $("#pis").html() == '5') {
                $("#pis").html(piso);
            };
            $("#lbajos").show();
            $("#lcuatro").hide();
            $("#lcinco").hide();
        }
    });
    $("#listpis a").on("click", function () {
        // Se pone el seleccionado
        var id = $(this).data('pdsa-dropdown-val');
        $("#pis").html(id);
    });
    $("#listporta a").on("click", function () {
        // Se pone el seleccionado
        var id = $(this).data('pdsa-dropdown-val');
        $("#porta").html(id);
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
    
