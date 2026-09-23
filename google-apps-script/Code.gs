var PASTA_ANEXOS = 'Daniela Marques Seguros — Anexos do site';

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nome || '',
    data.email || '',
    data.telefone || '',
    data.ramo || '',
    data.mensagem || '',
    guardarAnexo(data),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
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
