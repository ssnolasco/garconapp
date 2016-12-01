$('.collection').on('click', '.collection-item', function(){

    var $badge = $('.badge', this);
    if ($badge.length === 0) {
        $badge = $('<span class="badge brown-text">0</span>').appendTo(this);
    }

    $badge.text(parseInt($badge.text()) + 1);
});

$('#confirmar').on('click', function() {

	var texto = ''; 
	$('.badge').parent().each(function() {
		var produto = this.firstChild.textContent;
		var quantidade = this.lastChild.textContent;

		texto += '<blockquote>' + produto + ': ' + quantidade + ';</blockquote>';
	});

	$('#resumo').html(texto);
});

$('.modal-trigger').leanModal();

$('.collection').on('click', '.badge', function() {
	$(this).remove();
	return false;
});

$('.acao-limpar').on('click', function() {
	$('#numero-mesa').val('');
	$('.badge').remove();
});

$('.scan-qrcode').click(function() {
	cordova.plugins.barcodeScanner.scan(
      function (result) {
      	if (result.text) {
        	Materialize.toast('Mesa ' + result.text, 2000);
      		$('#numero-mesa').val(result.text);
      	}
      },
      function (error) {
          Materialize.toast('Erro ' + error, 2000, 'red-text');
      },
      {
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : false, // iOS and Android
          "orientation" : "portrait" 
          // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );
});

$('.acao-finalizar').click(function() {
	$.ajax({
		url: 'http://cozinhapp.sergiolopes.org/novo-pedido',
		data: {
			mesa: $('#numero-mesa').val(),
			pedido: $('#resumo').text() 
		},
	})
	.done(function(result) {
		Materialize.toast(result, 2000);
		navigator.vibrate(200);
		$('#numero-mesa').val('');
		$('.badge').remove();
	})
	.fail(function(error) {
		Materialize.toast(error, 3000, 'red-text');
	})
	.always(function() {
		console.log("complete");
	});
	
});