'use strict';
var Game = /** @class */ (function () {
    function Game() {
        console.log('Iniciando Aplicaciòn');
        this.cargando = true;
    }
    //Efecto de precarga
    Game.prototype.efecto_carga = function () {
        this.cargando = false;
        //console.log('efecto carga');
        if (!this.cargando) {
            document.getElementById("precarga").style.display = "none";
            document.getElementById("contenedor_juego").style.display = "block";
        }
    };
    /*Finalizar el Juego*/
    Game.prototype.endGame = function () {
        console.log('finalizando juego ...');
        //comprobar compatibilidad localStorage
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("puntajes")) {
                localStorage.removeItem("puntajes"); //eliminar variable localstorage
            }
        } //local storage validation
    };
    /*Inicializar el Juego*/
    Game.prototype.startGame = function () {
        //comprobar compatibilidad localStorage
        if (typeof (Storage) !== "undefined") {
            console.log('Iniciando Juego..');
            var puntajes = [
                {
                    "ronda": 1,
                    "errores": [],
                    "equipo1": 0,
                    "equipo2": 0
                }
            ];
            localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
            this.imprimir_puntajes();
            //tienes que llamar la ronda
            this.get_ronda();
        } //validacion de localStorage
    };
    /*Imprimir Juegos*/
    Game.prototype.imprimir_puntajes = function () {
        //convertir a objeto
        var puntajes = JSON.parse(localStorage.getItem("puntajes"));
        console.log(puntajes);
    };
    //llamar el numero de ronda
    Game.prototype.get_ronda = function () {
        var puntajes = JSON.parse(localStorage.getItem("puntajes"));
        var ronda_actual = puntajes[0].ronda;
        console.log('ronda actual= ' + puntajes[0].ronda);
        fetch('./Encuestas/encuesta.json', {
            method: 'GET'
        })
            .then(function (respuesta) {
            if (respuesta.ok) {
                return respuesta.text();
            }
            else {
                throw "Error en la llamada Ajax";
            }
        })
            .then(function (data) {
            document.getElementById("tabla_de_respuestas").innerHTML = "";
            /*CUERPO DE TRABAJO EN EL CAMBIO DE RONDA*/
            var objeto = JSON.parse(data);
            console.log('data', objeto);
            //console.log(objeto[0]['ronda'+ronda_actual]);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas);
            //console.log('tam=',objeto[0]['ronda'+ronda_actual].respuestas.length);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas[0].respuesta);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas[0].valor);
            var num_respuestas = objeto[0]['ronda' + ronda_actual].respuestas.length;
            document.getElementById("label_pregunta").innerHTML = objeto[0]['ronda' + ronda_actual].pregunta;
            var div_respuestas_ocultas = "<div class=\"sixteen wide tablet sixteen wide computer column\">";
            for (var i = 0; i < num_respuestas; i++) {
                div_respuestas_ocultas += "<div class='respuesta_oculta'><a class='manita' onclick=\"destapar(" + i + ",'" + objeto[0]['ronda' + ronda_actual].respuestas[0].respuesta + "','" + objeto[0]['ronda' + ronda_actual].respuestas[0].valor + "')\">...............................</a></div>";
            }
            div_respuestas_ocultas += "</div>";
            document.getElementById("tabla_de_respuestas").innerHTML = div_respuestas_ocultas;
            //document.getElementById("div_impresion_errores").innerHTML =objeto[0]['ronda'+ronda_actual].pregunta;
            /*FIN CUERPO DE TRABAJO EN EL CAMBIO DE RONDA*/
        })["catch"](function (err) {
            console.log(err);
        });
    }; //fin de funcion ronda
    Game.prototype.ronda_siguiente = function () {
        console.log('siguiente ronda ..');
        //obtener valro de ronda actual
        var puntajes = JSON.parse(localStorage.getItem("puntajes")); //descargar el json en la variable
        var ronda = puntajes[0].ronda; //obtener la ronda actual
        ronda++; //incrementar la ronda
        puntajes[0].ronda = ronda; //asignarle la nueva ronda
        localStorage.setItem("puntajes", JSON.stringify(puntajes)); //Actualizar el valor de la Ronda
        this.get_ronda(); //llamar la ronda
    };
    Game.prototype.ronda_anterior = function () {
        console.log('anterior ronda ..');
        //obtener valro de ronda actual
        var puntajes = JSON.parse(localStorage.getItem("puntajes")); //descargar el json en la variable
        var ronda = puntajes[0].ronda; //obtener la ronda actual
        ronda--; //incrementar la ronda
        puntajes[0].ronda = ronda; //asignarle la nueva ronda
        localStorage.setItem("puntajes", JSON.stringify(puntajes)); //Actualizar el valor de la Ronda
        this.get_ronda(); //llamar la ronda
    };
    return Game;
}()); //Fin de la Clase
function destapar(numero, respuesta, valor) {
    console.log('destapar la respuesta #' + numero, respuesta, valor);
}
var juego = new Game();
setTimeout(juego.efecto_carga, 1000);
/*EVENTOS*/
//INICAR JUEGO
document.getElementById("b_play").addEventListener("click", function () {
    juego.startGame(); //call function iniciar juego
});
//SIGUIENTE RONDA
document.getElementById("b_nextRond").addEventListener("click", function () {
    juego.ronda_siguiente(); //call function siguiten ronda
});
//ATRAS RONDA
document.getElementById("b_backtRond").addEventListener("click", function () {
    juego.ronda_anterior(); //call function siguiten ronda
});
//FINALIZAR JUEGO
document.getElementById("b_endPlay").addEventListener("click", function () {
    juego.endGame(); //call endGame
});
