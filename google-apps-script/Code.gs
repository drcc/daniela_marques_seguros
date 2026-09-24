var PASTA_ANEXOS = 'Daniela Marques Seguros — Anexos do site';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var anexo;
    try {
      anexo = guardarAnexo(data);
    } catch (err) {
      // O contacto é guardado mesmo que o anexo falhe, para não se perder o pedido.
      anexo = 'ERRO ao guardar anexo "' + (data.anexoNome || '') + '": ' + err.message;
    }

    sheet.appendRow([
      new Date(),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.ramo || '',
      data.mensagem || '',
      anexo,
      data.tipo || '',
    ]);

    return jsonResponse({ result: 'success' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.message });
  }
}

function guardarAnexo(data) {
  if (!data.anexoBase64) return '';

  var blob = Utilities.newBlob(
    Utilities.base64Decode(data.anexoBase64),
    data.anexoTipo || 'application/octet-stream',
    data.anexoNome || 'anexo'
  );
  var file = getOrCreateFolder(PASTA_ANEXOS).createFile(blob);
  return file.getUrl();
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
