const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dbPath = process.env.DB_PATH || '/data/database.db';
const db = new Database(dbPath);

// Crear tabla si no existe
db.prepare(`CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  ciclo TEXT,
  grado TEXT,
  curso TEXT,
  hora TEXT,
  modalidad TEXT
)`).run();

// Guardar nueva reserva
app.post('/reservar', (req, res) => {
  const { nombre, ciclo, grado, curso, hora, modalidad } = req.body;
  if (!nombre || !ciclo || !grado || !curso || !hora || !modalidad) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const checkStmt = db.prepare(`SELECT COUNT(*) AS count FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ? AND hora = ? AND modalidad = ?`);
  const result = checkStmt.get(ciclo, grado, curso, hora, modalidad);

  if (result.count > 0) {
    return res.status(409).json({ error: 'La hora ya está reservada en esa modalidad' });
  }

  const stmt = db.prepare(`INSERT INTO reservas (nombre, ciclo, grado, curso, hora, modalidad) VALUES (?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(nombre, ciclo, grado, curso, hora, modalidad);

  res.json({ mensaje: 'Reserva guardada', id: info.lastInsertRowid });
});

// Consultar horas reservadas
app.get('/horas', (req, res) => {
  const { ciclo, grado, curso } = req.query;
  const stmt = db.prepare(`SELECT hora FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ?`);
  const rows = stmt.all(ciclo, grado, curso);
  res.json(rows.map(row => row.hora));
});

// Ver todas las reservas
app.get('/reservas', (req, res) => {
  const rows = db.prepare(`SELECT * FROM reservas ORDER BY id DESC`).all();
  res.json(rows);
});

// Eliminar reserva
app.delete('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM reservas WHERE id = ?');
  const info = stmt.run(id);
  res.json({ mensaje: 'Reserva eliminada', cambios: info.changes });
});

// Editar reserva
app.put('/reservas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, ciclo, grado, curso, hora, modalidad } = req.body;
  const stmt = db.prepare(`UPDATE reservas SET nombre = ?, ciclo = ?, grado = ?, curso = ?, hora = ?, modalidad = ? WHERE id = ?`);
  const info = stmt.run(nombre, ciclo, grado, curso, hora, modalidad, id);
  res.json({ mensaje: 'Reserva actualizada', cambios: info.changes });
});


app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;
  if (usuario === 'Admin' && clave === 'Admin2410') {
    res.json({ acceso: true });
  } else {
    res.status(401).json({ acceso: false });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
