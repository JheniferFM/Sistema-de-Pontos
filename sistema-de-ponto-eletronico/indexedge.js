// Seleciona os elementos do DOM para exibir a data, hora e dia da semana
const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const DialogdiaMesAno = document.getElementById("dialog-dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");
const DialogHoraMinSeg = document.getElementById("dialog-hora-min-seg");

// Array com os dias da semana em português
const arrayDayWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

// Seleciona outros elementos do DOM
const selecTiposPontos = document.getElementById("select-tipos-pontos");
const divAlerta = document.getElementById("div-alerta");

// Objeto que define a sequência dos pontos
let ProxPonto = {
    "Entrada": "intervalo",
    "intervalo": "Volta-intervalo",
    "Volta-intervalo": "Saída",
    "Saída": "Entrada"
};

// Seleciona o elemento do diálogo de ponto
const dialogPonto = document.getElementById("dialog-ponto");

// Coleta a localização do usuário usando a API de geolocalização
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
});

// Lógica do botão para abrir o diálogo de registro de ponto
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", () => {
   
    let dialogSelect = document.getElementById("select-tipos-pontos");
    let TipoUltimoPonto = localStorage.getItem("tipoUltimoPonto");
    console.log("Último tipo de ponto registrado:", TipoUltimoPonto);

    dialogSelect.value = ProxPonto[TipoUltimoPonto];
    console.log("Próximo tipo de ponto selecionado:", dialogSelect.value);
    dialogPonto.showModal();
});

// Lógica do botão para fechar o diálogo de registro de ponto
const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
});

// Função para recuperar os pontos salvos no localStorage
function recuperarPontosLocalStorage() {
    let TodosOsPontos = localStorage.getItem("registros");

    if (!TodosOsPontos) {
        return [];
    }

    return JSON.parse(TodosOsPontos);
}

// Função para salvar um novo registro de ponto no localStorage
function salvarRegistroLocalStorage(ponto) {
    let pontos = recuperarPontosLocalStorage();

    pontos.push(ponto);
    localStorage.setItem("registros", JSON.stringify(pontos));
}

// Evento para registrar o ponto
const btnDialogRegistrarPonto = document.getElementById("btn-dialog-registrar-ponto");
btnDialogRegistrarPonto.addEventListener("click", () => {
    let data = dataCompleta();
    let hora = horaCompleta();
    let tipoPonto = document.getElementById("select-tipos-pontos").value;

    let ponto = {
        "data": data,
        "hora": hora,
        "tipo": tipoPonto,
        "Id": Date.now() // Usar timestamp como ID único
    };

    salvarRegistroLocalStorage(ponto);
    localStorage.setItem("tipoUltimoPonto", tipoPonto);

    console.log(ponto);

    // Exibe uma mensagem de alerta informando que o ponto foi registrado
    divAlerta.classList.remove("hidden");
    divAlerta.classList.add("show");

    const AlertaTexto = document.getElementById("alerta-texto");
    AlertaTexto.textContent = "Ponto Registrado como: " + tipoPonto + " " + hora;

    // Oculta a mensagem de alerta após 5 segundos
    setTimeout(() => {
        divAlerta.classList.remove("show");
        divAlerta.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
    exibirDadosLocalStorage(); // Atualiza a lista de registros
});

// Função para obter o dia da semana atual
function daySemana() {
    const date = new Date();
    return arrayDayWeek[date.getDay()];
}

// Função para obter a data completa no formato DD/MM/AAAA
function dataCompleta() {
    const date = new Date();
    return String(date.getDate()).padStart(2, '0') + "/" + String((date.getMonth() + 1)).padStart(2, '0') + "/" + date.getFullYear();
}

// Função para obter a hora completa no formato HH:MM:SS
function horaCompleta() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

// Função para atualizar a hora exibida na página
function atualizaHora() {
    horaMinSeg.textContent = horaCompleta();
    DialogHoraMinSeg.textContent = horaCompleta();
}

// Atualiza a hora imediatamente e a cada segundo
atualizaHora();
setInterval(atualizaHora, 1000);

// Define o dia da semana e a data atual nos elementos correspondentes
diaSemana.textContent = daySemana();
diaMesAno.textContent = dataCompleta();
DialogdiaMesAno.textContent = dataCompleta();

// Função para exibir os dados salvos no localStorage
function exibirDadosLocalStorage() {
    const registros = recuperarPontosLocalStorage();
    const listaRegistros = document.getElementById("lista-registros");

    listaRegistros.innerHTML = ""; // Limpa a lista antes de adicionar os itens

    registros.forEach((ponto, index) => {
        const item = document.createElement("li");
        item.textContent = `ID: ${ponto.Id}, Data: ${ponto.data}, Hora: ${ponto.hora}, Tipo: ${ponto.tipo}`;

        // Botão de editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => {
            editarRegistro(ponto.Id);
        });

        item.appendChild(btnEditar);
        listaRegistros.appendChild(item);
    });
}

// Função para editar um registro
function editarRegistro(id) {
    const registros = recuperarPontosLocalStorage();
    const registro = registros.find(ponto => ponto.Id === id);

    if (registro) {
        const novoTipo = prompt("Digite o novo tipo de ponto:", registro.tipo);
        if (novoTipo) {
            registro.tipo = novoTipo;
            localStorage.setItem("registros", JSON.stringify(registros));
            exibirDadosLocalStorage(); // Atualiza a lista de registros
        }
    }
}

// Chama a função para exibir os dados ao carregar a página
document.addEventListener("DOMContentLoaded", exibirDadosLocalStorage);




// Função para exibir dados do localStorage
function exibirDadosLocalStorage() {
    const registros = recuperarPontosLocalStorage();
    const listaRegistros = document.getElementById("lista-registros");

    listaRegistros.innerHTML = ""; // Limpa a lista antes de adicionar os itens

    // Inverte a ordem dos registros para mostrar os mais recentes primeiro
    registros.reverse().forEach((ponto, index) => {
        const item = document.createElement("li");
        item.textContent = `ID: ${ponto.Id}, Data: ${ponto.data}, Hora: ${ponto.hora}, Tipo: ${ponto.tipo}`;

        // Botão de editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => {
            editarRegistro(ponto.Id);
        });

        item.appendChild(btnEditar);
        listaRegistros.appendChild(item);
    });
}
