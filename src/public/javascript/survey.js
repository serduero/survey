// Recogemos los datos que vienen de la página sobre el encuestado
var cajetines = document.currentScript.getAttribute("cajetines");
var cajs = JSON.parse(cajetines);

var exclusiones = document.currentScript.getAttribute("exclusiones");

// DOM cargado
$(function () {
  // Se selecciona volver
  $("#tornar").on("click", function () {
    history.back();
  });

  // obtenemos los parámetros de idurl de la encuesta y su idioma
  var idurl = getUrlParameter("idurl");
  var idioma = getUrlParameter("id");

  if (idurl == false || (idioma != 0 && idioma != 1)) {
    $("#msgerr").html("Adreça desconeguda.. què has fet?");
    $("#msgerr").removeClass("d-none").addClass("d-block");
    return false;
  }

  // Quitamos mensaje de error ante cualquier click, y volvemos a mostrar las acciones
  $(document).on("click", function () {
    treureMsg();
    $("#send").show();
    $("#tornar").show();
  });

  // Pulsado botón de reinicilizar datos
  $("#clean").on("click", function () {
    for (var i = 0; i < cajs.length; i++) {
      // Inicializamos las listas y sus elementos
      if (cajs[i].caj_tipo == "CH") {
        // Ponemos el valor por defecto
        let cajet = $(`#valch${cajs[i].caj_num}`);
        cajet.html(cajet.attr("defecto"));

        // Y ponemos como visibles todas sus opciones
        for (var j = 0; j < cajs[i].val_idDato[j]; j++) {
          let cajet_valor = $(`#val${cajs[i].val_idDato[j]}`);
          cajet_valor.show();
        }
      }

      // Inicializamos los campos numéricos
      if (cajs[i].caj_tipo == "NU") {
        // Campo a blanco
        let cajet = $(`#valnum${cajs[i].caj_num}`);
        cajet.val("");
      }

      // Inicializamos los campos de texto libre
      if (cajs[i].caj_tipo == "LI") {
        // Campo a blanco
        let cajet = $(`#vallib${cajs[i].caj_num}`);
        cajet.val("");
      }
    }
  });

  // Tratamiento tras seleccionar un elemento de las listas
  $("#listbloc a").on("click", function () {
    var seleccionado = $(this).data("pdsa-dropdown-val");
    var idDato = Number($(this).attr("id").split("val")[1]);
    var cajNum = $(this).attr("cajnum");

    // Se pone el seleccionado en el cajetín
    $(`#valch${cajNum}`).html(seleccionado);

    // Tratamos las posibles exclusiones
    var excl = JSON.parse(exclusiones);
    var tieneExclusion =
      excl[0].exc_id1.includes(idDato) || excl[0].exc_id2.includes(idDato);

    // Si tiene exclusiones eliminamos el valor de los otros cajetines

    // vemos si es un elemento del primer vector: en ese caso eliminamos del 2º vector/cajetín
    // y aprovechamos para dejarlo oculto o visible el resto
    for (var i1 = 0; i1 < excl[0].exc_id1.length; i1++) {
      // me posiciono en el otro cajetín-elemento que contenciona
      var valorCaj = $(`#val${excl[0].exc_id2[i1]}`);

      if (tieneExclusion && excl[0].exc_id1[i1] == idDato) {
        var cajnum = valorCaj.attr("cajnum");

        // posiciono en el cajetín que contenciona
        var cajet = $(`#valch${cajnum}`);

        // Lo quitamos si está seleccionado
        if (valorCaj.html() == cajet.html().trim()) {
          cajet.html(cajet.attr("defecto"));
        }
      }
    }

    // vemos si es un elemento del segundo vector: en ese caso eliminamos del 1º vector/cajetín
    for (var i2 = 0; i2 < excl[0].exc_id2.length; i2++) {
      // me posiciono en el otro cajetín-elemento que contenciona
      var valorCaj = $(`#val${excl[0].exc_id1[i2]}`);

      if (tieneExclusion && excl[0].exc_id2[i2] == idDato) {
        var cajnum = valorCaj.attr("cajnum");

        // posiciono en el cajetín que contenciona
        var cajet = $(`#valch${cajnum}`);

        if (valorCaj.html() == cajet.html().trim()) {
          cajet.html(cajet.attr("defecto"));
        }
      }
    }

    // recorremos todos los cajetines y los ponemos visibles todos sus valores

    for (var j = 0; j < cajs.length; j++) {
      if (cajs[j].caj_tipo == "CH") {
        for (var k = 0; k < cajs[j].val_idDato.length; k++) {
          $(`#val${cajs[j].val_idDato[k]}`).show();
        }
      }
    }

    // recorremos las exclusiones y ocultamos
    for (var j = 0; j < cajs.length; j++) {
      if (cajs[j].caj_tipo == "CH") {
        // miramos si este cajetín está ya seleccionado
        var a = $(`#valch${cajs[j].caj_num}`);
        var selec = a.html().trim();

        if (selec != a.attr("defecto").trim()) {
          // Si ya seleccionado ocultamos lo que proceda al resto

          var index = cajs[j].val_txt.indexOf(a.html().trim());
          // en cajs[j].val_idDato[index] está el id del elemento seleccionado en
          // este cajetín
          var dato = Number(cajs[j].val_idDato[index]);

          if (excl[0].exc_id1.includes(dato)) {
            for (var i1 = 0; i1 < excl[0].exc_id1.length; i1++) {
              if (excl[0].exc_id1[i1] == dato) {
                // ocultamos su exclusión
                $(`#val${excl[0].exc_id2[i1]}`).hide();
              }
            }
          }

          if (excl[0].exc_id2.includes(dato)) {
            for (var i2 = 0; i2 < excl[0].exc_id2.length; i2++) {
              if (excl[0].exc_id2[i2] == dato) {
                // ocultamos su exclusión
                $(`#val${excl[0].exc_id1[i2]}`).hide();
              }
            }
          }
        }
      }
    }
  });
  // En caso de pulsar "+info" mostramos las observaciones en una alerta
  $(".helpi").each(function () {
    $(this).on("click", function () {
      alert($(this).attr("valor"));
    });
  });

  // Enviar formulario tras validarlo
  $("form").on("submit", function (event) {
    event.preventDefault();

    // ocultamos botón de enviar y volver
    $("#send").hide();
    $("#tornar").hide();

    //
    // Validamos que todos los cajetines se han informado
    //
    // var cajs = JSON.parse(cajetines);
    var msgtxt = "",
      encuestado = "";

    for (var j = cajs.length - 1; j >= 0; j--) {
      // Si es campo libre, que tenga algo
      if (cajs[j].caj_tipo == "LI") {
        var a = $(`#vallib${cajs[j].caj_num}`);

        if (a.val().trim() == "") {
          msgtxt = idioma == 0 ? "No informat " : "No informado ";
          msgtxt += cajs[j].caj_lit;
        } else {
          // cambiamos todos los ~ por -
          encuestado = a.val().trim().replace(/~/g, "-") + encuestado;
        }
      }

      // Si es lista de valores se ha debido seleccionar uno
      if (cajs[j].caj_tipo == "CH") {
        var a = $(`#valch${cajs[j].caj_num}`);

        if (a.html().trim() == a.attr("defecto").trim()) {
          msgtxt = idioma == 0 ? "No informat " : "No informado ";
          msgtxt += cajs[j].caj_lit;
        } else {
          encuestado = a.html().trim() + encuestado;
        }
      }

      // Si es un número que esté informado y esté dentro del rango
      if (cajs[j].caj_tipo == "NU") {
        var a = $(`#valnum${cajs[j].caj_num}`);
        var numero = a.val().trim();

        if (numero == "") {
          msgtxt = idioma == 0 ? "No informat " : "No informado ";
          msgtxt += cajs[j].caj_lit;
        } else {
          // que sólo contenga números
          let isnum = /^\d+$/.test(numero);
          if (!isnum) {
            msgtxt =
              idioma == 0 ? "Número incorrecte (" : "Número incorrecto (";
            msgtxt += cajs[j].caj_lit.trim() + ")";
          } else {
            if (isNaN(parseFloat(numero)) || !isFinite(numero)) {
              msgtxt =
                idioma == 0 ? "Número incorrecte (" : "Número incorrecto (";
              msgtxt += cajs[j].caj_lit.trim() + ")";
            } else {
              // Validamos posibles decimales
              const num_dec = parseFloat(numero);
              const num_int = parseInt(numero);
              if (num_dec != num_int) {
                msgtxt =
                  idioma == 0 ? "Número incorrecte (" : "Número incorrecto (";
                msgtxt += cajs[j].caj_lit.trim() + ")";
              } else {
                // Y que sea un número OK
                if (numero < cajs[j].caj_min || num_int > cajs[j].caj_max) {
                  msgtxt =
                    idioma == 0
                      ? "Número fóra de rang ("
                      : "Número fuera de rango (";
                  msgtxt += cajs[j].caj_lit.trim() + ").  ";
                  if (idioma == 0) {
                    msgtxt =
                      msgtxt +
                      "Mín: " +
                      cajs[j].caj_min +
                      "  Màx:" +
                      cajs[j].caj_max;
                  } else {
                    msgtxt =
                      msgtxt +
                      "Mín: " +
                      cajs[j].caj_min +
                      "  Máx:" +
                      cajs[j].caj_max;
                  }
                } else {
                  encuestado = numero + encuestado;
                }
              }
            }
          }
        }
      }

      if (j > 0) {
        encuestado = "~" + encuestado;
      }
    }

    if (msgtxt != "") {
      $("#msgerr").html(msgtxt);
      $("#msgerr").removeClass("d-none").addClass("d-block");
      return;
    }
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

    $("#formulario div div div input").each(function () {
      if (primero) {
        primero = false;

        encuesta.id = $(this).attr("tagenc");
        isChecked = $(this).is(":checked");

        pregunta = [$(this).attr("tagpreg")];
        numopciones = [$(this).attr("tagnopc")];
        operador = [$(this).attr("tagoper")];
        respuestas = [$(this).attr("tagrespuesta")];
        respondido = [isChecked];
        txt_adic.push("");
      } else {
        if ($(this).attr("tagtxt")) {
          textoadic = $(this).val().trim();
          if (textoadic.length > 120) {
            textoadic = textoadic.substring(0, 120);
          }
          txt_adic.pop(); // el añadido por la propia pregunta
          txt_adic.push(textoadic);
        } else {
          isChecked = $(this).is(":checked");

          pregunta.push($(this).attr("tagpreg"));
          numopciones.push($(this).attr("tagnopc"));
          operador.push($(this).attr("tagoper"));
          respuestas.push($(this).attr("tagrespuesta"));
          respondido.push(isChecked);
          txt_adic.push("");
        }
      }
    });

    encuesta.pregunta = pregunta;
    encuesta.numopciones = numopciones;
    encuesta.operador = operador;
    encuesta.respuestas = respuestas;
    encuesta.respondido = respondido;
    encuesta.txt_adic = txt_adic;

    // Si alguna pregunta es con texto, y lo tiene, y no se ha seleccionado se da error
    // sin embargo permitiremos seleccionar una respuesta con texto y no poner nada en el cajetín
    var incoherencia = false;
    for (var i = 0; i < encuesta.txt_adic.length && !incoherencia; i++) {
      if (encuesta.txt_adic[i] != "" && !encuesta.respondido[i]) {
        incoherencia = true;
      }
    }
    if (incoherencia) {
      msgtxt =
        idioma == 0
          ? "Text introduït a resposta no seleccionada"
          : "Texto introducido en respuesta no seleccionada";
      $("#msgerr").html(msgtxt);
      $("#msgerr").removeClass("d-none").addClass("d-block");
      return false;
    }

    // Validamos que se ha contestado a todas las preguntas y el número que toca
    var hay_una = false;
    primero = true;
    var hayError = -1;
    var i = 0;
    var respondidas = 0;
    var por_numero = false;
    var por_no_responder = false;

    // en todos los vectores: tantos elementos como respuestas posibles
    // pregunta: el id de la pregunta. (Tantos elementos repetidos como respuestas de la misma pregunta)
    // numopciones: número de opciones de esa pregunta. ( idem )
    // operador: operador de ese número de opciones < > =. ( idem )
    // respuestas: id de cada respuesta (sin elementos repetidos)
    // respondido: true/false según se haya o no seleccionado esa respuesta
    // txt_adic: el texto introducido en la respuesta i-ésima (si ese elemento no permitía texto será '')

    // console.log(pregunta);
    // console.log(numopciones);
    // console.log(operador);
    // console.log(respuestas);
    // console.log(respondido);
    // console.log(txt_adic);

    for (i = 0; i < pregunta.length; i++) {
      // para cada respuesta (excepto la primera)
      if (!primero) {
        //
        // si cambio de pregunta y no fin del cuestionario hacemos las validaciones
        // sobre las respuestas a la pregunta previa
        //
        if (pregunta[i] != pregunta[i - 1] && i != pregunta.length - 1) {
          // si no hay nada respondido daremos ese mensaje siempre como más prioritario después
          if (!hay_una) {
            por_no_responder = true;
            hayError = pregunta[pregunta.length - 1];
            break;
          } else {
            // reiniciamos el saber si hay o no una
            hay_una = false;
          }

          // validamos que el número de repondidas cuadra con lo demandado
          por_numero = false;

          switch (operador[i - 1]) {
            case "igual":
              if (respondidas != numopciones[i - 1]) {
                por_numero = true;
              }
              break;
            case "menor":
              if (respondidas >= numopciones[i - 1]) {
                por_numero = true;
              }
              break;
            default: // 'mayor'
              if (respondidas <= numopciones[i - 1]) {
                por_numero = true;
              }
          }

          // saltará el error si no cuadra el número
          if (por_numero) {
            hayError = pregunta[i - 1];
            break;
          } else {
            // si la pregunta anterior es OK reiniciamos "hay_una" y "respondidas" con la respuesta leída
            // para así evaluar al final de todas las respuestas de esta siguiente pregunta
            hay_una = respondido[i];
            respondidas = hay_una ? 1 : 0;
          }
        } else {
          //
          // si fin del cuestionario hacemos las validaciones sobre las respuestas a de la última pregunta
          //
          if (i == pregunta.length - 1) {
            if (respondido[i]) {
              hay_una = true;
              respondidas++;
            }

            // si no hay nada respondido daremos ese mensaje
            if (!hay_una) {
              por_no_responder = true;
              hayError = pregunta[pregunta.length - 1];
              break;
            }

            // miramos si no coincide el número de respuestas
            por_numero = false;

            switch (operador[pregunta.length - 1]) {
              case "igual":
                if (respondidas != numopciones[pregunta.length - 1]) {
                  por_numero = true;
                }
                break;
              case "menor":
                if (respondidas >= numopciones[pregunta.length - 1]) {
                  por_numero = true;
                }
                break;
              default: // 'mayor'
                if (respondidas <= numopciones[pregunta.length - 1]) {
                  por_numero = true;
                }

                if (por_numero) {
                  hayError = pregunta[pregunta.length - 1];
                  break;
                }
            }
          } else {
            //
            // Si estamos en la misma pregunta sólo contamos las respondidas y actualizamos hay_una
            //
            if (respondido[i]) {
              hay_una = true;
              respondidas++;
            }
          }
        }
      } else {
        // Esto sólo se ejecuta una vez y sirve para guardar el valor inicial de hay_una y respondidas
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

      if (por_no_responder) {
        if (distinctPregs.length > 1) {
          msgtxt =
            idioma == 0
              ? "Respondre totes les preguntes"
              : "Responder todas las preguntas";
          $("#msgerr").html(msgtxt);
        } else {
          msgtxt =
            idioma == 0 ? "Respondre a la pregunta" : "Responder a la pregunta";
          $("#msgerr").html(msgtxt);
        }
      } else {
        msgtxt =
          idioma == 0
            ? "No coincideix el nombre de respostes amb el demanat"
            : "No coincide el número de respuestas con lo pedido";
        $("#msgerr").html(msgtxt);
      }
      $("#msgerr").removeClass("d-none").addClass("d-block");
      return false;
    }

    // Todo OK: enviamos las respuestas

    var url = `/insform/&idurl=${idurl}&id=${idioma}`;

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify([encuesta, encuestado]),
      contentType: "application/json",
      // dataType   : "json",
      success: function (resp) {
        let txt = idioma == 0 ? "Enquesta enviada" : "Encuesta enviada";

        alert(txt);
        if (resp == "") {
          // para evitar que el "back" regrese a la encuesta
          history.replaceState(null, null, `/fi/&id=${idioma}`);
          // mostramos la pantalla de fin
          window.location.replace(`/fi/&id=${idioma}`);
        } else {
          $("#msgerr").html(resp);
          $("#msgerr").removeClass("d-none").addClass("d-block");
          return false;
        }
      },
    });
  });
});

// Muestra el mensaje por pantalla
function treureMsg() {
  $("#msgerr").removeClass("d-block").addClass("d-none");
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.pathname,
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
}
