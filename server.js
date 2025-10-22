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

// Ruta para guardar reserva
app.post('/reservar', (req, res) => {
  const { nombre, ciclo, grado, curso, hora } = req.body;
  if (!nombre || !ciclo || !grado || !curso || !hora) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const stmt = db.prepare(`INSERT INTO reservas (nombre, ciclo, grado, curso, hora) VALUES (?, ?, ?, ?, ?)`);
  const info = stmt.run(nombre, ciclo, grado, curso, hora);

  res.json({ mensaje: 'Reserva guardada', id: info.lastInsertRowid });
});

// Ruta para consultar horas reservadas
app.get('/horas', (req, res) => {
  const { ciclo, grado, curso } = req.query;
  const stmt = db.prepare(`SELECT hora FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ?`);
  const rows = stmt.all(ciclo, grado, curso);

  res.json(rows.map(row => row.hora));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
