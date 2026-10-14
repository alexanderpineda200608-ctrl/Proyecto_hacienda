const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proyecto_hacienda',
  password: '1234',
  port: 5432,
});

app.get('/api/animales', async (req,res)=>{
  try{
    const r = await pool.query('SELECT * FROM animales ORDER BY id DESC');
    res.json(r.rows);
  }catch(e){
    console.log(e);
    res.status(500).json({error: e.message});
  }
});

app.post('/api/animales', async (req,res)=>{
  try{
    const {arete, raza, peso, estado} = req.body;
    const r = await pool.query(
      "INSERT INTO animales (arete, raza, peso, estado) VALUES ($1,$2,$3,$4) RETURNING *",
      [arete, raza, peso, estado || 'Activo']
    );
    res.json(r.rows[0]);
  }catch(e){
    console.log("Error PG:", e.message);
    res.status(400).json({error: e.message});
  }
});

app.delete('/api/animales/:id', async(req,res)=>{
  try{
    await pool.query('DELETE FROM animales WHERE id=$1',[req.params.id]);
    res.json({ok:true});
  }catch(e){ res.status(500).json({error: e.message}) }
});

app.get('/api/compradores', async(req,res)=>{
  const r = await pool.query('SELECT * FROM compradores ORDER BY id DESC');
  res.json(r.rows);
});

app.post('/api/compradores', async(req,res)=>{
  const {nombre, cedula, telefono, arete, precio} = req.body;
  const r = await pool.query('INSERT INTO compradores (nombre, cedula, telefono, arete, precio) VALUES ($1,$2,$3,$4,$5) RETURNING *',[nombre, cedula, telefono, arete, precio]);
  res.json(r.rows[0]);
});

app.delete('/api/compradores/:id', async(req,res)=>{
  await pool.query('DELETE FROM compradores WHERE id=$1',[req.params.id]);
  res.json({ok:true});
});

app.listen(3000, ()=>console.log('Servidor en http://localhost:3000'));