# Formulário de contacto — Google Apps Script + Google Sheets

Este ficheiro explica como ligar o formulário de contacto (`contacto.html`) a uma Google Sheet.

## 1. Criar a Google Sheet

1. Cria uma nova Google Sheet (ex: "DMDC Mediadores — Contactos").
2. Na primeira linha, adiciona os cabeçalhos:
   `Data/Hora | Nome | Email | Telefone | Ramo | Mensagem | Anexo | Tipo de seguro`

## 2. Adicionar o Apps Script

1. Na Sheet, vai a **Extensões → Apps Script**.
2. Apaga o conteúdo do editor e cola o conteúdo de [`Code.gs`](./Code.gs).
3. Grava o projeto (ex: nome "Formulário Contacto").
4. No topo do editor, seleciona a função **`autorizarDrive`** e clica em **Executar**. Aceita as
   permissões pedidas (Google Sheets e Google Drive). Isto cria a pasta dos anexos e garante que o
   script tem acesso ao Drive — sem este passo, os anexos falham.

## 3. Publicar como Web App

1. Clica em **Implementar → Nova implementação**.
2. Tipo: **Aplicação Web**.
3. Executar como: **Eu (a tua conta Google)**.
4. Quem tem acesso: **Qualquer pessoa**.
5. Clica em **Implementar** e autoriza as permissões pedidas — vai pedir acesso ao Google Sheets **e ao
   Google Drive** (necessário para guardar os anexos do formulário).
6. Copia o **URL da aplicação Web** gerado (algo como `https://script.google.com/macros/s/AKfycb.../exec`).

## 4. Ligar ao site

1. Abre [`assets/js/form.js`](../assets/js/form.js).
2. Substitui o valor de `APPS_SCRIPT_URL` pelo URL copiado no passo anterior.

## 5. Testar

1. Abre `contacto.html` no browser (ou no site publicado).
2. Preenche e envia o formulário.
3. Confirma que aparece uma nova linha na Google Sheet.

## Notas

- Sempre que o código em `Code.gs` for alterado, é necessário criar uma **nova implementação** (ou gerir versões em "Implementar → Gerir implementações") para as alterações ficarem ativas no URL público.
- O acesso "Qualquer pessoa" é necessário para que o site (sem autenticação) consiga submeter dados — o script em si só permite escrever na Sheet, não expõe o conteúdo da mesma.
- Para consultar as submissões, basta abrir diretamente a Google Sheet.
- Os anexos ficam guardados numa pasta do Google Drive chamada **"Daniela Marques Seguros — Anexos do
  site"** (criada automaticamente pelo script na primeira vez que alguém anexa um ficheiro), privados por
  omissão (só visíveis à conta Google que geriu o Apps Script). Cada pedido pode ter até 3 anexos; os links ficam na
  coluna "Anexo" da Sheet, um por linha.
