var PASTA_ANEXOS = 'Daniela Marques Seguros — Anexos do site';

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

// Executar uma vez manualmente no editor para autorizar o acesso ao Google Drive.
function autorizarDrive() {
  Logger.log('Pasta de anexos: ' + getOrCreateFolder(PASTA_ANEXOS).getUrl());
}
