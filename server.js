
const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, JS, CSS)
app.use(express.static(path.join(__dirname)));

// Conexión a SQLite (usar disco persistente en Render)
const dbPath = process.env.DB_PATH || '/data/database.db';
const db = new Database(dbPath);

// Crear tabla si no existe
db.prepare(`CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  ciclo TEXT,
  grado TEXT,
  curso TEXT,
  hora TEXT
)`).run();

// ✅ Ruta para guardar reserva con validación
app.post('/reservar', (req, res) => {
  const { nombre, ciclo, grado, curso, hora } = req.body;

  if (!nombre || !ciclo || !grado || !curso || !hora) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Verificar si la hora ya está reservada
  const checkStmt = db.prepare(`SELECT COUNT(*) AS count FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ? AND hora = ?`);
  const result = checkStmt.get(ciclo, grado, curso, hora);

  if (result.count > 0) {
    return res.status(409).json({ error: 'La hora ya está reservada' });
  }

  // Insertar si está libre
  const stmt = db.prepare(`INSERT INTO reservas (nombre, ciclo, grado, curso, hora) VALUES (?, ?, ?, ?, ?)`);
  const info = stmt.run(nombre, ciclo, grado, curso, hora);

  res.json({ mensaje: 'Reserva guardada', id: info.lastInsertRowid });
});

// ✅ Ruta para consultar horas reservadas
app.get('/horas', (req, res) => {
  const { ciclo, grado, curso } = req.query;
  const stmt = db.prepare(`SELECT hora FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ?`);
  const rows = stmt.all(ciclo, grado, curso);

  res.json(rows.map(row => row.hora));
});

// ✅ Ruta opcional para ver todas las reservas
app.get('/reservas', (req, res) => {
  const rows = db.prepare(`SELECT * FROM reservas ORDER BY id DESC`).all();
  res.json(rows);
});


// Nueva ruta para listar todas las reservas
app.get('/reservas', (req, res) => {
  const rows = db.prepare('SELECT * FROM reservas').all();
  res.json(rows);
});


// Listar todas las reservas
app.get('/reservas', (req, res) => {
  const rows = db.prepare('SELECT * FROM reservas ORDER BY id DESC').all();
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
  const { nombre, ciclo, grado, curso, hora } = req.body;
  const stmt = db.prepare(`UPDATE reservas SET nombre = ?, ciclo = ?, grado = ?, curso = ?, hora = ? WHERE id = ?`);
  const info = stmt.run(nombre, ciclo, grado, curso, hora, id);
  res.json({ mensaje: 'Reserva actualizada', cambios: info.changes });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


