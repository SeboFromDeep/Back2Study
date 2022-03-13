/*
    Este codigo es una prueba de como implementar clicks con full-calendar
    Los clicks pueden ser utiltes para crear ventanas que permitan visualizar una tarea o modificarla

    Doc: https://fullcalendar.io/docs/eventClick
*/

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      eventClick: function(info) {
        var eventObj = info.event;
  
        if (eventObj.url) {
          alert(
            'Clicked ' + eventObj.title + '.\n' +
            'Will open ' + eventObj.url + ' in a new tab'
          );
  
          window.open(eventObj.url);
  
          info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        } else {
          alert('Clicked ' + eventObj.title);
        }
      },
      initialDate: '2022-02-15',
      events: [
        {
          title: 'simple event',
          start: '2022-02-02'
        },
        {
          title: 'event with URL',
          url: 'https://www.google.com/',
          start: '2022-02-03'
        }
      ]
    });
  
    calendar.render();
  });