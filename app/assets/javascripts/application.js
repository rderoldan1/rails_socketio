// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require socket.io
//= require turbolinks
//= require_tree .

function remove_event(object) {
  var element = $("#" + object.id);
  element.addClass('danger');
  setTimeout(function () {
    element.remove()
  }, 2000);
}

function add_event(object){
  $('#user-list').append("<tr class='success' id="+ object.id +">" +
    "<td>"+object.name+"</td>" +
    "<td>"+object.lastname+"</td>" +
    "</tr>");
  var element = $("#" + object.id);
  setTimeout(function () {
    element.removeClass('success')
  }, 2000);
}

function update_event(object){
  var element = $("#" + object.id);
  element.addClass('warning');
  element.html("<td>"+object.name+"</td>" +
    "<td>"+object.lastname+"</td>");
  setTimeout(function () {
    element.removeClass('warning')
  }, 2000);
}

var socket = io('http://localhost:8080');
socket.on('message', function (data) {
  var json = JSON.parse(data);
  var object = json.object;
  console.log(object)
  switch (json.event){
    case 'create':
      add_event(object);
      break;
    case 'destroy':
      remove_event(object);
      break;
    case 'update':
      update_event(object);
      break;
  }
});