// @GabrielGzS

const ColorDictionary = {
    "ALTA": "red",
    "MEDIA": "orange",
    "BAJA": "green"
}

module.exports.EventsToParse = [
    {
      id_tarea: 1,
      nombre: 'Proyecto TP',
      prioridad: 'ALTA',
      categoria: '@TP@UNI',
      fechafin: "2022-04-24T22:00:00.000Z",
      fechaini: "2022-04-06T22:00:00.000Z",
      tipo: 'p'
    },
    {
      id_tarea: 2,
      nombre: 'Entrenamiento',
      prioridad: 'ALTA',
      categoria: '@VERANO',
      fechafin: "2022-04-24T22:00:00.000Z",
      fechaini: "2022-04-19T22:00:00.000Z",
      tipo: 'm'
    },
    {
      id_tarea: 3,
      nombre: 'Gimnasio',
      prioridad: 'ALTA',
      categoria: '@FUERTE',
      fechafin: "2022-04-24T22:00:00.000Z",
      fechaini: "2022-04-19T22:00:00.000Z",
      tipo: 'm'
    },
    {
      id_tarea: 4,
      nombre: 'Examen GE',
      prioridad: 'MEDIA',
      categoria: '@UNI@GE',
      fechafin: "2022-04-24T22:00:00.000Z",
      fechaini: "2022-06-09T22:00:00.000Z",
      tipo: 'p'
    },
    {
      id_tarea: 13,
      nombre: 'probandoNuevaTarea',
      prioridad: 'MEDIA',
      categoria: '@prueba@gps',
      fechafin: "2022-04-28T22:00:00.000Z",
      fechaini: "2022-04-25T22:00:00.000Z",
      tipo: 'p'
    },
    {
      id_tarea: 14,
      nombre: 'rtgvrt',
      prioridad: 'MEDIA',
      categoria: '@prueba@gps',
      fechafin: "2022-05-26T22:00:00.000Z",
      fechaini: "2022-04-26T22:00:00.000Z",
      tipo: 'p'
    },
    {
      id_tarea: 16,
      nombre: 'probandoNuevaTarea',
      prioridad: 'ALTA',
      categoria: '@PRUEBA@GPS',
      fechafin: "2022-06-23T22:00:00.000Z",
      fechaini: "2022-04-25T22:00:00.000Z",
      tipo: 'm'
    },
    {
      id_tarea: 17,
      nombre: 'probandoNuevaTarea',
      prioridad: 'ALTA',
      categoria: '@PRUEBA@GPS',
      fechafin: "2022-07-21T22:00:00.000Z",
      fechaini: "2022-05-01T22:00:00.000Z",
      tipo: 'm'
    }
  ]

module.exports.DefaultEvents = [
    {
    title: 'All Test Event',
    start: '2022-04-01',
    backgroundColor:'red'
    },
    {
    title: 'Long Test Event',
    start: '2022-04-07',
    end: '2022-04-10',
    backgroundColor:'green'
    },
    {
    id: 999,
    title: 'Repeating Event',
    start: '2022-04-09T16:00:00'
    },
    {
    id: 999,
    title: 'Repeating Event',
    start: '2022-04-16T16:00:00'
    },
    {
    title: 'Conference',
    start: '2022-04-11',
    end: '2022-04-13'
    },
    {
    title: 'Meeting',
    start: '2022-04-12T10:30:00',
    end: '2022-04-12T12:30:00'
    },
    {
    title: 'Lunch',
    start: '2022-04-12T12:00:00'
    },
    {
    title: 'Meeting',
    start: '2022-04-12T14:30:00'
    },
    {
    title: 'Happy Hour',
    start: '2022-04-12T17:30:00'
    },
    {
    title: 'Dinner',
    start: '2022-04-12T20:00:00'
    },
    {
    title: 'Birthday Party',
    start: '2022-04-13T07:00:00'
    },
    {
    title: 'Click for Google',
    url: 'http://google.com/',
    start: '2022-04-28'
    }
];

module.exports.TestEvents = [
    {
    title: 'Test1',
    start: '2022-04-01',
    backgroundColor:'red'
    },
    {
    title: 'Test2',
    start: '2022-04-07',
    end: '2022-04-10',
    backgroundColor:'green'
    },
    {
    id: 999,
    title: 'Test3',
    start: '2022-04-09T16:00:00'
    },
    {
    title: 'Conference Test',
    start: '2022-04-11',
    end: '2022-04-13'
    }
];

module.exports.CreateEventsFromTasks = function(tasks) {
    console.log("PARSING TASKS:", tasks)
    let eventArray = []
    for (const task of tasks) {
      console.log("TASK TO PARSE:", task)
        let newEvent = {
            title: task.nombre + ' ' + task.categoria,
            start: task.fechaini,
            end: task.fechafin,
            backgroundColor: ColorDictionary[task.prioridad]
        }
        eventArray.push(newEvent);
    }
    console.log("PARSED EVENTS:", eventArray)
    return eventArray
}

module.exports.Init = function() { 
    console.log("Initializing EventModule");
    // create new user events object
    module.exports.UserEvents = {};
}