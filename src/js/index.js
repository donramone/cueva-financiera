/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint no-use-before-define: 0 */

const $fecha = document.querySelector('#fecha');
const $divisa = document.querySelector('#divisa');
const $informacion = document.querySelector('#informacion');

function mostrarInformacion(divisa, fecha) {
  $fecha.innerHTML = fecha;
  $divisa.innerHTML = divisa;
}

function crearTarjeta(codigo, valor) {
  const cardWrapper = $('<div class="card-wrapper">');
  const containerTarjeta = $('<div class="card text-center carta">');
  const bodyTarjeta = $('<div class="card-body"></div>');
  const valorMoneda = $(`<h5 class="card-title ">${codigo}</h5>`);
  const textoTarjeta = $(`<p class="card-text ">${valor.toFixed(5)}</p>`);

  const $containerPrincipal = $('#contenedor-cartas');

  $containerPrincipal.append(cardWrapper);
  cardWrapper.append(containerTarjeta);

  containerTarjeta.append(bodyTarjeta);
  bodyTarjeta.append(valorMoneda);
  bodyTarjeta.append(textoTarjeta);
}

function mostrarError(error) {
  $informacion.innerHTML = `No se pudo conectar a la API,${error}`;
}

function guardarCotizacionLS(key, data) {
  localStorage.setItem(key, data);
}

function actualizarCotizacion() {
  const valorMoneda = $('#select-moneda').val();
  const fecha = $('#dtp-fecha').val();
  limpiarInformacionDivisas();
  mostrarInformacion(valorMoneda, fecha);
  buscarCotizacion(valorMoneda, fecha).then((cotizaciones) => {
    Object.entries(cotizaciones).forEach((divisa) => {
      crearTarjeta(divisa[0], divisa[1]);
    });
  });
}

async function buscarCotizacion(codigoDivisa, fecha) {
  const keyCache = `cotizacion_${codigoDivisa}_${fecha}`;
  const cotizacionesCache = localStorage.getItem(keyCache);
  if (cotizacionesCache) {
    return JSON.parse(cotizacionesCache);
  }
  const URL = `https://api.exchangeratesapi.io/${fecha}?base=${codigoDivisa}`;
  const cotizacionesAPI = await fetch(URL)
    .then((r) => r.json())
    .then((r) => r.rates);
  guardarCotizacionLS(keyCache, JSON.stringify(cotizacionesAPI));
  return cotizacionesAPI;
}

function limpiarInformacionDivisas() {
  $('div').remove('.card-wrapper');
}

$('.datepicker').datepicker('setDate', new Date());

$('#select-moneda').change(() => {
  // agregar un control
  actualizarCotizacion();
});

$('#dtp-fecha').change(() => {
  if ($('#dtp-fecha').val() !== $fecha.innerHTML) {
    actualizarCotizacion();
  }
});

function cargarSelectMoneda() {
  fetch('https://api.exchangeratesapi.io/latest')
    .then((respuesta) => respuesta.json())
    .then((respuestaJSON) => {
      Object.keys(respuestaJSON.rates).forEach((divisa) => {
        const $option = document.createElement('option');
        $option.text = divisa;
        $option.value = divisa;
        document.querySelector('#select-moneda').appendChild($option);
      });
    })
    .catch((error) => mostrarError(error));
}

cargarSelectMoneda();
