

/*truncate table tareas cascade; #No deja truncar tareas por la foranea de tareas programadas, NO SÉ PORQUÉ
truncate table users;*/
 

#usuarios
INSERT INTO users(id, username,email,password) values (1, 'userPrueba1','userPrueba1@email.com','1234'); #Todas las combinaciones
INSERT INTO users(id, username,email,password) values (2, 'userPrueba2','userPrueba2@email.com','1234'); #Solo programadas
INSERT INTO users(id, username,email,password) values (3, 'userPrueba3','userPrueba3@email.com','1234'); #Sin Tareas
INSERT INTO users(id, username,email,password) values (4, 'userPrueba4','userPrueba4@email.com','1234'); #Sin Tareas
INSERT INTO users(id, username,email,password) values (5, 'userPrueba5','userPrueba5@email.com','1234'); #Solo programadas
INSERT INTO users(id, username,email,password) values (6, 'userPrueba6','userPrueba6@email.com','1234'); #Sin Manual
INSERT INTO users(id, username,email,password) values (7, 'userPrueba7','userPrueba7@email.com','1234'); #Sin Manual
INSERT INTO users(id, username,email,password) values (8, 'userPrueba8','userPrueba8@email.com','1234'); #Sin Tareas
INSERT INTO users(id, username,email,password) values (9, 'userPrueba9','userPrueba9@email.com','1234');
INSERT INTO users(id, username,email,password) values (10, 'userPrueba10','userPrueb10@email.com','1234');
 
 
 
#tareas tabla padre
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(1, 'Proyecto TP','alta','@prueba',1,(select DATE(sysdate())),'2022-04-07','p');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(4, 'Examen GE','media','@prueba',1,(select DATE(sysdate())),'2022-06-10','p');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(5, 'Estudio de Bootstrap','media','@prueba',2,(select DATE(sysdate())),'2022-05-10','p');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(6, 'Practica ABD','baja','@prueba',5,(select DATE(sysdate())),'2022-05-26','p');

#tareas tabla programadas
insert into tareas_programadas(id, horas,tipo) values (1,2,'Diaria');
insert into tareas_programadas(id, horas,tipo) values (4,1,'Diaria');
insert into tareas_programadas(id, horas,tipo) values (5,5,'Semanal');
insert into tareas_programadas(id, horas,tipo) values (6,6,'Diaria');
 

insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(2, 'Entrenamiento','alta','@prueba',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(3, 'Gimnasio','alta','@prueba',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(7, 'Reunion','baja','@prueba',6,(select DATE(sysdate())),'2022-06-25','m');
insert into tareas(id, nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values(8, 'Descanso','baja','@prueba',7,(select DATE(sysdate())),'2022-05-29','m');

#tareas tabla manuales
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(2,'14:00', '16:00',1,'@L@J');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(2,'18:00', '19:00',1,'@M@V');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(3,'18:00', '19:00',0,'@M@V');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(7,'17:00', '17:30',0,'@X');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(8,'18:00', '21:00',0,'@S');
 
 


