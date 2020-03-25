
const $fecha = document.querySelector("#fecha");
const $divisa = document.querySelector("#divisa");
const $informacion = document.querySelector("#informacion");

function obtenerCotizacion(codigoDivisa, fecha) {
  mostrarInformacion(codigoDivisa,fecha);
  const URL = `https://api.exchangeratesapi.io/${fecha}?base=${codigoDivisa}`;
  fetch(URL)
    .then(respuesta => respuesta.json())
    .then(respuestaJSON => {
      Object.keys(respuestaJSON.rates).forEach(divisa => {
        crearTarjeta(divisa, respuestaJSON.rates[divisa]);
      });
      if(codigoDivisa==="EUR"){
         crearTarjeta(codigoDivisa,1.00000);
     }
    })
    .catch(error => mostrarError(error));
}


cargarSelectMoneda();
$('.datepicker').datepicker("setDate", new Date());

$("#select-moneda").change(function () {
  limpiarDivisas();
  obtenerCotizacion(this.value, $('#dtp-fecha').val());

});

$("#dtp-fecha").change(function () {

  if($('#dtp-fecha').val()!==$fecha.innerHTML){
    limpiarDivisas();
    obtenerCotizacion($('#select-moneda').val(),  $('#dtp-fecha').val());
  }
});

function limpiarDivisas() {
  $("div").remove(".card-wrapper");
}

function crearTarjeta(codigo, valor) {

  const cardWrapper = $(`<div class="card-wrapper">`),
  containerTarjeta = $(`<div class="card text-center carta">`),
  bodyTarjeta = $('<div class="card-body"></div>'),
  valorMoneda = $(`<h5 class="card-title ">${codigo}</h5>`),
  textoTarjeta = $(`<p class="card-text ">${valor.toFixed(5)}</p>`)

  const $containerPrincipal = $('#contenedor-cartas');

  $containerPrincipal.append(cardWrapper);
  cardWrapper.append(containerTarjeta);

  containerTarjeta.append(bodyTarjeta);
  bodyTarjeta.append(valorMoneda);
  bodyTarjeta.append(textoTarjeta);

}

function cargarSelectMoneda() {
  fetch("https://api.exchangeratesapi.io/latest")
   .then(respuesta => respuesta.json())
     .then(respuestaJSON => {
      Object.keys(respuestaJSON.rates).forEach(divisa => {
        const $option = document.createElement('option');
        $option.text = divisa;
        $option.value = divisa;
        document.querySelector('#select-moneda').appendChild($option);
      
      });
    })
    .catch(error => mostrarError(error));
}

function mostrarInformacion(divisa,fecha) {
  $fecha.innerHTML = fecha;
  $divisa.innerHTML = divisa;
}
function mostrarError(error) {
  $informacion.innerHTML="No se pudo conectar a la API " + error;
}

