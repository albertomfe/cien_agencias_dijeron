'use strict';
var Game = /** @class */ (function () {
    function Game() {
        console.log('Iniciando Aplicaciòn');
        this.cargando = true;
        this.iniciado = false;
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
        if (juego.iniciado) //si no a comenzado el juego
         {
            console.log('finalizando juego ...');
            //comprobar compatibilidad localStorage
            if (typeof (Storage) !== "undefined") {
                document.getElementById("label_pregunta").innerHTML = ""; //limpiar pregunta
                document.getElementById("div_impresion_errores").innerHTML = ""; //limpiar errores
                //REPRODUCIR SONIDO
                var audio = document.getElementById("sonido_ganador");
                audio.pause();
                audio.currentTime = 0;
                audio.play();
                //DEFINIR EL GANADOR DE LA PARTIDA
                var pts_ganador = '';
                var ganador = "<div class=\"sixteen wide tablet sixteen wide computer column fondo_ganador\">";
                var puntajes = JSON.parse(localStorage.getItem("puntajes"));
                if (puntajes[0].equipo1 > puntajes[0].equipo2) {
                    ganador += "<span class='winner'>GANADOR</span><br><br><br><span class='winner'>EQUIPO 1</span>";
                    pts_ganador = puntajes[0].equipo1;
                }
                if (puntajes[0].equipo2 > puntajes[0].equipo1) {
                    ganador += "<span class='winner'>GANADOR</span><br><br><br><span class='winner'>EQUIPO 2</span>";
                    pts_ganador = puntajes[0].equipo2;
                }
                ganador += "</div>";
                document.getElementById("tabla_de_respuestas").innerHTML = ganador;
                document.getElementById("label_ronda").innerHTML = "Resultado " + pts_ganador + " Pts"; //limpiar ronda
                if (localStorage.getItem("puntajes")) {
                    localStorage.removeItem("puntajes"); //eliminar variable localstorage
                }
            } //local storage validation
        }
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
                    "puntaje": [],
                    "equipo1": 0,
                    "equipo2": 0
                }
            ];
            puntajes[0].errores.push(0); //crear el numero de errores en ronda 0
            puntajes[0].puntaje.push(0); //crear el numero de errores en ronda 0
            localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
            //setTimeout(juego.imprimir_puntajes,3000);
            setTimeout(this.get_ronda, 13000);
            //this.imprimir_puntajes();
            //tienes que llamar la ronda
            //this.get_ronda();
            //REPRODUCIR SONIDO
            var audio = document.getElementById("sonido_inicio");
            audio.play();
            //iniciar los botones
            this.iniciado = true;
            //texto de bienvenida
            var welcome = "<div class=\"sixteen wide tablet sixteen wide computer column fondo_bienvenida\">";
            welcome += "<span class='texto_welcome'>COMEZEMOS</span><br><br><br><span class='texto_welcome'>A JUGAR</span>";
            welcome += "<br><img class='logo_carga' src='./assets/logos/flip.gif'/>";
            welcome += "<br><span class='frase'>Elige Confianza,Elige Imacop</span>";
            welcome + "</div>";
            document.getElementById("tabla_de_respuestas").innerHTML = welcome;
            //document.getElementById('btn1').removeAttribute("disabled");
        } //validacion de localStorage
    };
    Game.prototype.mostrar_errores = function (ronda_actual) {
        var puntajes = JSON.parse(localStorage.getItem("puntajes"));
        //VERIFICAR SI EXISTE LA POSICION DEL ELEMENTO DE LA RONDA
        if (!puntajes[0].errores[ronda_actual]) {
            //si no existe crearlo
            puntajes[0].errores[ronda_actual] = 0;
            localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
            document.getElementById("div_impresion_errores").innerHTML = "";
        }
        else {
            //mostrarlo en la div
            var errores = puntajes[0].errores[ronda_actual];
            /*if(errores==1){
              document.getElementById("div_impresion_errores").innerHTML="<span class='tacha'><i class='close icon'></i></span>";
            }*/
            if (errores == 1) {
                document.getElementById("div_impresion_errores").innerHTML = "<img class='tache_img' src='./assets/tache.jpg' />";
            }
            if (errores == 2) {
                document.getElementById("div_impresion_errores").innerHTML = "<img class='tache_img' src='./assets/tache.jpg' /><img class='tache_img' src='./assets/tache.jpg' />";
            }
            if (errores == 3) {
                document.getElementById("div_impresion_errores").innerHTML = "<img class='tache_img' src='./assets/tache.jpg' /><img class='tache_img' src='./assets/tache.jpg' /><img class='tache_img' src='./assets/tache.jpg' />";
            }
        }
        //console.log(puntajes);
    };
    //llamar el numero de ronda
    Game.prototype.get_ronda = function () {
        var puntajes = JSON.parse(localStorage.getItem("puntajes"));
        var ronda_actual = puntajes[0].ronda;
        console.log('ronda actual= ' + puntajes[0].ronda);
        juego.mostrar_errores(ronda_actual);
        //mostrarla en el elemento
        document.getElementById("label_ronda").innerHTML = "Ronda " + ronda_actual;
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
            console.log('data obj = ', objeto);
            //console.log(objeto[0]['ronda'+ronda_actual]);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas);
            //console.log('tam=',objeto[0]['ronda'+ronda_actual].respuestas.length);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas[0].respuesta);
            //console.log(objeto[0]['ronda'+ronda_actual].respuestas[0].valor);
            console.log('ronda' + ronda_actual);
            var num_respuestas = objeto[0]['ronda' + ronda_actual].respuestas.length;
            document.getElementById("label_pregunta").innerHTML = objeto[0]['ronda' + ronda_actual].pregunta;
            var div_respuestas_ocultas = "<div class=\"sixteen wide tablet sixteen wide computer column\">";
            //div_respuestas_ocultas+=`<input type='text' id='c_num_respuestas_ronda_`+ronda_actual+`' value='`+num_respuestas+`' >`;//lo usare para mostrar lso resultados si no se revealn
            for (var i = 0; i < num_respuestas; i++) {
                div_respuestas_ocultas += "<div class='respuesta_oculta' id='destapar_" + i + "'><a class='manita' onclick=\"juego.destapar(" + i + ",'" + objeto[0]['ronda' + ronda_actual].respuestas[i].respuesta + "','" + objeto[0]['ronda' + ronda_actual].respuestas[i].valor + "')\"><span class='indice'>" + (i + 1) + "</span>...............................</a></div>";
            }
            div_respuestas_ocultas += "</div>";
            document.getElementById("tabla_de_respuestas").innerHTML = div_respuestas_ocultas;
            /*FIN CUERPO DE TRABAJO EN EL CAMBIO DE RONDA*/
        })["catch"](function (err) {
            console.log(err);
        });
    };
    //fin de funcion ronda
    Game.prototype.ronda_siguiente = function () {
        if (juego.iniciado) //si no a comenzado el juego
         {
            console.log('siguiente ronda ..');
            //obtener valro de ronda actual
            var puntajes = JSON.parse(localStorage.getItem("puntajes")); //descargar el json en la variable
            var ronda = puntajes[0].ronda; //obtener la ronda actual
            if (ronda < 5) {
                ronda++; //incrementar la ronda
                puntajes[0].ronda = ronda; //asignarle la nueva ronda
                localStorage.setItem("puntajes", JSON.stringify(puntajes)); //Actualizar el valor de la Ronda
                this.get_ronda(); //llamar la ronda
                this.crear_puntos_ronda(); //inicializar u Obtener Los Puntos de Ronda
                //REPRODUCIR SONIDO
                var audio = document.getElementById("sonido_cambio_ronda");
                audio.play();
                //cargar errores de la ronda
                console.log('siguiente ronda' + ronda);
                this.mostrar_errores(ronda); //llamar la muestra de errores
            } //validar avance de rondas
        }
    };
    Game.prototype.ronda_anterior = function () {
        if (juego.iniciado) //si no a comenzado el juego
         {
            console.log('anterior ronda ..');
            //obtener valro de ronda actual
            var puntajes = JSON.parse(localStorage.getItem("puntajes")); //descargar el json en la variable
            var ronda = puntajes[0].ronda; //obtener la ronda actual
            if (ronda > 1) {
                ronda--; //incrementar la ronda
                puntajes[0].ronda = ronda; //asignarle la nueva ronda
                localStorage.setItem("puntajes", JSON.stringify(puntajes)); //Actualizar el valor de la Ronda
                this.get_ronda(); //llamar la ronda
                this.crear_puntos_ronda(); //inicializar u Obtener Los Puntos de Ronda
            }
        }
    };
    Game.prototype.incrementar_error = function () {
        if (juego.iniciado) //si no a comenzado el juego
         {
            var puntajes = JSON.parse(localStorage.getItem("puntajes"));
            var ronda_actual = puntajes[0].ronda; //obtener la ronda actual
            //console.log(ronda_actual);
            //VERIFICAR SI EXISTE LA POSICION DEL ELEMENTO DE LA RONDA
            if (!puntajes[0].errores[ronda_actual]) {
                puntajes[0].errores[ronda_actual]++;
                localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
                this.mostrar_errores(ronda_actual); //llamar la muestra de errores
            }
            else {
                if (puntajes[0].errores[ronda_actual] < 3) {
                    puntajes[0].errores[ronda_actual]++;
                    localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
                    this.mostrar_errores(ronda_actual); //llamar la muestra de errores
                }
            }
            //REPRODUCIR SONIDO
            var audio = document.getElementById("sonido_error");
            audio.play();
        }
    };
    Game.prototype.destapar = function (numero, respuesta, valor) {
        if (juego.iniciado) //si no a comenzado el juego
         {
            //asignar los puntos a la ronda
            var longitud = respuesta.length;
            for (var j = longitud; j <= 40; j++) {
                respuesta += ".";
            }
            respuesta = respuesta.toUpperCase();
            //console.log('Longitud ',longitud);
            document.getElementById("destapar_" + numero).innerHTML = respuesta + valor;
            this.suma_de_ronda(valor);
            //REPRODUCIR SONIDO
            var audio = document.getElementById("sonido_destapar");
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    };
    Game.prototype.suma_de_ronda = function (valor) {
        if (juego.iniciado) //si no a comenzado el juego
         {
            var puntajes = JSON.parse(localStorage.getItem("puntajes"));
            var ronda_actual = puntajes[0].ronda; //obtener la ronda actual
            //console.log('ronda',ronda_actual);
            //VERIFICAR SI EXISTE LA POSICION DEL ELEMENTO DE LA RONDA
            if (!puntajes[0].puntaje[ronda_actual]) {
                //si no existe crearlo
                puntajes[0].puntaje[ronda_actual] = parseInt(valor);
                localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
            }
            else {
                puntajes[0].puntaje[ronda_actual] += parseInt(valor);
                localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
            }
            var puntaje = puntajes[0].puntaje[ronda_actual];
            document.getElementById("c_pts_ronda").value = puntaje;
        }
    };
    Game.prototype.crear_puntos_ronda = function () {
        var puntajes = JSON.parse(localStorage.getItem("puntajes"));
        var ronda_actual = puntajes[0].ronda; //obtener la ronda actual
        //console.log('ronda',ronda_actual);
        if (!puntajes[0].puntaje[ronda_actual]) {
            puntajes[0].puntaje[ronda_actual] = 0;
        }
        var puntaje = puntajes[0].puntaje[ronda_actual];
        document.getElementById("c_pts_ronda").value = puntaje;
    };
    Game.prototype.asignar_puntos = function (equipo) {
        if (juego.iniciado) //si no a comenzado el juego
         {
            var puntajes = JSON.parse(localStorage.getItem("puntajes"));
            var ronda_actual = puntajes[0].ronda; //obtener la ronda actual
            var puntaje_actual = puntajes[0].puntaje[ronda_actual];
            puntajes[0]["equipo" + equipo] += puntaje_actual;
            document.getElementById("c_pts_eq" + equipo).value = puntajes[0]["equipo" + equipo];
            document.getElementById("c_pts_ronda").value = 0;
            puntajes[0].puntaje[ronda_actual] = 0;
            localStorage.setItem("puntajes", JSON.stringify(puntajes)); //crear Objeto
        }
    };
    Game.prototype.mostrar_respuestas = function () {
        if (juego.iniciado) //si no a comenzado el juego
         {
            //console.log('Mostrar Respuestas');
            var puntajes = JSON.parse(localStorage.getItem("puntajes"));
            var ronda_actual = puntajes[0].ronda; //obtener la ronda actual
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
                /*CUERPO*/
                var objeto = JSON.parse(data);
                console.log('data obj = ', objeto);
                console.log('ronda' + ronda_actual);
                var num_respuestas = objeto[0]['ronda' + ronda_actual].respuestas.length;
                document.getElementById("label_pregunta").innerHTML = objeto[0]['ronda' + ronda_actual].pregunta;
                var div_respuestas_ocultas = "<div class=\"sixteen wide tablet sixteen wide computer column\">";
                //div_respuestas_ocultas+=`<input type='text' id='c_num_respuestas_ronda_`+ronda_actual+`' value='`+num_respuestas+`' >`;//lo usare para mostrar lso resultados si no se revealn
                for (var i = 0; i < num_respuestas; i++) {
                    var respuesta = objeto[0]['ronda' + ronda_actual].respuestas[i].respuesta;
                    var longitud = respuesta.length;
                    for (var j = longitud; j <= 40; j++) {
                        respuesta += ".";
                    }
                    respuesta = respuesta.toUpperCase();
                    respuesta = respuesta + objeto[0]['ronda' + ronda_actual].respuestas[i].valor;
                    objeto[0]['ronda' + ronda_actual].respuestas[i].valor;
                    div_respuestas_ocultas += "<div class='respuesta_oculta' id='destapar_" + i + "'>" + respuesta + "</div>";
                    //REPRODUCIR SONIDO
                    var audio = document.getElementById("sonido_destapar");
                    audio.pause();
                    audio.currentTime = 0;
                    audio.play();
                }
                div_respuestas_ocultas += "</div>";
                document.getElementById("tabla_de_respuestas").innerHTML = div_respuestas_ocultas;
                /*FIN CUERPO*/
            })["catch"](function (err) {
                console.log(err);
            });
        }
    };
    return Game;
}()); //Fin de la Clase
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
//ASIGNAR EQUIPO 1
document.getElementById("b_equipo1").addEventListener("click", function () {
    juego.asignar_puntos(1);
});
//ASIGNAR EQUIPO 2
document.getElementById("b_equipo2").addEventListener("click", function () {
    juego.asignar_puntos(2);
});
//ERROR
document.getElementById("b_error").addEventListener("click", function () {
    juego.incrementar_error();
});
//MOSTRAR
document.getElementById("b_show").addEventListener("click", function () {
    juego.mostrar_respuestas();
});
//FINALIZAR JUEGO
document.getElementById("b_endPlay").addEventListener("click", function () {
    juego.endGame(); //call endGame
});
