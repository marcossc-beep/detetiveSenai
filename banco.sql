-- Criação das Tabelas
CREATE TABLE suspeitos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    relacao VARCHAR(100),
    motivacao TEXT,
    alibi_inicial TEXT,
    segredo_obscuro TEXT,
    tom_voz VARCHAR(100),
    nivel_tensao VARCHAR(20),
    is_culpado BOOLEAN DEFAULT false
);

CREATE TABLE evidencias (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50), -- 'bancaria', 'forense', 'cftv'
    descricao TEXT,
    detalhe_oculto TEXT
);

-- Inserção dos Suspeitos [cite: 177-216]
INSERT INTO suspeitos (nome, relacao, motivacao, alibi_inicial, segredo_obscuro, tom_voz, nivel_tensao, is_culpado) VALUES
('Pamella Albuquerque', 'Esposa', 'Seguro de vida e traição.', 'Assistindo Netflix até 00:30.', 'Seguiu o marido via rastreador.', 'Melancólico/Defensivo', 'Média', false),
('Ricardo Ric Sterling', 'CEO Saneamento', 'Projeto do Prof. Frodo daria prejuízo milionário.', 'Jantar no Le Monde.', 'Pagou R$ 70 mil ao porteiro (Mandante).', 'Arrogante', 'Crítica', false),
('Valdir Dão Santos', 'Porteiro', 'Dívidas com agiotas.', 'Ronda perimetral na escola.', 'Dopou o professor e desferiu a facada.', 'Servil/Inquieto', 'Baixa', true),
('Arthur Menezes', 'Melhor Amigo', 'Inveja acadêmica (Falsa).', 'Bebendo vinho com Frodo até 23h.', 'Apagão alcoólico na noite do crime.', 'Confuso', 'Média', false),
('Beatriz Bia Lovat', 'Aluna', 'Briga por não assumir romance.', 'Estudando na kitnet.', 'Estava grávida de Frodo.', 'Ríspido/Sarcástico', 'Alta', false),
('Joseilson Jojo', 'Monitor', 'Nenhuma (Testemunha).', 'Dormindo na manutenção.', 'Ouviu a briga mas se escondeu.', 'Ansioso', 'Baixa', false);

-- Inserção de Evidências [cite: 29, 33, 253, 256]
INSERT INTO evidencias (tipo, descricao, detalhe_oculto) VALUES
('bancaria', 'Extrato CEO: Saída de R$ 70.000 fracionada para offshore SGH Global.', 'O nome SGH Global é uma fachada para suborno.'),
('bancaria', 'Extrato Porteiro: Depósito de R$ 70.000 em espécie e compra de passagem só de ida.', 'Tentativa de fuga para país sem extradição.'),
('forense', 'Relatório Legista: Presença de sedativos no sangue e facada fatal.', 'O ângulo da facada não condiz com a altura do Melhor Amigo.'),
('cftv', 'Câmeras: O Melhor Amigo sai às 23:10, o Porteiro entra na sala às 23:30.', 'O Porteiro forjou as digitais do amigo na faca.');