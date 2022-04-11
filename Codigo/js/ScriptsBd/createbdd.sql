CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `prioridad` varchar(45) DEFAULT NULL,
  `categoria` varchar(45) DEFAULT NULL,
  `usuario` int NOT NULL,
  `fechafin` date DEFAULT NULL,
  `fechaini` date DEFAULT NULL,
  `tipo` char(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_idx` (`usuario`),
  CONSTRAINT `fk_users` FOREIGN KEY (`usuario`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas_manuales` (
  `id_recurrente` int NOT NULL AUTO_INCREMENT,
  `id_tarea` int NOT NULL,
  `hora_ini` varchar(20) DEFAULT NULL,
  `hora_fin` varchar(20) DEFAULT NULL,
  `recurrente` tinyint(1) DEFAULT NULL,
  `dias_recurrentes` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id_recurrente`,`id_tarea`),
  KEY `fk_tareamanual_idx` (`id_tarea`),
  CONSTRAINT `fk_tareamanual` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `tareas_programadas` (
  `horas` int NOT NULL,
  `id` int NOT NULL,
  `tipo` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `tareas_programadas_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

