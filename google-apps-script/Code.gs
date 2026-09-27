var PASTA_ANEXOS = 'Daniela Marques Seguros — Anexos do site';
// Endereço que recebe um e-mail por cada pedido novo (deixar vazio para desativar).
var EMAIL_NOTIFICACAO = 'dmdcmediadores@gmail.com';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var anexos;
    try {
      anexos = guardarAnexos(data);
    } catch (err) {
      // O pedido é guardado mesmo que os anexos falhem, para não se perder.
      anexos = 'ERRO ao guardar anexos: ' + err.message;
    }

    // Cada formulário escreve no seu separador ("Contactos", "Seguro Auto", ...), uma coluna por campo.
    var campos = data.campos || [
      { nome: 'Nome', valor: data.nome }, { nome: 'E-mail', valor: data.email },
      { nome: 'Telefone', valor: data.telefone }, { nome: 'Ramo', valor: data.ramo },
      { nome: 'Mensagem', valor: data.mensagem },
    ];
    var pares = [['Data/Hora', new Date()]]
      .concat(campos.map(function (c) { return [String(c.nome), c.valor || '']; }))
      .concat([['Anexos', anexos]]);

    escreverLinha(data.folha || 'Contactos', pares);

    try {
      notificarPorEmail(data.folha || 'Contactos', pares, data.email);
    } catch (err) {
      // Uma falha no e-mail não impede o pedido de ficar registado na Sheet.
      console.error('Falha ao enviar notificação: ' + err.message);
    }
    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
}

// Acrescenta uma linha ao separador `nomeFolha`, criando-o (e às colunas em falta) se necessário.
function escreverLinha(nomeFolha, pares) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var nome = String(nomeFolha).replace(/[\[\]\*\?\/\\:]/g, ' ').slice(0, 90) || 'Contactos';
    var folha = ss.getSheetByName(nome) || ss.insertSheet(nome);

    var ultimaColuna = folha.getLastColumn();
    var cabecalhos = ultimaColuna ? folha.getRange(1, 1, 1, ultimaColuna).getValues()[0] : [];
    var alterou = false;
    pares.forEach(function (p) {
      if (cabecalhos.indexOf(p[0]) === -1) { cabecalhos.push(p[0]); alterou = true; }
    });
    if (alterou) {
      folha.getRange(1, 1, 1, cabecalhos.length).setValues([cabecalhos]).setFontWeight('bold');
      folha.setFrozenRows(1);
    }

    var valores = {};
    pares.forEach(function (p) { valores[p[0]] = p[1]; });
    folha.appendRow(cabecalhos.map(function (h) { return protegerValor(valores[h]); }));
  } finally {
    lock.releaseLock();
  }
}

// Envia um e-mail com o resumo do pedido. "Responder" vai diretamente para o e-mail do cliente.
function notificarPorEmail(tipo, pares, emailCliente) {
  if (!EMAIL_NOTIFICACAO) return;

  var valores = {};
  pares.forEach(function (p) { valores[p[0]] = p[1]; });
  var nome = valores['Nome'] || 'sem nome';

  var linhas = pares.filter(function (p) { return p[0] !== 'Data/Hora' && p[1] !== '' && p[1] !== undefined; });
  var tabela = linhas.map(function (p) {
    var valor = escaparHtml(String(p[1])).replace(/\n/g, '<br>');
    if (p[0] === 'Anexos') {
      valor = String(p[1]).split('\n').map(function (url) {
        return /^https:\/\//.test(url) ? '<a href="' + escaparHtml(url) + '">' + escaparHtml(url) + '</a>' : escaparHtml(url);
      }).join('<br>');
    }
    return '<tr><td style="padding:6px 12px 6px 0;color:#56656c;vertical-align:top;white-space:nowrap">' +
      escaparHtml(p[0]) + '</td><td style="padding:6px 0;color:#14232b">' + valor + '</td></tr>';
  }).join('');

  var html =
    '<div style="font-family:Arial,sans-serif;font-size:14px">' +
    '<h2 style="color:#083d52;margin:0 0 12px">Novo pedido: ' + escaparHtml(tipo) + '</h2>' +
    '<table style="border-collapse:collapse">' + tabela + '</table>' +
    '<p style="margin-top:20px"><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Abrir a Google Sheet</a></p>' +
    '</div>';
  var texto = linhas.map(function (p) { return p[0] + ': ' + p[1]; }).join('\n');

  var opcoes = { htmlBody: html, name: 'Site DMDC Mediadores' };
  if (emailCliente && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailCliente)) opcoes.replyTo = emailCliente;

  MailApp.sendEmail(EMAIL_NOTIFICACAO, 'Novo pedido: ' + tipo + ' — ' + nome, texto, opcoes);
}

function escaparHtml(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Impede que texto enviado pelo formulário seja interpretado como fórmula (ex: "=IMPORTXML(...)").
function protegerValor(valor) {
  if (valor === undefined || valor === null) return '';
  if (typeof valor === 'string' && /^[=+\-@]/.test(valor)) return "'" + valor;
  return valor;
}

// Guarda os anexos (até 3) na pasta do Drive e devolve os links, um por linha.
function guardarAnexos(data) {
  var anexos = data.anexos ||
    (data.anexoBase64 ? [{ nome: data.anexoNome, tipo: data.anexoTipo, base64: data.anexoBase64 }] : []);
  if (!anexos.length) return '';

  var pasta = getOrCreateFolder(PASTA_ANEXOS);
  return anexos.slice(0, 3).map(function (a) {
    var blob = Utilities.newBlob(
      Utilities.base64Decode(a.base64),
      a.tipo || 'application/octet-stream',
      a.nome || 'anexo'
    );
    return pasta.createFile(blob).getUrl();
  }).join('\n');
}

function getOrCreateFolder(nome) {
  var folders = DriveApp.getFoldersByName(nome);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(nome);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Executar uma vez manualmente no editor para autorizar o acesso ao Google Drive e ao envio de e-mails.
function autorizarDrive() {
  Logger.log('Pasta de anexos: ' + getOrCreateFolder(PASTA_ANEXOS).getUrl());
  Logger.log('E-mails que ainda pode enviar hoje: ' + MailApp.getRemainingDailyQuota());
}
