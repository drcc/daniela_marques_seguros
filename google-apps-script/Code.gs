var PASTA_ANEXOS = 'Daniela Marques Seguros — Anexos do site';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var anexos;
    try {
      anexos = guardarAnexos(data);
    } catch (err) {
      // O contacto é guardado mesmo que os anexos falhem, para não se perder o pedido.
      anexos = 'ERRO ao guardar anexos: ' + err.message;
    }

    sheet.appendRow([
      new Date(),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.ramo || '',
      data.mensagem || '',
      anexos,
      data.tipo || '',
    ]);

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
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

// Executar uma vez manualmente no editor para autorizar o acesso ao Google Drive.
function autorizarDrive() {
  Logger.log('Pasta de anexos: ' + getOrCreateFolder(PASTA_ANEXOS).getUrl());
}
