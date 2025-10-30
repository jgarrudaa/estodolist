// =============================================================
//  EsToDoList - Versão adaptada para o layout personalizado
//  Autor original: Prof. Rafael Ribas
//  Adaptação: João Guilherme (Front-end Clean Code)
//  Objetivo: Implementar as mesmas lógicas do modelo,
//             com compatibilidade total ao novo HTML.
// =============================================================

// -------------------------------
// 1. Selecionar os elementos da página
// -------------------------------
const campoNovaTarefa = document.getElementById('nova-tarefa')
const botaoAdicionar = document.getElementById('adicionar-tarefa')
const campoPesquisa = document.getElementById('search-tasks')
const containerFiltros = document.getElementById('filtros')
// const listaTarefas = document.getElementById('lista-tarefas')
let listaTarefas = document.getElementById('lista-tarefas')

// novos elementos para estatísticas/progresso
const circuloProgresso = document.getElementById('progresso-circle')
const textoProgresso = document.getElementById('porcentagem-text')
const totalCountEl = document.getElementById('total-count')
const pendentesCountEl = document.getElementById('pendentes-count')
const concluidasCountEl = document.getElementById('concluidas-count')

// Cria dinamicamente o contêiner de tarefas se não existir (garantia)
if (!listaTarefas) {
  const novoContainer = document.createElement('div')
  novoContainer.id = 'lista-tarefas'
  novoContainer.className = 'space-y-3 sm:space-y-4'
  document.querySelector('main').appendChild(novoContainer)
  listaTarefas = novoContainer
}

// Array principal que armazenará as tarefas
let tarefas = []

// -------------------------------
// 2. Carregar tarefas salvas no navegador (localStorage)
// -------------------------------
function carregarTarefasSalvas() {
  const tarefasSalvas = localStorage.getItem('tarefas')
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas)
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 3. Salvar as tarefas no navegador
// -------------------------------
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

// -------------------------------
// 4. Função para adicionar uma nova tarefa
// -------------------------------
function adicionarTarefa() {
  const texto = campoNovaTarefa.value.trim()

  if (texto === '') {
    alert('Digite uma tarefa antes de adicionar!')
    return
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  }

  tarefas.push(novaTarefa)
  salvarTarefas()
  exibirTarefas(tarefas)
  campoNovaTarefa.value = ''
}

// -------------------------------
// 5. Função para exibir as tarefas na tela
// -------------------------------
function exibirTarefas(listaParaMostrar) {
  listaTarefas.innerHTML = ''

  for (let tarefa of listaParaMostrar) {
    // Criação do container da tarefa
    const item = document.createElement('div')
    item.className =
      'rounded-lg shadow-md p-3 sm:p-4 flex items-center justify-between border-l-4 transition duration-200 ' +
      (tarefa.concluida
        ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500'
        : 'bg-white dark:bg-gray-800 border-transparent')

    // Checkbox para marcar como concluída
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = tarefa.concluida
    checkbox.className =
      'w-4 h-4 sm:w-5 sm:h-5 text-blue-500 rounded focus:ring-green-500'
    checkbox.onchange = function () {
      alternarConclusao(tarefa.id)
    }

    // Texto da tarefa
    const textoTarefa = document.createElement('span')
    textoTarefa.textContent = tarefa.texto
    textoTarefa.className =
      'flex-1 mx-2 sm:mx-4 text-sm ' +
      (tarefa.concluida
        ? 'line-through text-gray-400 dark:text-gray-500'
        : 'text-gray-800 dark:text-gray-200')

    // Botões de ação
    const botaoEditar = document.createElement('button')
    botaoEditar.className =
      'p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 flex-shrink-0'
    botaoEditar.innerHTML =
      '<i class="fas fa-edit text-yellow-500 hover:text-yellow-600 text-sm"></i>'
    botaoEditar.onclick = function () {
      editarTarefa(tarefa.id)
    }

    const botaoExcluir = document.createElement('button')
    botaoExcluir.className =
      'p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 flex-shrink-0'
    botaoExcluir.innerHTML =
      '<i class="fas fa-trash text-red-500 hover:text-red-600 text-sm"></i>'
    botaoExcluir.onclick = function () {
      excluirTarefa(tarefa.id)
    }

    // Montagem final
    item.appendChild(checkbox)
    item.appendChild(textoTarefa)
    item.appendChild(botaoEditar)
    item.appendChild(botaoExcluir)
    listaTarefas.appendChild(item)
  }

  // atualiza estatísticas e roda de progresso (usa o array completo de tarefas)
  atualizarEstatisticas()
}

// -------------------------------
// 6. Alternar entre concluída e ativa
// -------------------------------
function alternarConclusao(id) {
  for (let tarefa of tarefas) {
    if (tarefa.id === id) {
      tarefa.concluida = !tarefa.concluida
    }
  }
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 7. Editar o texto de uma tarefa
// -------------------------------
function editarTarefa(id) {
  const tarefaAtual = tarefas.find(t => t.id === id)
  if (!tarefaAtual) return

  // prompt com valor atual pré-preenchido
  const novaDescricao = prompt('Edite a tarefa:', tarefaAtual.texto)

  if (novaDescricao === null || novaDescricao.trim() === '') {
    return
  }

  tarefaAtual.texto = novaDescricao.trim()
  salvarTarefas()
  exibirTarefas(tarefas)
}

// -------------------------------
// 8. Excluir uma tarefa
// -------------------------------
function excluirTarefa(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir esta tarefa?')
  if (confirmar) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id)
    salvarTarefas()
    exibirTarefas(tarefas)
  }
}

// -------------------------------
// 9. Pesquisa de tarefas
// -------------------------------
function pesquisarTarefas() {
  const termo = campoPesquisa.value.toLowerCase()
  const filtradas = tarefas.filter(tarefa =>
    tarefa.texto.toLowerCase().includes(termo)
  )
  exibirTarefas(filtradas)
}

// -------------------------------
// 10. Filtros (Todas / Pendentes / Concluídas)
// -------------------------------
function aplicarFiltro(tipo) {
  let filtradas = []
  if (tipo === 'todas') {
    filtradas = tarefas
  } else if (tipo === 'pendentes') {
    filtradas = tarefas.filter(t => !t.concluida)
  } else if (tipo === 'concluidas') {
    filtradas = tarefas.filter(t => t.concluida)
  }
  exibirTarefas(filtradas)
}

// -------------------------------
// 11. Atualizar estilo visual dos botões de filtro
// -------------------------------
function atualizarBotoesFiltro(botaoAtivo) {
  const botoes = containerFiltros.querySelectorAll('button')
  botoes.forEach(btn => {
    btn.classList.remove('bg-blue-500', 'text-white')
    btn.classList.add(
      'bg-gray-300',
      'dark:bg-gray-600',
      'text-gray-700',
      'dark:text-gray-300'
    )
  })
  botaoAtivo.classList.remove(
    'bg-gray-300',
    'dark:bg-gray-600',
    'text-gray-700',
    'dark:text-gray-300'
  )
  botaoAtivo.classList.add('bg-blue-500', 'text-white')
}

// -------------------------------
// Estatísticas e Roda de Progresso
// -------------------------------
function atualizarEstatisticas() {
  const total = tarefas.length
  const concluidas = tarefas.filter(t => t.concluida).length
  const pendentes = total - concluidas

  if (totalCountEl) totalCountEl.textContent = total
  if (pendentesCountEl) pendentesCountEl.textContent = pendentes
  if (concluidasCountEl) concluidasCountEl.textContent = concluidas

  // atualizar círculo (SVG)
  if (circuloProgresso) {
    const raio = 20 // mesmo r do SVG
    const circunferencia = 2 * Math.PI * raio
    circuloProgresso.style.strokeDasharray = `${circunferencia}`
    const porcentagem = total > 0 ? (concluidas / total) : 0
    const offset = circunferencia - porcentagem * circunferencia
    circuloProgresso.style.strokeDashoffset = `${offset}`
  }

  if (textoProgresso) {
    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0
    textoProgresso.textContent = `${pct}%`
  }
}

// -------------------------------
// 12. Eventos de interação
// -------------------------------
botaoAdicionar.addEventListener('click', adicionarTarefa)
campoPesquisa.addEventListener('input', pesquisarTarefas)

// Filtros (baseados na ordem dos botões)
const botoesFiltro = containerFiltros.querySelectorAll('button')
botoesFiltro[0].addEventListener('click', () => {
  aplicarFiltro('todas')
  atualizarBotoesFiltro(botoesFiltro[0])
})
botoesFiltro[1].addEventListener('click', () => {
  aplicarFiltro('pendentes')
  atualizarBotoesFiltro(botoesFiltro[1])
})
botoesFiltro[2].addEventListener('click', () => {
  aplicarFiltro('concluidas')
  atualizarBotoesFiltro(botoesFiltro[2])
})

// -------------------------------
// 13. Adicionar tarefa com Enter
// -------------------------------
campoNovaTarefa.addEventListener('keydown', function (evento) {
  if (evento.key === 'Enter') {
    adicionarTarefa()
  }
})

// -------------------------------
// 14. Carregar tarefas salvas ao iniciar
// -------------------------------
window.onload = carregarTarefasSalvas
