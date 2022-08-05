// DOM cargado
$(function () {
    $(document).on('click', function(){
        treureMsg();
    });

    $(".helpi").each(function(){
        $(this).on('click', function() {
            alert($(this).attr('valor'));
        });
    });
    
    // Enviar formulario tras validarlo
    $("form").on("submit", function( event ) {

        event.preventDefault();
        
        // Validamos bloque, piso y puerta informados y ok's
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

        // Validamos bloque, piso y puerta se han informado en caso de estar
        if( strbloc == 'Bloc') {
            $("#msgerr").html('No informat el Bloc');
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return false;
        } else {
            if( strpis == 'Pis') {
                $("#msgerr").html('No informat el Pis');
                $("#msgerr").removeClass('d-none').addClass('d-block');
                return false;
            } else {
                if( strporta == 'Porta') {
                    $("#msgerr").html('No informada la Porta');
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        }

        // Validamos que se haya indicado una plaza de parking y sea correcta
        if ($('#plaza').length) {
            if (strplaza == '') {
                $("#msgerr").html('No informada la plaça de parking');
                $("#msgerr").removeClass('d-none').addClass('d-block');
                return false;
            } else {
                if (isNaN(parseFloat(strplaza)) || !isFinite(strplaza)) {
                    $("#msgerr").html('Plaça de parking incorrecta');
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                } else {
                    // Validamos posibles decimanles
                    const num_dec = parseFloat(strplaza);
                    const num_int = parseInt(strplaza);
                    if (num_dec != num_int) {
                        $("#msgerr").html('Número de plaça de parking incorrecte');
                        $("#msgerr").removeClass('d-none').addClass('d-block');
                        return false;
                    } else {
                        // Y que sea un número OK
                        if (num_int < 1 || num_int > 77) {
                            $("#msgerr").html('Plaça de parking inexistent');
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
                    $("#msgerr").html('No hi ha baixos en aquest Bloc');
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            } else {
                if (strpis == '4' || strpis == '5') {
                    $("#msgerr").html('Solament hi ha 3 pisos en aquest Bloc');
                    $("#msgerr").removeClass('d-none').addClass('d-block');
                    return false;
                }
            }
        }

        // validamos el número de opciones informadas
        var encuesta = new Object();

        var primero = true;
        var isChecked = false;

        var pregunta = [];
        var numopciones = [];
        var respuestas = [];
        var respondido = [];

        $("#formulario div div div input").each(function(){
        
            encuesta.id = $(this).attr('tagenc');

            isChecked = $(this).is(':checked');

            if (primero) {
                primero = false;

                pregunta = [ $(this).attr('tagpreg') ];
                numopciones = [ $(this).attr('tagnopc') ];
                respuestas = [ $(this).attr('tagrespuesta') ];
                respondido = [ isChecked ];
            } else {
                pregunta.splice(0,0, $(this).attr('tagpreg') );
                numopciones.splice(0,0, $(this).attr('tagnopc') );
                respuestas.splice(0,0, $(this).attr('tagrespuesta') );
                respondido.splice(0,0, isChecked );
            }
        });
        encuesta.pregunta = pregunta;
        encuesta.numopciones = numopciones;
        encuesta.respuestas = respuestas;
        encuesta.respondido = respondido;

        // console.log(encuesta);
        // console.log(pregunta);
        // console.log(numopciones);
        // console.log(respuestas);
        // console.log(respondido);

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
                    $("#msgerr").html('Respondre totes les preguntes');
                } else {
                    $("#msgerr").html('Respondre a la pregunta');
                }
            } else {
                $("#msgerr").html('No coincideix el nombre de respostes amb el demanat');
            }
            $("#msgerr").removeClass('d-none').addClass('d-block');
            return false;
        }

        // Todo OK: enviamos las respuestas
        // console.log('se envía: ' + strbloc + ' ' + strpis + ' ' + strporta + ' '+ strplaza);
         
        $.ajax({
            url : '/insform',
            type: 'POST',
            data: JSON.stringify([encuesta, strbloc, strpis, strporta, strplaza]),
            contentType: "application/json",
            // dataType   : "json",
            success    : function(resp) {
                alert('Enquesta enviada');
                if (resp == '') {
                    window.close();
                    // window.location.replace("/");

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

        // En caso de que haya un piso seleccionado y no exista se reinicia con "Pis"
        // En cualquier caso se oculta para que no sea seleccionable

        // 2A y 2B no tienen bajos
        if (id == '2A' || id == '2B') {
            if ($("#pis").html() == 'B') {
                $("#pis").html('Pis');
            };
            $("#lbajos").hide();
            $("#lcuatro").show();
            $("#lcinco").show();
        } else {
        // El resto sólo tienen 3 alturas
            if ($("#pis").html() == '4' || $("#pis").html() == '5') {
                $("#pis").html('Pis');
            };
            $("#lbajos").show();
            $("#lcuatro").hide();
            $("#lcinco").hide();
        }
    });
    $("#listpis a").on("click", function () {
        var id = $(this).data('pdsa-dropdown-val');
        $("#pis").html(id);
    });
    $("#listporta a").on("click", function () {
        var id = $(this).data('pdsa-dropdown-val');
        $("#porta").html(id);
    });
});

// Muestra el mensaje por pantalla
function treureMsg() {
    $("#msgerr").removeClass('d-block').addClass('d-none');
}


    
