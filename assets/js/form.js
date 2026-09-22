// TODO: substituir pelo URL do Google Apps Script Web App (ver google-apps-script/README.md)
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/PREENCHER_COM_DEPLOYMENT_ID/exec';

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  var ramoParam = new URLSearchParams(window.location.search).get('ramo');
  if (ramoParam && form.ramo.querySelector('option[value="' + ramoParam + '"]')) {
    form.ramo.value = ramoParam;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (APPS_SCRIPT_URL.indexOf('PREENCHER_COM_DEPLOYMENT_ID') !== -1) {
      showStatus('error', 'Formulário ainda não está ligado ao Google Sheets. Configura o URL do Apps Script em assets/js/form.js.');
      return;
    }

    var payload = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      ramo: form.ramo.value,
      mensagem: form.mensagem.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'A enviar...';
    hideStatus();

    // Content-Type text/plain evita o pedido preflight OPTIONS, que o Apps Script não trata.
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data && data.result === 'success') {
          form.reset();
          showStatus('success', 'Mensagem enviada com sucesso. Entraremos em contacto brevemente.');
        } else {
          showStatus('error', 'Não foi possível enviar a mensagem. Tenta novamente ou contacta-nos por telefone.');
        }
      })
      .catch(function () {
        showStatus('error', 'Não foi possível enviar a mensagem. Verifica a ligação à internet e tenta novamente.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensagem';
      });
  });

  function showStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = 'form-status ' + type;
  }

  function hideStatus() {
    statusBox.className = 'form-status';
    statusBox.textContent = '';
  }
});
