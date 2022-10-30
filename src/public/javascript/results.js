// total de preguntas
var total = document.currentScript.getAttribute('total');
var respuestas = document.currentScript.getAttribute('resp');

// Gráfico (https://echarts.apache.org/)
const getOptionChart = (resp) => {
    // Carga de datos para el gráfico: valor numérico y el nombre de la leyenda
    var datos = [];
    for (var i=0; i<resp.resp_tit.length; i++) {
        var objeto = {value: resp.resp_num[i], name: resp.resp_tit[i]};
        datos.push(objeto);
    }
     
    return {
        tooltip: {
            show: true,
            trigger: "item",
            triggerOn: "mousemove|click"
        },
        grid: {
          bottom: 'bottom',
        },
        legend: {
            top: 'top',
            left: 'center',
            padding: [
                0,  // up
                5, // right
                0,  // down
                5, // left
            ],
            textStyle: {
                color: "white"
            },
        },
        dataZoom: {
            show: true
        },
        series: [
            {
              name: resp.preg_tit,
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 1
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30'
                }
              },
              labelLine: {
                show: false
              },
              data: datos
            }
          ]
    };
};

// Inicialización de gráficos
const initCharts = () => {
    var vectorCharts = [];
    var resp = JSON.parse(respuestas);

    for (var i=0; i<total; i++){
        var id = "chart" + i.toString();
        vectorCharts.push(echarts.init(document.getElementById(id)));
        vectorCharts[i].setOption(getOptionChart(resp[i]));
        vectorCharts[i].resize();
    }
};

// DOM cargado
$(function () {
    // Tratamiento de gráficos
    initCharts();
     
    // Se selecciona volver
    $("#tornar").on("click", function () {
        history.back();
    });
});
