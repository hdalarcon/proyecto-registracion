//VARIABLES GLOBALES
let totalSinDescuento=0;
let totalConDescuento=0;
let precioConDescuentos=0;
let descPorCantDias=0;
let descPorCantHuespedes=0;
let nombre=document.getElementById("nombre"); 
let apellido = document.getElementById("apellido"); 
let documento = document.getElementById("documento"); 
let telefono = document.getElementById("telefono"); 
let mail = document.getElementById("mail");
let domicilio = document.getElementById("domicilio"); 
let localidad = document.getElementById("localidad"); 
let cantHuespedes= document.getElementById("cant-huespedes"); 
let cantDias = document.getElementById("cant-dias"); 
let elegirCabana= document.getElementById("numero-cabana"); 
let leyenda="";
let contenedorDiv="";
let ocupada;
const precioPorPersona=3000;
const porcentajeDias=0.15;
const porcentajePersonas=0.10;


//ARRAYS
const listaHuespedes = [];
const listaCabanas = [];

//CLASES
class Huesped {
    constructor(nombre,apellido,documento,telefono,mail,domicilio,localidad,totHuespedes,totDias){
        this.nombre=nombre;
        this.apellido=apellido;
        this.documento=documento;
        this.telefono=telefono;
        this.mail=mail;
        this.domicilio=domicilio;
        this.localidad=localidad;
        this.cantHuespedes=totHuespedes;
        this.cantDias=totDias
    } 
}

class Cabana {
    constructor(idCabana,libre){
        this.idCabana=idCabana;
        this.libre=libre;
    }
}

listaCabanas.push(new Cabana(1,true))
listaCabanas.push(new Cabana(2,true))
listaCabanas.push(new Cabana(3,true))
listaCabanas.push(new Cabana(4,true))
listaCabanas.push(new Cabana(5,true))
listaCabanas.push(new Cabana(6,true))



let botonIngresar = document.getElementById("botonIngresar");
botonIngresar.addEventListener("click",ingresarHuesped);

let botonLimpiar = document.getElementById("botonLimpiar");
botonLimpiar.addEventListener("click",limpiarFormulario);

let botonCalcular = document.getElementById("botonCalcular");
botonCalcular.addEventListener("click",imprimeTotales);


//FUNCIONES
function precioPorEstadia(cantHuesp,cantDias,precioPorPers){
    return ((cantHuesp*precioPorPers)*cantDias);
}

function descPorDias(total,porcentaje){
    return total*porcentaje;
}

function descPorPersonas(total,porcentaje){
    return total*porcentaje;
}

function muestraCabanasLibres(){
    console.log("Cantidad de cabañas: "+listaCabanas.length);
    console.log("Cabañas disponibles: ");
    for (const cabana of cabanasLibres) {
        console.log("Cabaña "+cabana.idCabana);
    }
}



function imprimeTotales(){
    cantHuespedes =parseInt(document.getElementById("cant-huespedes").value);
    cantDias = parseInt(document.getElementById("cant-dias").value);

    totalSinDescuento = precioPorEstadia(cantHuespedes,cantDias,precioPorPersona);
    document.getElementById("total-sin-desc").value= totalSinDescuento;

    if(cantHuespedes>3 && cantDias>6){
        descPorCantDias= descPorDias(totalSinDescuento,porcentajeDias);
        document.getElementById("desc-dias").value = descPorCantDias;
        descPorCantHuespedes=descPorPersonas(totalSinDescuento,porcentajePersonas);
        document.getElementById("desc-huespedes").value = descPorCantHuespedes;
    
        totalConDescuento=(totalSinDescuento-descPorCantDias)-descPorCantHuespedes;
        document.getElementById("total").value = totalConDescuento;
    
    }else if(cantHuespedes>3 && cantDias<=6){
        descPorCantHuespedes=descPorPersonas(totalSinDescuento,porcentajePersonas);
        document.getElementById("desc-huespedes").value = descPorCantHuespedes;
        document.getElementById("desc-dias").value = 0;
    
        totalConDescuento=totalSinDescuento-descPorCantHuespedes;
        document.getElementById("total").value = totalConDescuento;
    
    }else if(cantHuespedes<=3 && cantDias>6){
    
        descPorCantDias= descPorDias(totalSinDescuento,porcentajeDias);
        document.getElementById("desc-dias").value = descPorCantDias;
        document.getElementById("desc-huespedes").value = 0;
    
        totalConDescuento=totalSinDescuento-descPorCantDias;
        document.getElementById("total").value = totalConDescuento;
    
    }else{
        document.getElementById("desc-huespedes").value = 0;
        document.getElementById("desc-dias").value = 0;
        document.getElementById("total").value = totalSinDescuento;
    }
}

function limpiarFormulario(){
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("documento").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("domicilio").value = "";
    document.getElementById("localidad").value = "";
    document.getElementById("cant-huespedes").value = "";
    document.getElementById("cant-dias").value = "";
    document.getElementById("numero-cabana").value = "";
    document.getElementById("total-sin-desc").value= "";
    document.getElementById("desc-huespedes").value = "";
    document.getElementById("desc-dias").value = "";
    document.getElementById("total").value = "";
    contenedorDiv.innerText="";
}

function validarCabana(numCabana){

    let cabanaEncontrada=listaCabanas.find((c) => c.idCabana === numCabana);

    if(cabanaEncontrada){
        if(cabanaEncontrada.libre==true){
            return true;
        }else{
                alert("La cabaña ingresada se encuentra ocupada.");
                ocupada=true;
             }    
    }else{
        alert("La cabaña ingresada no existe.");
        ocupada=false;
    }    
    return ocupada;
}

function ingresarHuesped(){
    ocupada=false;    
    
    nombre=document.getElementById("nombre").value; 
    apellido = document.getElementById("apellido").value; 
    documento = parseInt(document.getElementById("documento").value); 
    telefono = parseInt(document.getElementById("telefono").value); 
    mail = document.getElementById("mail").value;
    domicilio = document.getElementById("domicilio").value; 
    localidad = document.getElementById("localidad").value; 
    cantHuespedes= parseInt(document.getElementById("cant-huespedes").value); 
    cantDias = parseInt(document.getElementById("cant-dias").value); 
    elegirCabana= parseInt(document.getElementById("numero-cabana").value) ; 

    validarCabana(elegirCabana);


    if(ocupada){
        alert("Debe ingresar otra cabaña.");
    }else{
        
        let huesped = new Huesped(nombre,apellido,documento,telefono,mail,domicilio,localidad,cantHuespedes,cantDias);

        listaHuespedes.push(huesped);
    
        console.log("Datos del huesped:");
        console.log("Nombre y apellido: "+huesped.nombre+" "+huesped.apellido);
        console.log("Documento: "+huesped.documento);
        console.log("Teléfono: "+huesped.telefono);
        console.log("Mail: "+huesped.mail);
        console.log("Domicilio: "+huesped.domicilio);
        console.log("Localidad: "+huesped.localidad);
        console.log("Cantidad de huéspedes: "+huesped.cantHuespedes);
        console.log("Cantidad de días: "+huesped.cantDias);
    
    
        let indice = listaCabanas.findIndex((c) => c.idCabana === elegirCabana);
        listaCabanas[indice].libre = false;
        alert("Se ha alquilado la cabaña "+listaCabanas[indice].idCabana);
        leyenda = "Se ha alquilado la cabaña "+listaCabanas[indice].idCabana;
    
        contenedorDiv.innerText="";
        contenedorDiv = document.getElementById("leyenda");
        contenedorDiv.style.color="green";
        contenedorDiv.append(leyenda)
    
        imprimeTotales(huesped.cantHuespedes,huesped.cantDias);
    }
    
}


const cabanasLibres=listaCabanas.filter((cl) =>cl.libre==true);

muestraCabanasLibres();


