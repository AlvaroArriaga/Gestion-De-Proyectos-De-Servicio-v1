-- =========================================================
-- SCRIPT DE BASE DE DATOS - GESTIÓN DE PROYECTOS DE SERVICIO
-- =========================================================

-- Crear tablas principales

-- TABLA: ESTUDIANTES
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE,
    carrera VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: ASESORES
CREATE TABLE IF NOT EXISTS asesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE,
    especialidad VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: ORGANIZACIONES
CREATE TABLE IF NOT EXISTS organizaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    contacto VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: PROYECTOS DE SERVICIO
CREATE TABLE IF NOT EXISTS proyectos_servicio (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    objetivo TEXT,
    generacion VARCHAR(10),
    estado VARCHAR(50) DEFAULT 'Pendiente',
    estudiante_id INTEGER REFERENCES estudiantes(id),
    asesor_id INTEGER REFERENCES asesores(id),
    organizacion_id INTEGER REFERENCES organizaciones(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: ACTIVIDADES
CREATE TABLE IF NOT EXISTS actividades (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos_servicio(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    fecha_limite DATE,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: AVANCES
CREATE TABLE IF NOT EXISTS avances (
    id SERIAL PRIMARY KEY,
    actividad_id INTEGER NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    evidencia_url VARCHAR(500),
    descripcion_avance TEXT,
    comentario_asesor TEXT,
    estado_avance VARCHAR(50) DEFAULT 'Pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREAR ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
CREATE INDEX IF NOT EXISTS idx_proyectos_generacion ON proyectos_servicio(generacion);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos_servicio(estado);
CREATE INDEX IF NOT EXISTS idx_actividades_proyecto ON actividades(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_actividades_estado ON actividades(estado);
CREATE INDEX IF NOT EXISTS idx_avances_actividad ON avances(actividad_id);

-- DATOS DE EJEMPLO (OPCIONAL)

-- Insertar estudiante ejemplo
INSERT INTO estudiantes (nombre, email, carrera) 
VALUES ('Juan Pérez', 'juan@email.com', 'Ingeniería en Sistemas') 
ON CONFLICT (email) DO NOTHING;

-- Insertar asesor ejemplo
INSERT INTO asesores (nombre, email, especialidad) 
VALUES ('Dr. Carlos López', 'carlos@email.com', 'Desarrollo de Software') 
ON CONFLICT (email) DO NOTHING;

-- Insertar organización ejemplo
INSERT INTO organizaciones (nombre, direccion, contacto) 
VALUES ('Fundación Comunitaria', 'Calle Principal 123', 'contacto@fundacion.org') 
ON CONFLICT DO NOTHING;

-- Consultas útiles para obtener información

-- Ver proyectos con información de participantes
SELECT 
    ps.id, ps.titulo, ps.objetivo, ps.generacion, ps.estado,
    e.nombre as estudiante, a.nombre as asesor, o.nombre as organizacion
FROM proyectos_servicio ps
LEFT JOIN estudiantes e ON ps.estudiante_id = e.id
LEFT JOIN asesores a ON ps.asesor_id = a.id
LEFT JOIN organizaciones o ON ps.organizacion_id = o.id
ORDER BY ps.fecha_creacion DESC;

-- Ver actividades con su estado de progreso
SELECT 
    ac.id, ac.descripcion, ac.fecha_limite, ac.estado,
    COUNT(av.id) as total_avances,
    ps.titulo as proyecto
FROM actividades ac
LEFT JOIN avances av ON ac.id = av.actividad_id
LEFT JOIN proyectos_servicio ps ON ac.proyecto_id = ps.id
GROUP BY ac.id, ps.titulo
ORDER BY ac.fecha_limite ASC;

-- Ver resumen de proyecto
SELECT 
    ps.id, ps.titulo, ps.estado,
    COUNT(ac.id) as total_actividades,
    SUM(CASE WHEN ac.estado = 'Completado' THEN 1 ELSE 0 END) as completadas,
    ROUND(100.0 * SUM(CASE WHEN ac.estado = 'Completado' THEN 1 ELSE 0 END) / NULLIF(COUNT(ac.id), 0), 2) as porcentaje_completo
FROM proyectos_servicio ps
LEFT JOIN actividades ac ON ps.id = ac.proyecto_id
GROUP BY ps.id, ps.titulo, ps.estado
ORDER BY ps.fecha_creacion DESC;
