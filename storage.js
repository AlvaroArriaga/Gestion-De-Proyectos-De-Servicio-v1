const STORAGE_KEYS = {
  proyectos: 'proyectos',
  actividades: 'actividades',
  avances: 'avances',
  usuarios: 'usuarios',
  asesores: 'asesores',
  organizaciones: 'organizaciones'
};

function leerStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function guardarStorage(key, datos) {
  localStorage.setItem(key, JSON.stringify(datos));
}

function generarId(key) {
  const items = leerStorage(key).map(item => parseInt(item.id, 10)).filter(Number.isFinite);
  return items.length ? Math.max(...items) + 1 : 1;
}

function inicializarStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (!localStorage.getItem(key)) {
      guardarStorage(key, []);
    }
  });
}

function obtenerProyectos() {
  return leerStorage(STORAGE_KEYS.proyectos);
}

function guardarProyecto(proyecto) {
  const proyectos = obtenerProyectos();
  const proyectoActual = {
    ...proyecto,
    estudiante_id: proyecto.estudiante_id ? parseInt(proyecto.estudiante_id, 10) : null,
    asesor_id: proyecto.asesor_id ? parseInt(proyecto.asesor_id, 10) : null,
    organizacion_id: proyecto.organizacion_id ? parseInt(proyecto.organizacion_id, 10) : null
  };

  if (proyectoActual.id) {
    const index = proyectos.findIndex(p => p.id === proyectoActual.id);
    if (index >= 0) {
      proyectos[index] = { ...proyectos[index], ...proyectoActual };
    }
  } else {
    proyectoActual.id = generarId(STORAGE_KEYS.proyectos);
    proyectoActual.fecha_creacion = new Date().toISOString();
    proyectos.push(proyectoActual);
  }

  guardarStorage(STORAGE_KEYS.proyectos, proyectos);
  return proyectoActual;
}

function eliminarProyecto(id) {
  const proyectos = obtenerProyectos().filter(p => p.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.proyectos, proyectos);
  eliminarActividadesPorProyecto(id);
  return proyectos;
}

function obtenerActividades(proyectoId) {
  return leerStorage(STORAGE_KEYS.actividades).filter(a => a.proyecto_id === parseInt(proyectoId, 10));
}

function obtenerActividad(id) {
  return leerStorage(STORAGE_KEYS.actividades).find(a => a.id === parseInt(id, 10));
}

function guardarActividad(actividad) {
  const actividades = leerStorage(STORAGE_KEYS.actividades);
  const actividadActual = {
    ...actividad,
    proyecto_id: parseInt(actividad.proyecto_id, 10)
  };

  if (actividadActual.id) {
    const index = actividades.findIndex(a => a.id === actividadActual.id);
    if (index >= 0) {
      actividades[index] = { ...actividades[index], ...actividadActual };
    }
  } else {
    actividadActual.id = generarId(STORAGE_KEYS.actividades);
    actividadActual.fecha_creacion = new Date().toISOString();
    actividades.push(actividadActual);
  }

  guardarStorage(STORAGE_KEYS.actividades, actividades);
  return actividadActual;
}

function eliminarActividad(id) {
  const actividades = leerStorage(STORAGE_KEYS.actividades).filter(a => a.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.actividades, actividades);
  eliminarAvancesPorActividad(id);
  return actividades;
}

function eliminarActividadesPorProyecto(proyectoId) {
  const actividades = leerStorage(STORAGE_KEYS.actividades).filter(a => a.proyecto_id !== parseInt(proyectoId, 10));
  guardarStorage(STORAGE_KEYS.actividades, actividades);
  eliminarAvancesPorActividadIds(actividades.map(a => a.id));
}

function obtenerAvances(actividadId) {
  return leerStorage(STORAGE_KEYS.avances).filter(a => a.actividad_id === parseInt(actividadId, 10));
}

function guardarAvance(avance) {
  const avances = leerStorage(STORAGE_KEYS.avances);
  const avanceActual = {
    ...avance,
    actividad_id: parseInt(avance.actividad_id, 10)
  };

  if (avanceActual.id) {
    const index = avances.findIndex(a => a.id === avanceActual.id);
    if (index >= 0) {
      avances[index] = { ...avances[index], ...avanceActual };
    }
  } else {
    avanceActual.id = generarId(STORAGE_KEYS.avances);
    avanceActual.fecha_registro = avanceActual.fecha_registro || new Date().toISOString();
    avances.push(avanceActual);
  }

  guardarStorage(STORAGE_KEYS.avances, avances);
  return avanceActual;
}

function eliminarAvance(id) {
  const avances = leerStorage(STORAGE_KEYS.avances).filter(a => a.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.avances, avances);
  return avances;
}

function eliminarAvancesPorActividad(actividadId) {
  const avances = leerStorage(STORAGE_KEYS.avances).filter(a => a.actividad_id !== parseInt(actividadId, 10));
  guardarStorage(STORAGE_KEYS.avances, avances);
}

function eliminarAvancesPorActividadIds(actividadIds) {
  const avances = leerStorage(STORAGE_KEYS.avances).filter(a => !actividadIds.includes(a.actividad_id));
  guardarStorage(STORAGE_KEYS.avances, avances);
}

function obtenerUsuarios() {
  return leerStorage(STORAGE_KEYS.usuarios);
}

function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  const usuarioActual = { ...usuario };

  if (usuarioActual.id) {
    const index = usuarios.findIndex(u => u.id === usuarioActual.id);
    if (index >= 0) {
      usuarios[index] = { ...usuarios[index], ...usuarioActual };
    }
  } else {
    usuarioActual.id = generarId(STORAGE_KEYS.usuarios);
    usuarios.push(usuarioActual);
  }

  guardarStorage(STORAGE_KEYS.usuarios, usuarios);
  return usuarioActual;
}

function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios().filter(u => u.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.usuarios, usuarios);
  return usuarios;
}

function obtenerAsesores() {
  return leerStorage(STORAGE_KEYS.asesores);
}

function guardarAsesor(asesor) {
  const asesores = obtenerAsesores();
  const asesorActual = { ...asesor };

  if (asesorActual.id) {
    const index = asesores.findIndex(a => a.id === asesorActual.id);
    if (index >= 0) {
      asesores[index] = { ...asesores[index], ...asesorActual };
    }
  } else {
    asesorActual.id = generarId(STORAGE_KEYS.asesores);
    asesores.push(asesorActual);
  }

  guardarStorage(STORAGE_KEYS.asesores, asesores);
  return asesorActual;
}

function eliminarAsesor(id) {
  const asesores = obtenerAsesores().filter(a => a.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.asesores, asesores);
  return asesores;
}

function obtenerOrganizaciones() {
  return leerStorage(STORAGE_KEYS.organizaciones);
}

function guardarOrganizacion(organizacion) {
  const organizaciones = obtenerOrganizaciones();
  const organizacionActual = { ...organizacion };

  if (organizacionActual.id) {
    const index = organizaciones.findIndex(o => o.id === organizacionActual.id);
    if (index >= 0) {
      organizaciones[index] = { ...organizaciones[index], ...organizacionActual };
    }
  } else {
    organizacionActual.id = generarId(STORAGE_KEYS.organizaciones);
    organizaciones.push(organizacionActual);
  }

  guardarStorage(STORAGE_KEYS.organizaciones, organizaciones);
  return organizacionActual;
}

function eliminarOrganizacion(id) {
  const organizaciones = obtenerOrganizaciones().filter(o => o.id !== parseInt(id, 10));
  guardarStorage(STORAGE_KEYS.organizaciones, organizaciones);
  return organizaciones;
}

function obtenerNombreEntidad(key, id) {
  const lista = leerStorage(key);
  const item = lista.find(elemento => elemento.id === parseInt(id, 10));
  return item ? item.nombre : 'N/A';
}

function buscarEntidadPorId(key, id) {
  return leerStorage(key).find(elemento => elemento.id === parseInt(id, 10));
}

inicializarStorage();
