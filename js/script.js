
// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
  inicializarAno();
  inicializarMenuMobile();
  inicializarPlanos();
  inicializarFormContato();
  inicializarPesquisa();
  inicializarLogin();
});

// Atualiza o ano dinâmico no rodapé
function inicializarAno() {
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
}

// Valida e-mail com expressão regular simples
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Exibe mensagem de erro em um campo específico
function mostrarErro(campo, mensagem) {
  const input = document.getElementById(campo);
  const erro = document.querySelector(`[data-erro="${campo}"]`);
  if (input) input.classList.add('invalido');
  if (erro) erro.textContent = mensagem;
}

// Limpa todas as mensagens de erro do formulário
function limparErros(form) {
  form.querySelectorAll('.erro').forEach((el) => (el.textContent = ''));
  form.querySelectorAll('.invalido').forEach((el) => el.classList.remove('invalido'));
}

/* ----------- Menu mobile ----------- */
function inicializarMenuMobile() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => nav.classList.toggle('aberto'));

  // Fecha o menu ao clicar em um link (mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('aberto'));
  });
}

/* ----------- Seleção de planos ----------- */
function inicializarPlanos() {
  const botoes = document.querySelectorAll('.btn-plano');
  botoes.forEach((btn) => {
    btn.addEventListener('click', () => {
      const plano = btn.dataset.plano;
      alert(`✅ Você selecionou o plano ${plano}!\nPreencha o formulário de contato e nossa equipe entrará em contato.`);
      // Rola até a seção de contato
      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ----------- Formulário de Contato + Cadastro Dinâmico ----------- */

// Lista de alunos cadastrados em memória
let alunos = [];

function inicializarFormContato() {
  const form = document.getElementById('formContato');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita recarregar a página
    limparErros(form);

    // Coleta os dados
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const objetivo = form.objetivo.value;

    let valido = true;

    // Validações
    if (nome.length < 2) {
      mostrarErro('nome', 'Informe seu nome completo.');
      valido = false;
    }
    if (!validarEmail(email)) {
      mostrarErro('email', 'E-mail inválido.');
      valido = false;
    }
    if (telefone.length < 8) {
      mostrarErro('telefone', 'Telefone inválido.');
      valido = false;
    }
    if (!objetivo) {
      mostrarErro('objetivo', 'Selecione um objetivo.');
      valido = false;
    }

    if (!valido) return;

    // Cadastra o aluno
    const aluno = { id: Date.now(), nome, email, telefone, objetivo };
    alunos.push(aluno);
    renderizarAlunos();

    // Mostra mensagem de sucesso temporária
    const msg = document.getElementById('mensagemSucesso');
    if (msg) {
      msg.hidden = false;
      setTimeout(() => (msg.hidden = true), 3500);
    }

    form.reset();
  });
}

// Renderiza a lista de alunos cadastrados, aplicando filtro se houver
function renderizarAlunos(filtro = '') {
  const lista = document.getElementById('listaAlunos');
  const contador = document.getElementById('contador');
  if (!lista || !contador) return;

  const termo = filtro.trim().toLowerCase();
  const filtrados = termo
    ? alunos.filter((a) => a.nome.toLowerCase().includes(termo))
    : alunos;

  contador.textContent = alunos.length;
  lista.innerHTML = '';

  if (filtrados.length === 0) {
    const li = document.createElement('li');
    li.className = 'vazio';
    li.textContent = alunos.length === 0
      ? 'Nenhum aluno cadastrado ainda.'
      : 'Nenhum aluno encontrado.';
    lista.appendChild(li);
    return;
  }

  filtrados.forEach((aluno) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="aluno-info">
        <strong>${aluno.nome}</strong>
        <small>${aluno.objetivo} • ${aluno.email}</small>
      </div>
      <button class="remover" aria-label="Remover" data-id="${aluno.id}">✕</button>
    `;
    lista.appendChild(li);
  });

  // Eventos de remover
  lista.querySelectorAll('.remover').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      alunos = alunos.filter((a) => a.id !== id);
      renderizarAlunos(document.getElementById('pesquisa')?.value || '');
    });
  });
}

/* ----------- Pesquisa em tempo real ----------- */
function inicializarPesquisa() {
  const input = document.getElementById('pesquisa');
  if (!input) return;
  // Evento de teclado: atualiza a lista conforme o usuário digita
  input.addEventListener('input', (e) => renderizarAlunos(e.target.value));
}

/* ----------- Formulário de Login ----------- */
function inicializarLogin() {
  const form = document.getElementById('formLogin');
  if (!form) return;

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    limparErros(form);

    const usuario = form.usuario.value.trim();
    const senha = form.senha.value.trim();
    const msg = document.getElementById('loginMsg');

    let valido = true;
    if (usuario.length < 3) {
      mostrarErro('usuario', 'Informe seu usuário ou e-mail.');
      valido = false;
    }
    if (senha.length < 4) {
      mostrarErro('senha', 'A senha deve ter pelo menos 4 caracteres.');
      valido = false;
    }
    if (!valido) return;

    if (msg) {
      msg.hidden = false;
      msg.textContent = `✅ Bem-vindo, ${usuario}! Login realizado com sucesso.`;
    }
    form.reset();
  });
}
