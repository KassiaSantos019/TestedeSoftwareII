function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validarNome(nome) {
    return nome.trim().length >= 3;
}

function validarSenha(senha) {
    return senha.length >= 6 && /\d/.test(senha);
}

function validarCPF(cpf) {
    const limpo = cpf.replace(/\D/g, '');
    return limpo.length === 11;
}

// Máscara de CPF
function mascaraCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    input.value = value;
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    if (tabName === 'cadastro') {
        document.getElementById('abaCadastro').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else if (tabName === 'login') {
        document.getElementById('abaLogin').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    } else if (tabName === 'perfil') {
        document.getElementById('abaPerfil').classList.add('active');
        document.getElementById('tabPerfil').classList.add('active');
    }
}

function mostrarMensagem(elId, msg, cor) {
    const el = document.getElementById(elId);
    el.textContent = msg;
    el.style.color = cor;
}

// Buscar Lista de Alunos do LocalStorage
function getAlunos() {
    return JSON.parse(localStorage.getItem("alunos") || "[]");
}

function cadastrar() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const cpf = document.getElementById("cpf");
    const senha = document.getElementById("senha");
    const confirmar = document.getElementById("confirmar");

    let valido = true;
    const inputs = [nome, email, cpf, senha, confirmar];
    inputs.forEach(i => i.classList.remove("erro", "sucesso"));

    if (!validarNome(nome.value)) {
        nome.classList.add("erro");
        valido = false;
    } else nome.classList.add("sucesso");

    if (!validarEmail(email.value)) {
        email.classList.add("erro");
        valido = false;
    } else email.classList.add("sucesso");

    if (!validarCPF(cpf.value)) {
        cpf.classList.add("erro");
        valido = false;
    } else cpf.classList.add("sucesso");

    if (!validarSenha(senha.value)) {
        senha.classList.add("erro");
        valido = false;
    } else senha.classList.add("sucesso");

    if (senha.value !== confirmar.value || confirmar.value === "") {
        confirmar.classList.add("erro");
        valido = false;
    } else confirmar.classList.add("sucesso");

    if (!valido) {
        mostrarMensagem("mensagem", "Preencha os campos corretamente!", "#e53e3e");
        return;
    }

    const alunos = getAlunos();
    
    // Verificar se email ou CPF já existem
    if (alunos.some(a => a.email === email.value)) {
        email.classList.add("erro");
        mostrarMensagem("mensagem", "Este e-mail já está cadastrado!", "#e53e3e");
        return;
    }

    if (alunos.some(a => a.cpf === cpf.value)) {
        cpf.classList.add("erro");
        mostrarMensagem("mensagem", "Este CPF já está cadastrado!", "#e53e3e");
        return;
    }

    const novoAluno = {
        id: Date.now(),
        nome: nome.value.trim(),
        email: email.value.trim(),
        cpf: cpf.value,
        senha: senha.value
    };

    alunos.push(novoAluno);
    localStorage.setItem("alunos", JSON.stringify(alunos));

    mostrarMensagem("mensagem", "✅ Cadastro realizado com sucesso!", "#38a169");

    document.getElementById("formCadastro").reset();
    inputs.forEach(i => i.classList.remove("sucesso"));

    setTimeout(() => {
        mostrarMensagem("mensagem", "", "");
        switchTab('login');
    }, 1500);
}

function fazerLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    const alunos = getAlunos();
    const alunoEncontrado = alunos.find(a => a.email === email && a.senha === senha);

    if (alunoEncontrado) {
        sessionStorage.setItem("alunoLogado", JSON.stringify(alunoEncontrado));
        mostrarMensagem("mensagemLogin", "✅ Login realizado! Entrando...", "#38a169");
        setTimeout(() => {
            mostrarMensagem("mensagemLogin", "", "");
        }, 1000);
    } else {
        mostrarMensagem("mensagemLogin", "E-mail ou senha incorretos!", "#e53e3e");
    }
}

console.assert(validarEmail("teste@gmail.com") === true, "Erro teste email");
console.assert(validarEmail("teste@") === false, "Erro teste email invalido");
console.assert(validarNome("Maria") === true, "Erro teste nome");
console.assert(validarNome("Jo") === false, "Erro teste nome curto");
console.assert(validarSenha("123456") === true, "Erro teste senha");
console.assert(validarSenha("abc") === false, "Erro teste senha sem numeros");
console.log("✅ Testes OK!");