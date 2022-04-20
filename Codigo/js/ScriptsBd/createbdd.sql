CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas` (
  `id_tarea` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `prioridad` varchar(45) DEFAULT NULL,
  `categoria` varchar(45) DEFAULT NULL,
  `id_usuario` int NOT NULL,
  `fechafin` date NOT NULL,
  `fechaini` date NOT NULL,
  `tipo` char(1) NOT NULL,
  PRIMARY KEY (`id_tarea`),
  KEY `fk_users_idx` (`id_usuario`),
  CONSTRAINT `fk_users` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas_manuales` (
  `id_recurrente` int NOT NULL AUTO_INCREMENT,
  `id_tarea` int NOT NULL,
  `hora_ini` varchar(20) DEFAULT NULL,
  `hora_fin` varchar(20) DEFAULT NULL,
  `recurrente` tinyint(1) DEFAULT NULL,
  `dias_recurrentes` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_recurrente`,`id_tarea`),
  KEY `fk_tareamanual_idx` (`id_tarea`),
  CONSTRAINT `fk_tareamanual` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas_organizadas` (
  `id_programada` int NOT NULL,
  `id_subtarea` int NOT NULL AUTO_INCREMENT,
  `hora_ini` datetime NOT NULL,
  `hora_fin` datetime NOT NULL,
  PRIMARY KEY (`id_subtarea`),
  KEY `FK_subprogram` (`id_programada`),
  CONSTRAINT `FK_subprogram` FOREIGN KEY (`id_programada`) REFERENCES `tareas` (`id_tarea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas_programadas` (
  `horas` int NOT NULL,
  `id_programada` int NOT NULL,
  `tipo` varchar(20) NOT NULL,
  PRIMARY KEY (`id_programada`),
  CONSTRAINT `tareas_programadas_ibfk_1` FOREIGN KEY (`id_programada`) REFERENCES `tareas` (`id_tarea`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci