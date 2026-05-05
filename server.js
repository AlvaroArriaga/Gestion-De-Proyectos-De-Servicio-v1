const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Programacion Web',
    password: 'DS-p4tty$_mp',
    port: 5432,
});

// ========================================
// RUTAS DE PROYECTOS DE SERVICIO
// ========================================

// Crear nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
    const { titulo, objetivo, generacion, estado, estudiante_id, asesor_id, organizacion_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO proyectos_servicio (titulo, objetivo, generacion, estado, estudiante_id, asesor_id, organizacion_id, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
            [titulo, objetivo, generacion, estado || 'Pendiente', estudiante_id, asesor_id, organizacion_id]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        console.error('Error:', err);
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proyectos_servicio ORDER BY fecha_creacion DESC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener proyecto por ID
app.get('/api/proyectos/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proyectos_servicio WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener proyectos por generación
app.get('/api/proyectos/generacion/:gen', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM proyectos_servicio WHERE generacion = $1 ORDER BY fecha_creacion DESC', 
            [req.params.gen]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Actualizar proyecto
app.put('/api/proyectos/:id', async (req, res) => {
    const { titulo, objetivo, estado } = req.body;
    try {
        const result = await pool.query(
            'UPDATE proyectos_servicio SET titulo=$1, objetivo=$2, estado=$3 WHERE id=$4 RETURNING *',
            [titulo, objetivo, estado, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Eliminar proyecto
app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM proyectos_servicio WHERE id = $1', [req.params.id]);
        res.json({ message: 'Proyecto eliminado' });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE ACTIVIDADES
// ========================================

// Crear nueva actividad
app.post('/api/actividades', async (req, res) => {
    const { proyecto_id, descripcion, fecha_limite, estado } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO actividades (proyecto_id, descripcion, fecha_limite, estado, fecha_creacion) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [proyecto_id, descripcion, fecha_limite, estado || 'Pendiente']
        );
        res.json(result.rows[0]);
    } catch (err) { 
        console.error('Error:', err);
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener actividades por proyecto
app.get('/api/actividades/:proyecto_id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM actividades WHERE proyecto_id = $1 ORDER BY fecha_limite ASC',
            [req.params.proyecto_id]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener actividad por ID
app.get('/api/actividades/detalle/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM actividades WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Actualizar actividad
app.put('/api/actividades/:id', async (req, res) => {
    const { descripcion, fecha_limite, estado } = req.body;
    try {
        const result = await pool.query(
            'UPDATE actividades SET descripcion=$1, fecha_limite=$2, estado=$3 WHERE id=$4 RETURNING *',
            [descripcion, fecha_limite, estado, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Eliminar actividad
app.delete('/api/actividades/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM actividades WHERE id = $1', [req.params.id]);
        res.json({ message: 'Actividad eliminada' });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE AVANCES
// ========================================

// Registrar avance
app.post('/api/avances', async (req, res) => {
    const { actividad_id, evidencia_url, descripcion_avance, comentario_asesor, estado_avance } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO avances (actividad_id, evidencia_url, descripcion_avance, comentario_asesor, estado_avance, fecha_registro) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [actividad_id, evidencia_url, descripcion_avance, comentario_asesor, estado_avance]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        console.error('Error:', err);
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener avances por actividad
app.get('/api/avances/actividad/:actividad_id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM avances WHERE actividad_id = $1 ORDER BY fecha_registro DESC',
            [req.params.actividad_id]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener todos los avances
app.get('/api/avances', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM avances ORDER BY fecha_registro DESC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Actualizar avance
app.put('/api/avances/:id', async (req, res) => {
    const { descripcion_avance, comentario_asesor, estado_avance } = req.body;
    try {
        const result = await pool.query(
            'UPDATE avances SET descripcion_avance=$1, comentario_asesor=$2, estado_avance=$3 WHERE id=$4 RETURNING *',
            [descripcion_avance, comentario_asesor, estado_avance, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE ESTUDIANTES
// ========================================

// Registrar/crear estudiante
app.post('/api/estudiantes', async (req, res) => {
    const { nombre, email, carrera } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO estudiantes (nombre, email, carrera, fecha_registro) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [nombre, email, carrera]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener estudiantes
app.get('/api/estudiantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE ASESORES
// ========================================

// Registrar/crear asesor
app.post('/api/asesores', async (req, res) => {
    const { nombre, email, especialidad } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO asesores (nombre, email, especialidad, fecha_registro) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [nombre, email, especialidad]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener asesores
app.get('/api/asesores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM asesores');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE ORGANIZACIONES
// ========================================

// Registrar/crear organización
app.post('/api/organizaciones', async (req, res) => {
    const { nombre, direccion, contacto } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO organizaciones (nombre, direccion, contacto, fecha_registro) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [nombre, direccion, contacto]
        );
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Obtener organizaciones
app.get('/api/organizaciones', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM organizaciones');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE ESTADO DEL PROYECTO
// ========================================

// Consultar estado del proyecto (con agregados)
app.get('/api/estado/:proyecto_id', async (req, res) => {
    try {
        const proyecto = await pool.query('SELECT * FROM proyectos_servicio WHERE id = $1', [req.params.proyecto_id]);
        const actividades = await pool.query('SELECT * FROM actividades WHERE proyecto_id = $1', [req.params.proyecto_id]);
        const avances = await pool.query(
            'SELECT a.* FROM avances a INNER JOIN actividades ac ON a.actividad_id = ac.id WHERE ac.proyecto_id = $1',
            [req.params.proyecto_id]
        );

        const totalActividades = actividades.rows.length;
        const actividadesCompletadas = actividades.rows.filter(a => a.estado === 'Completado').length;
        const porcentajeCompleto = totalActividades > 0 ? Math.round((actividadesCompletadas / totalActividades) * 100) : 0;

        res.json({
            proyecto: proyecto.rows[0],
            totalActividades,
            actividadesCompletadas,
            porcentajeCompleto,
            totalAvances: avances.rows.length,
            estado: proyecto.rows[0]?.estado || 'Desconocido'
        });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// RUTAS DE REPORTES
// ========================================

// Generar reporte por generación
app.get('/api/reportes/generacion/:gen', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                ps.*, 
                COUNT(a.id) as total_actividades,
                SUM(CASE WHEN a.estado = 'Completado' THEN 1 ELSE 0 END) as actividades_completadas
            FROM proyectos_servicio ps
            LEFT JOIN actividades a ON ps.id = a.proyecto_id
            WHERE ps.generacion = $1
            GROUP BY ps.id
            ORDER BY ps.fecha_creacion DESC`,
            [req.params.gen]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// Generar reporte general
app.get('/api/reportes/general', async (req, res) => {
    try {
        const proyectos = await pool.query('SELECT COUNT(*) FROM proyectos_servicio');
        const completados = await pool.query("SELECT COUNT(*) FROM proyectos_servicio WHERE estado = 'Completado'");
        const enProgreso = await pool.query("SELECT COUNT(*) FROM proyectos_servicio WHERE estado = 'En Progreso'");
        const actividades = await pool.query('SELECT COUNT(*) FROM actividades');
        const avances = await pool.query('SELECT COUNT(*) FROM avances');

        res.json({
            totalProyectos: parseInt(proyectos.rows[0].count),
            completados: parseInt(completados.rows[0].count),
            enProgreso: parseInt(enProgreso.rows[0].count),
            totalActividades: parseInt(actividades.rows[0].count),
            totalAvances: parseInt(avances.rows[0].count)
        });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ========================================
// HEALTHCHECK
// ========================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(3000, () => {
    console.log('🚀 Servidor listo en http://localhost:3000');
    console.log('📊 API de Proyectos de Servicio activada');
});