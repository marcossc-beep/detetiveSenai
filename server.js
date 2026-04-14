import fastify from 'fastify';
import cors from '@fastify/cors';
import pg from 'pg';

const app = fastify({ logger: true });
const { Pool } = pg;

// Configuração do Postgres
const pool = new Pool({
  user: 'postgres', // substitua se o seu usuário for diferente
  host: 'localhost',
  database: 'detetive_senai',
  password: 'admin', // coloque sua senha do pgAdmin aqui
  port: 5432,
});

// Habilitar CORS
await app.register(cors, { origin: '*' });

// Rota: Listar todos os suspeitos
app.get('/suspeitos', async (request, reply) => {
  const result = await pool.query('SELECT id, nome, relacao, alibi_inicial FROM suspeitos');
  return result.rows;
});

// Rota: Detalhes de um suspeito (Interrogatório)
app.get('/suspeitos/:id', async (request, reply) => {
  const { id } = request.params;
  const result = await pool.query('SELECT * FROM suspeitos WHERE id = $1', [id]);
  if (result.rows.length === 0) return reply.status(404).send({ erro: "Suspeito não encontrado" });
  return result.rows[0];
});

// Rota: Listar evidências
app.get('/evidencias', async (request, reply) => {
  const result = await pool.query('SELECT * FROM evidencias');
  return result.rows;
});

// Rota: Acusação Final
app.post('/acusar', async (request, reply) => {
  const { suspeitoId } = request.body;
  
  const result = await pool.query('SELECT nome, is_culpado, nivel_tensao FROM suspeitos WHERE id = $1', [suspeitoId]);
  
  if (result.rows.length === 0) return reply.status(404).send({ mensagem: "Alvo não identificado." });

  const suspeito = result.rows[0];

  if (suspeito.is_culpado) {
    return { 
      sucesso: true, 
      mensagem: `Culpado capturado! ${suspeito.nome} confessou o crime após ser confrontado com os R$ 70 mil e a passagem de fuga.`
    };
  } else {
    return { 
      sucesso: false, 
      mensagem: `Acusação errada! ${suspeito.nome} é inocente. Tensão aumentou para nível ${suspeito.nivel_tensao}.`
    };
  }
});

// Iniciar servidor
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("🕵️ Servidor do Detetive rodando em http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();