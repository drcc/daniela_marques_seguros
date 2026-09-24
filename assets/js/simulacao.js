// Formulários de simulação por tipo de seguro (seguros-nao-vida.html e seguros-vida.html).
// Cada botão [data-sim-toggle="x"] abre/fecha o painel #simular-x, onde o formulário é criado a partir de TIPOS.

var SIM_NAO_SEI = 'Não sei / aconselhe-me';

var TIPOS = {
  automovel: {
    titulo: 'Seguro Auto',
    anexoDica: 'Ex: DUA, carta de condução, apólice atual.',
    infoDica: 'Pode indicar a matrícula da sua viatura, marca e modelo, bem como qual a seguradora atual.',
    nota: 'As simulações têm validade de um mês, pelo que devem ser pedidas, no máximo, com um mês de antecedência face ao término do seguro atual.',
    campos: [
      { name: 'veiculo', label: 'Tipo de veículo', type: 'radio', required: true, options: ['Automóvel', 'Moto'], full: true },
      { name: 'marca_modelo', label: 'Marca e modelo', required: true, placeholder: 'Ex: Renault Clio 1.5 dCi' },
      { name: 'ano', label: 'Ano do veículo', type: 'number', required: true, min: 1950, max: 2030 },
      { name: 'matricula', label: 'Matrícula', placeholder: 'Ex: AA-00-AA' },
      { name: 'codigo_postal', label: 'Código postal', required: true, placeholder: 'Ex: 3800-000' },
      { name: 'nascimento', label: 'Data de nascimento do condutor', type: 'date', required: true },
      { name: 'carta', label: 'Ano de obtenção da carta', type: 'number', required: true, min: 1950, max: 2030 },
      { name: 'coberturas', label: 'Tipo de coberturas (assinale as pretendidas)', type: 'checkbox', full: true,
        options: ['Quebra isolada de vidros', 'Quebra isolada de vidros + Furto e Roubo', 'Danos Próprios Completo (Multirriscos)', 'Viatura de Substituição'] },
      { name: 'sinistros', label: 'Sinistros nos últimos 5 anos', type: 'select', options: ['Nenhum', '1', '2 ou mais'] },
    ],
  },
  habitacao: {
    titulo: 'Seguro de Habitação',
    anexoDica: 'Ex: apólice atual, caderneta predial.',
    campos: [
      { name: 'tipo_imovel', label: 'Tipo de imóvel', type: 'select', required: true, options: ['Apartamento', 'Moradia'] },
      { name: 'utilizacao', label: 'Utilização', type: 'select', required: true,
        options: ['Habitação própria permanente', 'Habitação secundária', 'Arrendada a terceiros'] },
      { name: 'codigo_postal', label: 'Código postal', required: true, placeholder: 'Ex: 3830-000' },
      { name: 'ano_construcao', label: 'Ano de construção', type: 'number', min: 1800, max: 2030 },
      { name: 'area', label: 'Área (m²)', type: 'number', min: 1 },
      { name: 'credito', label: 'Tem crédito habitação?', type: 'select', options: ['Sim', 'Não'] },
      { name: 'capital_imovel', label: 'Valor do imóvel a segurar (€)', type: 'number', min: 0, placeholder: 'Se souber' },
      { name: 'capital_recheio', label: 'Valor do recheio (€)', type: 'number', min: 0, placeholder: 'Se souber' },
    ],
  },
  saude: {
    titulo: 'Seguro de Saúde',
    anexoDica: 'Ex: apólice atual.',
    campos: [
      { name: 'pessoas', label: 'Número de pessoas a segurar', type: 'number', required: true, min: 1 },
      { name: 'idades', label: 'Idades das pessoas', required: true, placeholder: 'Ex: 42, 40, 12' },
      { name: 'plano', label: 'Plano pretendido', type: 'select', required: true,
        options: ['Base (consultas e exames)', 'Intermédio (inclui internamento)', 'Completo (inclui estomatologia e parto)', SIM_NAO_SEI] },
      { name: 'seguro_atual', label: 'Tem seguro de saúde atualmente?', type: 'select', options: ['Sim', 'Não'] },
    ],
  },
  viagem: {
    titulo: 'Seguro de Viagem',
    anexoDica: 'Ex: reserva da viagem.',
    campos: [
      { name: 'destino', label: 'Destino', required: true, placeholder: 'Ex: Espanha, Brasil, Europa' },
      { name: 'tipo_viagem', label: 'Tipo de seguro', type: 'select', required: true, options: ['Viagem única', 'Anual (várias viagens)'] },
      { name: 'data_ida', label: 'Data de ida', type: 'date' },
      { name: 'data_regresso', label: 'Data de regresso', type: 'date' },
      { name: 'viajantes', label: 'Número de viajantes', type: 'number', required: true, min: 1 },
      { name: 'idades', label: 'Idades dos viajantes', placeholder: 'Ex: 35, 33, 6' },
      { name: 'motivo', label: 'Motivo', type: 'select', options: ['Lazer', 'Trabalho', 'Estudos'] },
    ],
  },
  'acidentes-trabalho': {
    titulo: 'Seguro de Acidentes de Trabalho',
    anexoDica: 'Ex: apólice atual, declaração de início de atividade.',
    campos: [
      { name: 'tomador', label: 'Para quem é o seguro?', type: 'select', required: true,
        options: ['Trabalhador independente', 'Empresa / entidade empregadora'] },
      { name: 'atividade', label: 'Atividade / profissão', required: true, placeholder: 'Ex: eletricista, restauração, construção' },
      { name: 'trabalhadores', label: 'Número de trabalhadores', type: 'number', min: 1, placeholder: 'Se for empresa' },
      { name: 'remuneracao', label: 'Remuneração anual a segurar (€)', type: 'number', min: 0, placeholder: 'Total anual estimado' },
    ],
  },
  'acidentes-pessoais': {
    titulo: 'Seguro de Acidentes Pessoais',
    anexoDica: 'Ex: apólice atual.',
    campos: [
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'profissao', label: 'Profissão', required: true },
      { name: 'ambito', label: 'Âmbito da cobertura', type: 'select',
        options: ['24 horas (vida privada e profissional)', 'Apenas atividade profissional', 'Apenas vida privada / desporto', SIM_NAO_SEI] },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', min: 0, placeholder: 'Se souber' },
    ],
  },
  'responsabilidade-civil': {
    titulo: 'Seguro de Responsabilidade Civil',
    anexoDica: 'Ex: apólice atual, exigência contratual.',
    campos: [
      { name: 'tipo_rc', label: 'Tipo de responsabilidade civil', type: 'select', required: true,
        options: ['Familiar / vida privada', 'Profissional', 'Animais de companhia', 'Atividade desportiva', 'Outra'] },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', min: 0, placeholder: 'Se souber' },
      { name: 'descricao', label: 'O que pretende segurar?', type: 'textarea', required: true, full: true,
        placeholder: 'Descreva a atividade, o animal ou a situação a cobrir.' },
    ],
  },
  'seguro-de-vida': {
    titulo: 'Seguro de Vida',
    anexoDica: 'Ex: apólice atual, última simulação.',
    campos: [
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'fumador', label: 'Fumador?', type: 'select', required: true, options: ['Não', 'Sim'] },
      { name: 'profissao', label: 'Profissão' },
      { name: 'capital', label: 'Capital pretendido (€)', type: 'number', min: 0, placeholder: 'Se souber' },
      { name: 'coberturas', label: 'Coberturas pretendidas', type: 'select',
        options: ['Morte', 'Morte e invalidez', 'Morte, invalidez e doenças graves', SIM_NAO_SEI] },
    ],
  },
  'poupanca-reforma': {
    titulo: 'Poupança / PPR',
    anexoDica: 'Ex: extrato de PPR atual.',
    campos: [
      { name: 'nascimento', label: 'Data de nascimento', type: 'date', required: true },
      { name: 'objetivo', label: 'Objetivo', type: 'select', required: true,
        options: ['Complemento de reforma (PPR)', 'Poupança a médio/longo prazo', 'Educação dos filhos'] },
      { name: 'montante_inicial', label: 'Montante inicial (€)', type: 'number', min: 0 },
      { name: 'entrega_mensal', label: 'Entrega mensal (€)', type: 'number', min: 0 },
      { name: 'perfil', label: 'Perfil de risco', type: 'select', options: ['Conservador', 'Moderado', 'Dinâmico', SIM_NAO_SEI] },
    ],
  },
  'credito-habitacao': {
    titulo: 'Seguro de Crédito Habitação',
    anexoDica: 'Ex: FINE / simulação do banco, apólice atual.',
    campos: [
      { name: 'titulares', label: 'Número de titulares', type: 'select', required: true, options: ['1', '2'] },
      { name: 'nascimentos', label: 'Data(s) de nascimento dos titulares', required: true, placeholder: 'Ex: 12/03/1985 e 04/07/1987' },
      { name: 'fumadores', label: 'Fumadores', type: 'select', options: ['Nenhum', 'Um dos titulares', 'Ambos'] },
      { name: 'capital_divida', label: 'Capital em dívida (€)', type: 'number', required: true, min: 0 },
      { name: 'prazo', label: 'Prazo restante (anos)', type: 'number', min: 1, max: 50 },
      { name: 'banco', label: 'Banco', placeholder: 'Ex: CGD, Millennium, Santander' },
      { name: 'situacao', label: 'Situação atual', type: 'select',
        options: ['Crédito novo', 'Já tenho seguro no banco', 'Já tenho seguro noutra seguradora'] },
    ],
  },
};

document.addEventListener('DOMContentLoaded', function () {
  var botoes = document.querySelectorAll('[data-sim-toggle]');
  if (!botoes.length) return;

  botoes.forEach(function (botao) {
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-controls', 'simular-' + botao.dataset.simToggle);
    botao.addEventListener('click', function (event) {
      event.preventDefault();
      alternar(botao.dataset.simToggle);
    });
  });

  // Permite ligar diretamente a um formulário aberto, ex: seguros-nao-vida.html#simular-automovel
  if (location.hash.indexOf('#simular-') === 0) {
    alternar(location.hash.replace('#simular-', ''), true);
  }

  function alternar(chave, forcarAbrir) {
    var painel = document.getElementById('simular-' + chave);
    var botao = document.querySelector('[data-sim-toggle="' + chave + '"]');
    if (!painel || !TIPOS[chave]) return;

    var abrir = forcarAbrir || painel.hidden;
    if (abrir && !painel.firstChild) painel.appendChild(criarFormulario(chave, painel.dataset.ramo));

    painel.hidden = !abrir;
    if (botao) {
      botao.setAttribute('aria-expanded', String(abrir));
      botao.textContent = abrir ? 'Fechar simulação' : 'Pedir simulação';
    }
    if (abrir) {
      painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var primeiro = painel.querySelector('input, select, textarea');
      if (primeiro) primeiro.focus({ preventScroll: true });
    }
  }
});

function criarFormulario(chave, ramo) {
  var tipo = TIPOS[chave];
  var prefixo = 'sim-' + chave + '-';

  var form = document.createElement('form');
  form.className = 'sim-form';
  form.noValidate = true;
  form.innerHTML =
    '<h3>Simulação — ' + tipo.titulo + '</h3>' +
    '<p class="sim-intro">Preencha o que souber — os campos com * são obrigatórios. Respondo com uma proposta o mais brevemente possível.</p>' +
    (tipo.nota ? '<p class="sim-nota"><strong>Nota:</strong> ' + tipo.nota + '</p>' : '') +
    '<p class="sim-section-title">Dados para a simulação</p>' +
    '<div class="sim-grid">' + tipo.campos.map(function (c) { return campoHtml(c, prefixo); }).join('') + '</div>' +
    '<p class="sim-section-title">Os seus contactos</p>' +
    '<div class="sim-grid">' +
      campoHtml({ name: 'nome', label: 'Nome', required: true }, prefixo) +
      campoHtml({ name: 'email', label: 'E-mail', type: 'email', required: true }, prefixo) +
      campoHtml({ name: 'telefone', label: 'Telemóvel', type: 'tel', required: true, placeholder: 'Ex: 912 345 678' }, prefixo) +
    '</div>' +
    '<div class="form-group">' +
      '<label for="' + prefixo + 'observacoes">Informações adicionais</label>' +
      '<textarea id="' + prefixo + 'observacoes" name="observacoes" rows="3"' +
        (tipo.infoDica ? ' placeholder="' + tipo.infoDica + '"' : '') + '></textarea>' +
    '</div>' +
    '<div class="form-group">' +
      '<label for="' + prefixo + 'anexo">Anexo (opcional)</label>' +
      '<input type="file" id="' + prefixo + 'anexo" name="anexo" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">' +
      '<small class="form-hint">' + tipo.anexoDica + ' Máx. 8MB (PDF, imagem ou Word).</small>' +
    '</div>' +
    '<div class="form-group checkbox-row">' +
      '<input type="checkbox" id="' + prefixo + 'rgpd" name="rgpd" required>' +
      '<label for="' + prefixo + 'rgpd">Autorizo o tratamento dos meus dados pessoais para efeitos de resposta ao meu pedido de simulação, ' +
        'nos termos da <a href="privacidade.html" target="_blank">Política de Privacidade</a>. *</label>' +
    '</div>' +
    '<button type="submit" class="btn btn-primary">Enviar pedido de simulação</button>' +
    '<div class="form-status" role="status"></div>';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var linhas = ['Pedido de simulação — ' + tipo.titulo, ''];
    tipo.campos.forEach(function (c) {
      var valor = valorCampo(form, c);
      if (valor) linhas.push(c.label.replace(/ \(.*\)$/, '') + ': ' + valor);
    });
    var observacoes = form.elements.observacoes.value.trim();
    if (observacoes) linhas.push('', 'Informações adicionais:', observacoes);

    enviarPedido(form, {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: form.elements.telefone.value.trim(),
      ramo: ramo,
      tipo: tipo.titulo,
      mensagem: linhas.join('\n'),
    });
  });

  return form;
}

function campoHtml(c, prefixo) {
  var id = prefixo + c.name;
  var req = c.required ? ' required' : '';
  var label = '<label for="' + id + '">' + c.label + (c.required ? ' *' : '') + '</label>';
  var placeholder = c.placeholder ? ' placeholder="' + c.placeholder + '"' : '';
  var controlo;

  if (c.type === 'radio' || c.type === 'checkbox') {
    return '<fieldset class="form-group choice-group choice-' + c.type + (c.full ? ' full' : '') + '">' +
      '<legend>' + c.label + (c.required ? ' *' : '') + '</legend>' +
      c.options.map(function (o, i) {
        var oid = id + '-' + i;
        return '<label class="choice" for="' + oid + '"><input type="' + c.type + '" id="' + oid + '" name="' + c.name + '" value="' + o + '"' +
          (c.type === 'radio' ? req : '') + '> ' + o + '</label>';
      }).join('') +
      '</fieldset>';
  }

  if (c.type === 'select') {
    controlo = '<select id="' + id + '" name="' + c.name + '"' + req + '>' +
      '<option value="">Selecione</option>' +
      c.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') +
      '</select>';
  } else if (c.type === 'textarea') {
    controlo = '<textarea id="' + id + '" name="' + c.name + '" rows="3"' + placeholder + req + '></textarea>';
  } else {
    var tipo = c.type || 'text';
    var limites = (c.min !== undefined ? ' min="' + c.min + '"' : '') + (c.max !== undefined ? ' max="' + c.max + '"' : '');
    controlo = '<input type="' + tipo + '" id="' + id + '" name="' + c.name + '"' + limites + placeholder + req + '>';
  }

  return '<div class="form-group' + (c.full ? ' full' : '') + '">' + label + controlo + '</div>';
}

function valorCampo(form, c) {
  if (c.type === 'checkbox') {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + c.name + '"]:checked'), function (el) { return el.value; }).join(', ');
  }
  if (c.type === 'radio') {
    var marcado = form.querySelector('input[name="' + c.name + '"]:checked');
    return marcado ? marcado.value : '';
  }
  return form.elements[c.name].value.trim();
}
