$(window).scroll(function () {
    if ($(this).scrollTop() > 10) {
        $(".header").addClass('header-open');
        $(".logo-empresa").addClass('logo-empresa-open');
        $(".nav-icon4").addClass('nav-icon4-open');
        $(".user-empresa-span").addClass('user-empresa-span-open');
        $(".user-empresa").addClass('user-empresa-open');
        $(".back-insta").addClass('back-insta-open');
        $("#site-client").hide();

    } else {
        $(".header").removeClass('header-open');
        $(".logo-empresa").removeClass('logo-empresa-open');
        $(".nav-icon4").removeClass('nav-icon4-open');
        $(".user-empresa-span").removeClass('user-empresa-span-open');
        $(".user-empresa").removeClass('user-empresa-open');
        $(".back-insta").removeClass('back-insta-open');
        $("#site-client").show();
    }
});

function RefreshSomeEventListener() {
    $(".btmais-links").off(); 
    $(".btmais-links").on("click", function() {
        $(this).html() == "+ Opções" ? $(this).html('&ndash; Opções') : $(this).html('+ Opções');
        $(this).next(".mais-links").slideToggle();
    });


    $(".foto").off(); 
    $(".foto").on("click", function() {
        $(".post-up").fadeOut(10);
        $(".mostra-mais-links").slideUp(10);
        $(".descricao").fadeOut(10);
        $(".bt-shopnow").fadeOut(10);
        $(".precos").css({"bottom": "-18px"});

        // Contabiliza os clicks nos produtos para mostrar mais dados
        var form = $(this).closest('form');
        $.ajax({
            type: 'post',
            url: 'clicks.php',
            data: {
                codigo: form[0].elements.namedItem("codigo").value,
                usuario: form[0].elements.namedItem("usuario").value,
                tipo_direto:  ( form[0].elements.namedItem("tipo_direto") ?  form[0].elements.namedItem("tipo_direto").value : false)
            }
        });
        
        $(this).next(".post-up").delay(50).fadeIn(50, function(){
            $(".mostra-mais-links").slideDown(200);
            $(".descricao").fadeIn();
            $(".bt-shopnow").delay(50).fadeIn();
            $(".precos").delay(50).animate({bottom: "15px"}, 150);
        });
    });
     
    $(".post-up").off(); 
    $(".post-up").on("click", function() {
        $(this).fadeOut(50);
        $(".mostra-mais-links").slideUp(50);
        $(".descricao").fadeOut(50);
        $(".bt-shopnow").fadeOut(50);
        $(".precos").css({"bottom": "-18px"});
    });


     //MENU MOBILE
    
    $(".bt-menu-mobile").off(); 
    $(".bt-menu-mobile").on("click", function() {
        $(".menu-mobile").removeClass('abrir');
        $(".nav-icon4").removeClass('open');
    });
    
    
    $("#menu-bt2").off(); 
    $("#menu-bt2").on("click", function() {
        $(this).toggleClass('open');
        $(".menu-mobile").toggleClass('abrir');
    });
}

$(document).ready(function (){
    RefreshSomeEventListener();

    // Faz o submit dos formulários da página utilizando ajax
    $(function () {
        $('form').on('submit', function (e) {
            $('.pedidos-frame').fadeOut(100);
            $('.enviando').show();
            var data = $(this).serialize();
            console.log(data);

            var php = 'send.php';
            if (data.startsWith('form=formBuscarLoja')) {
                php = 'findstore.php';
            }

            $.ajax({
                type: 'post',
                url: php,
                data: $(this).serialize(),
                success: function (response) {
                    console.log('response:');
                    console.log(response);
                    try {
                        var data = JSON.parse(response);
                        if (data.tipo == 'newsletter') {
                            $('#newsletter')[0].innerHTML = data.mensagem;
                            $('#newsletter').delay(1000).fadeOut();
                        } else if (data.tipo == 'pedido' || data.tipo == 'solicitacao') {
                            if (data.success == true) {
                                $('.enviando').hide();
                                $('.pedidos-frame-retorno').fadeIn(100);
                            } else {
                                alert(data.mensagem);
                            }
                        } else {
                            if (data.length > 0) {
                                var html = htmlLojasHTML(data);
                                $(".findstore-loja-selecionada").html(data[0].nome);
                                $("input[name=loja]")[0].value = data[0].codigo;
                                $(".findstore02-out").html(html);
                                $('.enviando').hide();
                                RefreshSomeEventListenerFindStore();
                            } else {
                                $(".findstore02-out").html('Não existem lojas cadastradas para esta pesquisa.');
                                $("input[name=loja]")[0].value = 0;
                                $(".findstore-loja-selecionada").html('Indisponível');
                                $('.enviando').hide();
                            }
                        }
                    } catch (err) {
                    }
                }
            });
            e.preventDefault();
        });
    });

});