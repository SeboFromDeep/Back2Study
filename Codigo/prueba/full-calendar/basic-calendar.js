/*

    Codigo basico para inicializar un calendario y ver las distintas formas de incluir tareas
    Doc: https://fullcalendar.io/docs/initialize-globals
    Alternativa a full-calendar: https://ui.toast.com/tui-calendar

*/

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: '2022-02-07',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
        {
          title: 'Estudiar Mates',
          start: '2022-02-01'
        },
        {
          title: 'Long Event',
          start: '2022-02-07',
          end: '2022-02-10'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2022-02-09T16:00:00'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2022-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2022-02-11',
          end: '2022-02-13'
        },
        {
          title: 'Meeting',
          start: '2022-02-12T10:30:00',
          end: '2022-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2022-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2022-02-12T14:30:00'
        },
        {
          title: 'Birthday Party',
          start: '2022-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2022-02-28'
        }
      ]
    });
  
    calendar.render();
  });