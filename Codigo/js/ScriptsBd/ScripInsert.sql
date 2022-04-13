
SET FOREIGN_KEY_CHECKS = 0; 
TRUNCATE table tareas_programadas;
TRUNCATE table tareas_manuales;
TRUNCATE table tareas;
truncate table users;
SET FOREIGN_KEY_CHECKS = 1;
 

#usuarios
INSERT INTO users(id, username,email,password) values (1, 'userPrueba1','userPrueba1@email.com','1234'); #Todas las combinaciones
insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(1, 'Proyecto TP','ALTA','@TP@UNI',1,(select DATE(sysdate())),'2022-04-07','p');
insert into tareas_programadas(id_programada, horas,tipo) values (1,2,'Diaria');

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(4, 'Examen GE','MEDIA','@UNI@GE',1,(select DATE(sysdate())),'2022-06-10','p');
insert into tareas_programadas(id_programada, horas,tipo) values (4,1,'Diaria');

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(2, 'Entrenamiento','ALTA','@VERANO',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(2,'14:00', '16:00',1,'@L@J');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(2,'18:00', '19:00',1,'@M@V');

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(3, 'Gimnasio','ALTA','@FUERTE',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(3,'18:00', '19:00',0,'@M@V');

#---------------------------------------------------------------
INSERT INTO users(id, username,email,password) values (2, 'userPrueba2','userPrueba2@email.com','1234'); #Solo programadas

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(5, 'Estudio de Bootstrap','MEDIA','@WEB',2,(select DATE(sysdate())),'2022-05-10','p');
insert into tareas_programadas(id_programada, horas,tipo) values (5,5,'Semanal');
#---------------------------------------------------------------
INSERT INTO users(id, username,email,password) values (3, 'userPrueba3','userPrueba3@email.com','1234'); #Sin Tareas
#---------------------------------------------------------------
INSERT INTO users(id, username,email,password) values (4, 'userPrueba4','userPrueba4@email.com','1234'); #Sin Tareas
#---------------------------------------------------------------
INSERT INTO users(id, username,email,password) values (5, 'userPrueba5','userPrueba5@email.com','1234'); #Solo programadas

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(6, 'Practica ABD','BAJA','@ABD@UNI',5,(select DATE(sysdate())),'2022-05-26','p');
insert into tareas_programadas(id_programada, horas,tipo) values (6,6,'Diaria');
#---------------------------------------------------------------

INSERT INTO users(id, username,email,password) values (6, 'userPrueba6','userPrueba6@email.com','1234'); #Manual

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(7, 'Reunion','BAJA','',6,(select DATE(sysdate())),'2022-06-25','m');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(7,'17:00', '17:30',0,'@X');


INSERT INTO users(id, username,email,password) values (7, 'userPrueba7','userPrueba7@email.com','1234'); #Manual

insert into tareas(id_tarea, nombre,prioridad,categoria,id_usuario,fechafin,fechaini,tipo) values(8, 'Descanso','BAJA','@SALUD',7,(select DATE(sysdate())),'2022-05-29','m');
insert into tareas_manuales(id_tarea,hora_ini,hora_fin ,recurrente,dias_recurrentes) values(8,'18:00', '21:00',0,'@S');

INSERT INTO users(id, username,email,password) values (8, 'userPrueba8','userPrueba8@email.com','1234'); #Sin Tareas
INSERT INTO users(id, username,email,password) values (9, 'userPrueba9','userPrueba9@email.com','1234');
INSERT INTO users(id, username,email,password) values (10, 'userPrueba10','userPrueb10@email.com','1234');
