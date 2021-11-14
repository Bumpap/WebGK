$(document).ready(function () {

  var $formUsername = $('#form-username');
  var $formChat = $('#form-chat');
  var $preview = $('#preview');
  var $modalUsername = $('#modal-username');

  var ws = new WebSocket(`ws://${location.host}/chat`);

  var send = function (data) {
    ws.send(JSON.stringify(data));
  }

  ws.onopen = () => {
    $modalUsername.modal('show');
  }

  ws.onmessage = (event) => {
    var data = JSON.parse(event.data);

    if (data.id === 1 && data.result) {
      $modalUsername.modal('hide');
    }

    if (data.id === 1 && data.error) {
      $formUsername.find('input').addClass('is-invalid');
      $formUsername.find('.invalid-feedback').text(data.error.message);
      // console.log(data.error.message);
    }

    if (data.method === 'update') {
      $preview.append('<div class="MessageUL">' + '<b>' + data.params.username + '</b>' + ':' + data.params.message + '</div>');
    }
  }

  $formUsername.on('submit', function (e) {
    e.preventDefault();
    var username = $(this).find('input').val();
    send({
      id: 1,
      method: 'username',
      params: {
        username: username,

      }
    })

    // username = "BOT CHAT"
    send({

      method: 'popup',
      params: {
        message: "[" + username + "] connected to the room"
      }
    })

  });

  // $formUsername.on('submit', function (e) {
  //   e.preventDefault();

  // })

  $formChat.on('submit', function (e) {
    e.preventDefault();
    send({
      method: 'message',
      params: {
        message: $(this).find('input').val()
      }
    })
    document.getElementById('message').value = ''

    console.log(document.getElementById('message').value)
  })

  $formChat.on('reset', function (e) {
    e.preventDefault();
    var username = $(this).find('input').val();
    send({
      method: 'leave',
      params: {
        message: "[A user] left the room"
      }
    })
  })

});