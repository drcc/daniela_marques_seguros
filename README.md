# Daniela Marques Seguros

Site institucional de agente de seguros vinculada (Vida e Não Vida), em representação da Seguramos Brokers.

## Stack

- HTML/CSS/JS estático, sem framework nem build step
- Formulário de contacto via `fetch()` para um Google Apps Script Web App, que escreve numa Google Sheet
- Deploy automático via GitHub Actions para GitHub Pages (`.github/workflows/deploy.yml`)

## Estrutura

```
index.html                Início
seguros-nao-vida.html     Automóvel, Habitação, Saúde, Acidentes Pessoais, Responsabilidade Civil
seguros-vida.html         Seguro de Vida, Poupança/Reforma, Crédito Habitação
sobre.html                Apresentação e parceria com a Seguramos
contacto.html             Formulário de contacto + informação de contacto
privacidade.html          Política de Privacidade (RGPD)
termos.html               Termos e Condições
assets/css/style.css      Estilos (paleta, tipografia, layout)
assets/js/main.js         Menu mobile, ano do rodapé
assets/js/form.js         Submissão do formulário para o Apps Script
google-apps-script/       Código e instruções do Apps Script
.github/workflows/        Deploy automático para GitHub Pages
TODO.md                   Dados e conteúdos ainda por preencher
```

## Ver localmente

Não é necessário build. Basta abrir `index.html` no browser, ou correr um servidor simples:

```bash
python3 -m http.server 8000
```

E aceder a `http://localhost:8000`.

## Configurar o formulário de contacto

Segue as instruções em [`google-apps-script/README.md`](./google-apps-script/README.md) para criar a
Google Sheet, publicar o Apps Script e atualizar o URL em `assets/js/form.js`.

## Deploy

### GitHub Pages (incluído)

O workflow `.github/workflows/deploy.yml` já está configurado: a cada push para `main`, o site é publicado
automaticamente. Só é preciso ativar uma vez, em **Settings → Pages → Source → GitHub Actions**, no
repositório GitHub. O site fica disponível em `https://<utilizador>.github.io/<nome-do-repositório>`.

### Alternativas (Cloudflare Pages / Vercel / Netlify)

Qualquer um destes serviços pode ligar-se diretamente ao repositório GitHub:

- **Build command:** nenhum (site estático)
- **Output directory:** raiz do projeto (`/`)

## Domínio

Domínio: **dmdcmediadores.pt**, gerido em [DNS.pt](https://www.dns.pt). O ficheiro `CNAME` na raiz do
projeto já configura o domínio custom no GitHub Pages.

### 1. Configurar DNS (em DNS.pt, ou onde o domínio estiver gerido)

Adicionar estes registos na zona DNS de `dmdcmediadores.pt`:

| Tipo  | Nome | Valor                     |
|-------|------|---------------------------|
| A     | @    | 185.199.108.153           |
| A     | @    | 185.199.109.153           |
| A     | @    | 185.199.110.153           |
| A     | @    | 185.199.111.153           |
| CNAME | www  | drcc.github.io            |

(Opcional, IPv6 — registos AAAA para `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`)

A propagação DNS pode demorar entre alguns minutos a 24-48h.

### 2. Configurar no GitHub

Em **Settings → Pages** do repositório:
1. Em **Custom domain**, escreve `dmdcmediadores.pt` e grava (o ficheiro `CNAME` do repositório já trata
   disto automaticamente, mas convém confirmar que aparece aqui).
2. Espera que o GitHub valide o DNS (ícone verde).
3. Ativa **Enforce HTTPS** assim que essa opção deixar de estar desativada (o certificado demora alguns
   minutos a ser emitido depois do DNS propagar).

Depois disto, o site fica acessível em `https://dmdcmediadores.pt`.

## Antes de publicar

Ver [`TODO.md`](./TODO.md) — inclui NIF, número de registo na ASF, morada, contactos, logótipo definitivo
e paleta de cores oficial da Seguramos.
