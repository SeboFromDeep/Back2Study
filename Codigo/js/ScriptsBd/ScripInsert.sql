 
 
--usuarios
INSERT INTO TABLE users(username,email,password) values ('userPrueba1','userPrueba1@email.com','password1');
INSERT INTO TABLE users(username,email,password) values ('userPrueba2','userPrueba2@email.com','password2');
INSERT INTO TABLE users(username,email,password) values ('userPrueba3','userPrueba3@email.com','password3');
INSERT INTO TABLE users(username,email,password) values ('userPrueba4','userPrueba4@email.com','password4');
INSERT INTO TABLE users(username,email,password) values ('userPrueba5','userPrueba5@email.com','password5');
INSERT INTO TABLE users(username,email,password) values ('userPrueba6','userPrueba6@email.com','password6');
INSERT INTO TABLE users(username,email,password) values ('userPrueba7','userPrueba7@email.com','password7');
INSERT INTO TABLE users(username,email,password) values ('userPrueba8','userPrueba8@email.com','password8');
INSERT INTO TABLE users(username,email,password) values ('userPrueba9','userPrueba9@email.com','password9');
INSERT INTO TABLE users(username,email,password) values ('userPrueba10','userPrueb10@email.com','password10');
 
 
 
--tareas tabla padre
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba1','alta','prueba',1,(select DATE(sysdate())),'2022-04-07','p');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba2','alta','prueba',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba2','alta','prueba',1,(select DATE(sysdate())),'2022-04-20','m');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba3','media','prueba',1,(select DATE(sysdate())),'2022-06-10','p');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba4','media','prueba',2,(select DATE(sysdate())),'2022-05-10','p');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba5','baja','prueba',5,(select DATE(sysdate())),'2022-05-26','p');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba7','baja','prueba',6,(select DATE(sysdate())),'2022-06-25','m');
insert into tareas(nombre,prioridad,categoria,usuario,fechafin,fechaini,tipo) values('TareaPrueba7','baja','prueba',7,(select DATE(sysdate())),'2022-05-29','m');
 
 
--tareas tabla manuales
 
insert into tareas_manuales(id_tarea,hora_ini,recurrente,dias_recurrentes,) values(2,'14:00', '16:00',1,'L@J');
insert into tareas_manuales(id_tarea,hora_ini,recurrente,dias_recurrentes,) values(2,'18:00', '19:00',1,'M@V');
 
insert into tareas_manuales(id_tarea,hora_ini,recurrente,dias_recurrentes,) values(6,'17:00', '17:30',0,'X');
insert into tareas_manuales(id_tarea,hora_ini,recurrente,dias_recurrentes,) values(7,'18:00', '21:00',0,'S');
 
 
--tareas tabla programadas
insert into tareas_programadas(id, horas,tipo) values (1,2,'pruebaTipo');
insert into tareas_programadas(id, horas,tipo) values (3,1,'pruebaTipo');
insert into tareas_programadas(id, horas,tipo) values (4,5,'pruebaTipo');
insert into tareas_programadas(id, horas,tipo) values (5,6,'pruebaTipo');
 

