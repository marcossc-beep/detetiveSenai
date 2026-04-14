import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

// Habilitar CORS para qualquer origem
await app.register(cors, {
    origin: '*'
});

// ==========================================
// ESTADO GLOBAL DO JOGO (Em Memória)
// ==========================================
let tempoRestante = 48;
let nosDesbloqueados = [];
let acoesDesbloqueadas = [];

// Constantes Iniciais para reset do jogo
const TEMPO_INICIAL = 48;
const NOS_INICIAIS = ['esposa_pamella', 'cameras_corredor', 'lista_telefonica'];
const ACOES_INICIAIS = ['interrogar_esposa_1', 'analisar_cameras_1', 'checar_ligacoes_1'];

const INTRODUCAO_CRIME = "Professor Frodo assassinado, sem sinais de luta, facada no coração. A arma ainda está fincada no peito. O crime ocorreu aparentemente no final da noite. Você tem 48 horas para investigar os suspeitos, coletar pistas e apontar o verdadeiro culpado.";

// ==========================================
// ESTRUTURA DE DADOS: ÁRVORE DE INVESTIGAÇÃO
// ==========================================
const nodosInvestigacao = [
    {
        id: 'esposa_pamella',
        tipo: 'suspeito',
        nome: 'Pamella Albuquerque (Esposa)',
        descricaoDaImagem: 'Mulher tensa com anel de casamento, aparentando cansaço e olhos vermelhos.',
        acoes: [
            {
                idAcao: 'interrogar_esposa_1',
                titulo: 'Interrogar sobre a noite do crime',
                custoTempo: 2,
                textoPista: 'Pamella chora e diz que Frodo estava estranho ultimamente. Revela que ele tinha uma aluna favorita com quem passava muito tempo. Ela diz que ficou em casa assistindo Netflix.',
                desbloqueiaNos: ['aluna_beatriz'],
                desbloqueiaAcoes: ['checar_alibi_esposa']
            },
            {
                idAcao: 'checar_alibi_esposa',
                titulo: 'Checar histórico da Netflix (Álibi)',
                custoTempo: 3,
                textoPista: 'O histórico da operadora e do roteador confirmam que a TV da sala de Pamella transmitiu a série até 00:30. O álibi parece sólido.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    },
    {
        id: 'cameras_corredor',
        tipo: 'local',
        nome: 'Câmeras do Corredor Norte',
        descricaoDaImagem: 'Monitor de segurança antigo, imagem granulada em preto e branco.',
        acoes: [
            {
                idAcao: 'analisar_cameras_1',
                titulo: 'Analisar fitas das 22h às 00h',
                custoTempo: 4,
                textoPista: 'A fita mostra o corredor vazio na maior parte do tempo. Porém, às 23h, o porteiro aparece fazendo a ronda, mas ele entra na sala do professor e demora 15 minutos para sair.',
                desbloqueiaNos: ['porteiro_valdir'],
                desbloqueiaAcoes: ['analisar_cameras_2']
            },
            {
                idAcao: 'analisar_cameras_2',
                titulo: 'Revisar câmeras de saída do prédio',
                custoTempo: 3,
                textoPista: 'Ninguém além do próprio quadro de funcionários entrou ou saiu do prédio pela porta da frente naquela noite.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    },
    {
        id: 'lista_telefonica',
        tipo: 'local',
        nome: 'Celular da Vítima (Registro)',
        descricaoDaImagem: 'Tela de smartphone trincada exibindo o log de chamadas recentes.',
        acoes: [
            {
                idAcao: 'checar_ligacoes_1',
                titulo: 'Checar últimas ligações',
                custoTempo: 2,
                textoPista: 'Existem 5 ligações perdidas de um contato salvo como "Ricardo (CEO Saneamento)". A última chamada atendida durou 10 minutos e foi com ele, em tom de discussão segundo os áudios do correio de voz.',
                desbloqueiaNos: ['ceo_ricardo'],
                desbloqueiaAcoes: ['rastrear_mensagens_apagadas']
            },
            {
                idAcao: 'rastrear_mensagens_apagadas',
                titulo: 'Recuperar SMS apagados',
                custoTempo: 5,
                textoPista: 'Recuperação revela uma mensagem de Frodo para um número desconhecido: "Não vou aceitar o suborno. O projeto vai a público".',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    },
    {
        id: 'aluna_beatriz',
        tipo: 'suspeito',
        nome: 'Beatriz Lovat (Aluna)',
        descricaoDaImagem: 'Jovem estudante universitária, olhar ríspido e defensivo, segurando livros.',
        acoes: [
            {
                idAcao: 'interrogar_aluna_1',
                titulo: 'Pressionar sobre o relacionamento com Frodo',
                custoTempo: 3,
                textoPista: 'Ela admite que eles tiveram um caso, mas terminaram mal. Ela estava em casa estudando para uma prova, e mandou foto dos cadernos para os amigos às 23h15.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: ['verificar_foto_aluna']
            },
            {
                idAcao: 'verificar_foto_aluna',
                titulo: 'Perícia na foto enviada (Metadados)',
                custoTempo: 4,
                textoPista: 'A análise da foto mostra que a iluminação (sombras projetadas) indica que foi tirada de dia, e não às 23h15. O álibi é frágil, mas o GPS aponta que ela estava na padaria ao lado da escola.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    },
    {
        id: 'ceo_ricardo',
        tipo: 'suspeito',
        nome: 'Ricardo Sterling (CEO)',
        descricaoDaImagem: 'Homem engravatado de meia idade, postura arrogante, usando um relógio caro.',
        acoes: [
            {
                idAcao: 'interrogar_ceo_1',
                titulo: 'Investigar sobre o projeto de Frodo',
                custoTempo: 4,
                textoPista: 'Ricardo ri e diz que Frodo era um idealista. O projeto do professor daria um prejuízo milionário para sua empresa de saneamento. Mas ele tem um álibi: estava jantando no restaurante Le Monde.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: ['quebra_sigilo_ceo']
            },
            {
                idAcao: 'quebra_sigilo_ceo',
                titulo: 'Solicitar Quebra de Sigilo Bancário',
                custoTempo: 8,
                textoPista: 'A quebra de sigilo revela um saque fracionado de R$ 70.000 em espécie dois dias antes do crime. O dinheiro não foi rastreado, cheira a pagamento de suborno ou assassino de aluguel.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    },
    {
        id: 'porteiro_valdir',
        tipo: 'suspeito',
        nome: 'Valdir Santos (Porteiro)',
        descricaoDaImagem: 'Homem simples em uniforme de zelador, olhar inquieto e suando frio.',
        acoes: [
            {
                idAcao: 'interrogar_porteiro_1',
                titulo: 'Pressionar sobre a ronda de 15 minutos na sala',
                custoTempo: 3,
                textoPista: 'Valdir gagueja. Diz que entrou para limpar uma garrafa de vinho que havia caído. Mas a perícia inicial relatou que os copos de vinho na mesa estavam intactos.',
                desbloqueiaNos: [],
                desbloqueiaAcoes: ['checar_contas_porteiro']
            },
            {
                idAcao: 'checar_contas_porteiro',
                titulo: 'Investigar finanças do Porteiro',
                custoTempo: 5,
                textoPista: 'A investigação revela que Valdir quitou uma dívida imensa com agiotas ontem de manhã, pagando tudo em dinheiro vivo (notas que totalizam R$ 70 mil).',
                desbloqueiaNos: [],
                desbloqueiaAcoes: []
            }
        ]
    }
];

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
// Retorna os nós e ações de forma filtrada (apenas o que o jogador já desbloqueou)
function obterEstadoFiltrado() {
    return nodosInvestigacao
        .filter(no => nosDesbloqueados.includes(no.id))
        .map(no => {
            return {
                ...no,
                acoes: no.acoes.filter(acao => acoesDesbloqueadas.includes(acao.idAcao))
            };
        });
}

// ==========================================
// ENDPOINTS DA API
// ==========================================

// 1. Iniciar Jogo
app.get('/start', async (request, reply) => {
    // Reseta o estado
    tempoRestante = TEMPO_INICIAL;
    nosDesbloqueados = [...NOS_INICIAIS];
    acoesDesbloqueadas = [...ACOES_INICIAIS];
    
    // Adiciona a primeira ação dos suspeitos desbloqueados inicialmente como precaução
    nodosInvestigacao.forEach(no => {
        if (nosDesbloqueados.includes(no.id) && no.acoes.length > 0) {
            if (!acoesDesbloqueadas.includes(no.acoes[0].idAcao)) {
                acoesDesbloqueadas.push(no.acoes[0].idAcao);
            }
        }
    });

    return reply.send({
        introducao: INTRODUCAO_CRIME,
        tempoRestante: tempoRestante,
        nos: obterEstadoFiltrado()
    });
});

// 2. Realizar Ação
app.post('/action', async (request, reply) => {
    const { idAcao, idNo } = request.body;

    if (!idAcao || !idNo) {
        return reply.status(400).send({ erro: "idAcao e idNo são obrigatórios." });
    }

    // Valida se o nó está desbloqueado
    if (!nosDesbloqueados.includes(idNo)) {
        return reply.status(403).send({ erro: "Este nó não está acessível no momento." });
    }

    // Busca o nó e a ação
    const no = nodosInvestigacao.find(n => n.id === idNo);
    const acao = no?.acoes.find(a => a.idAcao === idAcao);

    if (!acao) {
        return reply.status(404).send({ erro: "Ação não encontrada." });
    }

    // Verifica se a ação está desbloqueada
    if (!acoesDesbloqueadas.includes(idAcao)) {
        return reply.status(403).send({ erro: "Esta ação ainda não foi desbloqueada." });
    }

    // Verifica tempo
    if (tempoRestante < acao.custoTempo) {
        return reply.status(400).send({ 
            erro: "Tempo insuficiente para realizar esta ação.", 
            tempoRestante,
            gameover: tempoRestante === 0 
        });
    }

    // Processa a ação
    tempoRestante -= acao.custoTempo;

    // Desbloqueia novos nós (apenas se não estiverem na lista)
    acao.desbloqueiaNos.forEach(novoNo => {
        if (!nosDesbloqueados.includes(novoNo)) {
            nosDesbloqueados.push(novoNo);
            
            // Quando um nó é descoberto, libera automaticamente a primeira ação dele
            const infoNovoNo = nodosInvestigacao.find(n => n.id === novoNo);
            if (infoNovoNo && infoNovoNo.acoes.length > 0) {
                if (!acoesDesbloqueadas.includes(infoNovoNo.acoes[0].idAcao)) {
                    acoesDesbloqueadas.push(infoNovoNo.acoes[0].idAcao);
                }
            }
        }
    });

    // Desbloqueia novas ações
    acao.desbloqueiaAcoes.forEach(novaAcao => {
        if (!acoesDesbloqueadas.includes(novaAcao)) {
            acoesDesbloqueadas.push(novaAcao);
        }
    });

    return reply.send({
        textoPista: acao.textoPista,
        tempoGasto: acao.custoTempo,
        tempoRestante: tempoRestante,
        nos: obterEstadoFiltrado()
    });
});

// 3. Acusar Suspeito Final
app.post('/accuse', async (request, reply) => {
    const { idSuspeito } = request.body;

    if (!idSuspeito) {
        return reply.status(400).send({ erro: "ID do suspeito é obrigatório." });
    }

    if (idSuspeito === 'porteiro_valdir') {
        return reply.send({
            sucesso: true,
            mensagem: "VITÓRIA! Você conectou o dinheiro vivo do Porteiro à propina do CEO e desmontou o álibi da sala. Valdir confessou ter sido pago para cometer o crime. O Caso Frodo está encerrado!"
        });
    } else {
        return reply.send({
            sucesso: false,
            mensagem: "DERROTA! Você acusou a pessoa errada. Sem evidências suficientes, o verdadeiro assassino escapou e o caso foi arquivado por incompetência."
        });
    }
});

// Rota: Servir o Front-end (index.html)
app.get('/', async (request, reply) => {
  try {
    const filePath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    reply.type('text/html').send(html);
  } catch (error) {
    reply.status(500).send("Erro: Arquivo index.html não encontrado na mesma pasta do server.js.");
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log(`Servidor rodando em http://localhost:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();