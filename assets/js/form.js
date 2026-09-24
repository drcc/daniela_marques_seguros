// URL do Google Apps Script Web App (ver google-apps-script/README.md)
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfXSucAYFv-7dkZJ-afWubEJZt6Hw5Gri6oKNUx7dT5TlNpR4Ja6u8QrCjZbokx5kV1A/exec';

var MAX_ANEXO_BYTES = 8 * 1024 * 1024;

// Envia um pedido (contacto ou simulação) para a Google Sheet.
// `payload` tem nome, email, telefone, ramo, tipo e mensagem; o anexo é lido do próprio formulário.
function enviarPedido(form, payload) {
  var statusBox = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  if (APPS_SCRIPT_URL.indexOf('PREENCHER_COM_DEPLOYMENT_ID') !== -1) {
    showStatus('error', 'Formulário ainda não está ligado ao Google Sheets. Configura o URL do Apps Script em assets/js/form.js.');
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  var anexoInput = form.querySelector('input[type="file"]');
  var anexo = anexoInput && anexoInput.files[0];
  if (anexo && anexo.size > MAX_ANEXO_BYTES) {
    showStatus('error', 'O anexo excede o limite de 8MB. Reduz o ficheiro ou envia-o por e-mail.');
    return;
  }

  var labelOriginal = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'A enviar...';
  hideStatus();

  readFileAsBase64(anexo)
    .then(function (anexoData) {
      payload.anexoNome = anexoData ? anexo.name : '';
      payload.anexoTipo = anexoData ? anexo.type : '';
      payload.anexoBase64 = anexoData || '';

      // Content-Type text/plain evita o pedido preflight OPTIONS, que o Apps Script não trata.
      return fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (data && data.result === 'success') {
        form.reset();
        showStatus('success', 'Pedido enviado com sucesso. Entrarei em contacto brevemente.');
      } else {
        showStatus('error', 'Não foi possível enviar o pedido. Tente novamente ou contacte-nos por telefone.');
      }
    })
    .catch(function () {
      showStatus('error', 'Não foi possível enviar o pedido. Verifique a ligação à internet e tente novamente.');
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = labelOriginal;
    });

  function showStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = 'form-status ' + type;
  }

  function hideStatus() {
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  }
}

function readFileAsBase64(file) {
  if (!file) return Promise.resolve(null);
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      var result = reader.result;
      resolve(result.substring(result.indexOf(',') + 1));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var ramoParam = new URLSearchParams(window.location.search).get('ramo');
  if (ramoParam && form.ramo.querySelector('option[value="' + ramoParam + '"]')) {
    form.ramo.value = ramoParam;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    enviarPedido(form, {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      ramo: form.ramo.value,
      tipo: 'Contacto geral',
      mensagem: form.mensagem.value.trim(),
    });
  });
});
