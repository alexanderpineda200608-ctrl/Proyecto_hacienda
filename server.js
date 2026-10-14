const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proyecto_hacienda',
  password: '1234', // tu clave de postgres
  port: 5432,
});

// ========== GANADO ==========
app.get('/api/ganado', async (req,res)=>{
  const r = await pool.query("SELECT * FROM animales ORDER BY id DESC");
  res.json(r.rows);
});
app.post('/api/ganado', async (req,res)=>{
  const {arete, raza, peso, estado} = req.body;
  const r = await pool.query(
    "INSERT INTO animales (arete, raza, peso, estado) VALUES ($1,$2,$3,$4) RETURNING *",
    [arete, raza, peso, estado]
  );
  res.json(r.rows[0]);
});
app.delete('/api/ganado/:id', async (req,res)=>{
  await pool.query("DELETE FROM animales WHERE id=$1",[req.params.id]);
  res.json({ok:true});
});

// ========== COMPRADORES - 5 CAMPOS DE TU FOTO ==========
app.get('/api/compradores', async (req,res)=>{
  try{
    const r = await pool.query("SELECT * FROM compradores ORDER BY id DESC");
    res.json(r.rows);
  }catch(e){ res.json([]); }
});

app.post('/api/compradores', async (req,res)=>{
  const {nombre, cedula, telefono, arete, precio} = req.body;
  console.log("Compra:", nombre, cedula, arete, precio);
  try{
    const r = await pool.query(
      "INSERT INTO compradores (nombre, cedula, telefono, arete, precio) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [nombre, cedula, telefono, arete, precio]
    );
    res.json(r.rows[0]);
  }catch(e){
    console.error("ERROR COMPRADORES:", e.message);
    res.status(500).json({error:e.message});
  }
});

app.delete('/api/compradores/:id', async (req,res)=>{
  await pool.query("DELETE FROM compradores WHERE id=$1",[req.params.id]);
  res.json({ok:true});
});

app.listen(3000, ()=>console.log('FINCA CHINCHIPE OK en http://localhost:3000'));