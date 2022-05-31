//VARIABLES GLOBALES
let totalSinDescuento=0;
let totalConDescuento=0;
let precioConDescuentos=0;
let descPorCantDias=0;
let descPorCantHuespedes=0;
const precioPorPersona=3000;
const porcentajeDias=0.15;
const porcentajePersonas=0.10;

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

function imprimeTotales(cantHuespedes,cantidadDias){
    alert
    totalSinDescuento = precioPorEstadia(cantHuespedes,cantidadDias,precioPorPersona);
    console.log("El total a cobrar sin descuentos: $"+totalSinDescuento);

    if(cantHuespedes>3 && cantidadDias>6){
        descPorCantDias= descPorDias(totalSinDescuento,porcentajeDias);
        console.log("Descuento más de 6 días: $"+descPorCantDias);
        descPorCantHuespedes=descPorPersonas(totalSinDescuento,porcentajePersonas);
        console.log("Descuento más de 4 huespedes: $"+descPorCantHuespedes);
    
        totalConDescuento=(totalSinDescuento-descPorCantDias)-descPorCantHuespedes;
        console.log("El total a cobrar con descuentos es: $"+totalConDescuento);
    
    }else if(cantHuespedes>3 && cantidadDias<=6){
        descPorCantHuespedes=descPorPersonas(totalSinDescuento,porcentajePersonas);
        console.log("Descuento más de 4 huespedes: $"+descPorCantHuespedes);
    
        totalConDescuento=totalSinDescuento-descPorCantHuespedes;
        console.log("El total a cobrar con descuentos es: $"+totalConDescuento);
    
    }else if(cantHuespedes<=3 && cantidadDias>6){
    
        descPorCantDias= descPorDias(totalSinDescuento,porcentajeDias);
        console.log("Descuento más de 6 días de hospedaje: $"+descPorCantDias);
    
        totalConDescuento=totalSinDescuento-descPorCantDias;
        console.log("El total a cobrar con descuentos es: $"+totalConDescuento);
    
    }else{
        console.log("No se aplican descuentos.");
        console.log("El total a cobrar es: $"+totalSinDescuento);
    }
}

//ARRAYS
const listaHuespedes = [];
const listaCabanas = [];

//CLASES
class Huesped {
    constructor(nombre,apellido,documento,telefono,mail,domicilio,localidad,cantHuespedes,cantDias){
        this.nombre=nombre;
        this.apellido=apellido;
        this.documento=documento;
        this.telefono=telefono;
        this.mail=mail;
        this.domicilio=domicilio;
        this.localidad=localidad;
        this.cantHuespedes=cantHuespedes;
        this.cantDias=cantDias
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

console.log("Cantidad de cabañas: "+listaCabanas.length);

function ingresarHuesped(){
    do{
        
        let nombre=prompt("Ingrese el nombre del huesped:");
        let apellido = prompt("Ingrese el apellido:");
        let documento = parseInt(prompt("Ingrese el documento:"));
        let telefono = prompt("Ingrese el teléfono:");
        let mail = prompt("Ingrese el mail:");
        let domicilio = prompt("Ingrese el domicilio:");
        let localidad = prompt("Ingrese la localidad:");
        let cantHuespedes=parseInt(prompt("Ingrese la cantidad de huéspedes:"));
        let cantDias = parseInt(prompt("Ingrese la cantidad de días de hospedaje:")); 
        let cabanaSelec=parseInt(prompt("Ingrese el número de cabaña:"));

        let huesped = new Huesped(nombre,apellido,documento,telefono,mail,domicilio,localidad,cantHuespedes,cantDias);

        let cabanaEncontrada=listaCabanas.find((c) => c.idCabana === cabanaSelec)

        if(cabanaEncontrada){
            if(cabanaEncontrada.libre==true){
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
                let indice = listaCabanas.findIndex((c) => c.idCabana === cabanaSelec);
                listaCabanas[indice].libre = false;
                alert("Se ha alquilado la cabaña "+listaCabanas[indice].idCabana);
                console.log("Se ha alquilado la cabaña "+listaCabanas[indice].idCabana);

                imprimeTotales(huesped.cantHuespedes,huesped.cantDias);

                break;

            }else{
                alert("La cabaña "+cabanaEncontrada.idCabana+" se encuentra ocupada.");
            }
        }else{
            alert("La cabaña ingresada no existe.");
        }


    }while(listaHuespedes.length>0)
    
}

ingresarHuesped();
