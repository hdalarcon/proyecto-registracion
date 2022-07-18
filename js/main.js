//VARIABLES GLOBALES
let totalSinDescuento=0;
let nombre=document.getElementById("nombre").value; 
let apellido = document.getElementById("apellido"); 
let documento = document.getElementById("documento"); 
let telefono = document.getElementById("telefono"); 
let mail = document.getElementById("mail");
let domicilio = document.getElementById("domicilio"); 
let provincia = document.getElementById("select-Provincias");
let municipio = document.getElementById("select-Municipios"); 
let cantHuespedes= document.getElementById("cant-huespedes"); 
let cantDias = document.getElementById("cant-dias"); 
let elegirCabana= document.getElementById("numero-cabana"); 
let ocupada;
let listaTablaCabanas;
let selectProvincias;
let selectMunicipios;
const precioPorPersona=3000; //Precio por persona
const porcentajeDias=0.15; //Porcentaje de descuento por cantidad de días, se aplica si supera los 6 días de estadía.
const porcentajePersonas=0.10; //Porcentaje de descuento por cantidad de huespedes, se aplica si superan los 3 huespedes.

//ARRAYS
const listaHuespedes = [];
const listaCabanas = [];
let listaCabanasServicios = [];

//Evento-Cuando la ventana está cargada
window.onload=()=>{
    listaTablaCabanas=document.getElementById("tablabodyCabanasServicios");
    selectProvincias=document.getElementById("select-Provincias");
    obtenerCabanasJson();
    obtenerProvincias();
    obtenerCabanasSelect();
    muestraCabanasEstados();
};

 document.getElementById("select-Provincias").addEventListener("change",e => {
     selectMunicipios=document.getElementById("select-Municipios");
     selectMunicipios.innerHTML="";
     selectMunicipios.innerHTML+=`
     <option value="">--Seleccione un municipio--</option>`; 
     obtenerMunicipio(e.target.value);
 })


 //Valida los campos del formulario con librería Just-validate.
const validation = new JustValidate('#formulario', {
    errorFieldCssClass: 'is-invalid',
});
validation
    .addField('#nombre', [
        {
            rule: 'required',
            errorMessage: 'Debe completar el nombre!',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Nombre ingresado muy corto!',
        },
    ])
    .addField('#apellido', [
        {
            rule: 'required',
            errorMessage: 'Debe completar el apellido!',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Apellido ingresado muy corto!',
        },
    ])
    .addField('#documento', [
        {
            rule: 'required',
            errorMessage: 'Debe completar el documento!',
        },
        {
            rule: 'minLength',
            value: 8,
            errorMessage: 'El documento debe tener un mínimo de 8 números!',
        },
    ])
    .addField('#telefono', [
        {
            rule: 'required',
            errorMessage: 'Debe completar el teléfono!',
        },
        {
            rule: 'minLength',
            value: 8,
            errorMessage: 'El teléfono debe tener un mínimo de 8 números!',
        },
    ])
    .addField('#mail', [
        {
            rule: 'required',
            errorMessage: 'Debe completar una dirección de mail!',
        },
        {
            rule: 'email',
            errorMessage: 'Email invalido!',
        },
    ])
    .addField('#domicilio', [
        {
            rule: 'required',
            errorMessage: 'Debe completar el domicilio!',
        },
        {
            rule: 'minLength',
            value: 5,
            errorMessage: 'Domicilio ingresado muy corto!',
        },
    ])
    .addField('#select-Provincias', [
        {
          rule: 'required',
          errorMessage: 'Debe seleccionar una provincia!',
        },
    ])    
    .addField('#select-Municipios', [
        {
          rule: 'required',
          errorMessage: 'Debe seleccionar un municipio!',
        },
    ])   
    .addField('#cant-huespedes', [
        {
            rule: 'required',
            errorMessage: 'Debe completar la cantidad de huespedes!',
        },
    ])
    .addField('#cant-huespedes', [
        {
            rule: 'required',
            errorMessage: 'Debe completar la cantidad de huespedes!',
        },
        {
            rule: 'maxNumber',
            value: 10,
            errorMessage: 'No se puede reservar para más de 10 huespedes!',
        },
    ])
    .addField('#cant-dias', [
        {
            rule: 'required',
            errorMessage: 'Debe completar la cantidad de días!',
        },
    ])
    .addField('#numero-cabana', [
        {
            rule: 'required',
            errorMessage: 'Debe seleccionar el número de cabaña!',
        },
    ])
.onSuccess((event) => {
    //Si los datos son correctos ingresa los datos de la reserva.
    ingresarReserva();
  });


//CLASES
class Huesped {
    constructor(nombre,apellido,documento,telefono,mail,domicilio,provincia,municipio,totHuespedes,totDias,cabanaReservada){
        this.nombre=nombre;
        this.apellido=apellido;
        this.documento=documento;
        this.telefono=telefono;
        this.mail=mail;
        this.domicilio=domicilio;
        this.provincia=provincia;
        this.municipio=municipio;
        this.cantHuespedes=totHuespedes;
        this.cantDias=totDias
        this.cabanaReservada=cabanaReservada;
    } 
}

class Cabana {
    constructor(idCabana,libre){
        this.idCabana=idCabana;
        this.estado=libre;
    }
}


//llena el array de cabañas
listaCabanas.push(new Cabana(1,"libre"))
listaCabanas.push(new Cabana(2,"libre"))
listaCabanas.push(new Cabana(3,"libre"))
listaCabanas.push(new Cabana(4,"libre"))
listaCabanas.push(new Cabana(5,"libre"))
listaCabanas.push(new Cabana(6,"libre"))

//Recupera los datos de las reservas del localStorage
if(localStorage.getItem("listaHuespedes")!=null){
    const huespedStorage=JSON.parse(localStorage.getItem("listaHuespedes"));
    for (const hRecuperado of huespedStorage) {
        listaHuespedes.push(new Huesped(hRecuperado.nombre,hRecuperado.apellido,hRecuperado.documento,hRecuperado.telefono,hRecuperado.mail,hRecuperado.domicilio,hRecuperado.provincia,hRecuperado.municipio,
            hRecuperado.cantHuespedes,hRecuperado.cantDias,hRecuperado.cabanaReservada));

            //Verifica si las cabañas ya se encuentran reservadas
            for (const cabana of listaCabanas) {

                const {idCabana} = cabana;
                if(idCabana==hRecuperado.cabanaReservada){
                    cabana.estado="ocupada";
                }
            }
    }
     
    //Carga los datos de las reservas en la tabla
     for (const huesped of listaHuespedes) {
         document.getElementById("tablabody").innerHTML+=`
         <tr id="fila${huesped.cabanaReservada}">
             <td>${huesped.cabanaReservada}</td>
             <td>${huesped.nombre.toUpperCase()+' '+huesped.apellido.toUpperCase()}</td>
             <td>${huesped.documento}</td>
             <td>${huesped.cantHuespedes}</td>
             <td>${huesped.cantDias}</td>
             <td><button class="btn btn-light" onclick="eliminarReserva(${huesped.cabanaReservada})"><img src="../assets/trash.svg"></button></td>
         </tr>
          `;
     }
}


//Eventos de botones

//botonLimpiar ejecuta la funcion limpiarFormulario
let botonLimpiar = document.getElementById("botonLimpiar");
botonLimpiar.addEventListener("click",limpiarFormulario);

//botonCalcular ejecuta la funcion imprimeTotales
let botonCalcular = document.getElementById("botonCalcular");
botonCalcular.addEventListener("click",simulaTotalEstadia);



//FUNCIONES

//Calcula el precio por estadia de acuerdo a la cantidad de huespedes
function precioPorEstadia(cantHuesp,cantDias,precioPorPers){
    return ((cantHuesp*precioPorPers)*cantDias);
}

//Calcula el descuento si se alquila por más de 6 días.
function descPorDias(total,porcentaje){
    return total*porcentaje;
}

//Calcula el descuento si son más de 3 huespedes 
function descPorPersonas(total,porcentaje){
    return total*porcentaje;
}

//Calcula el total de la estadía con los descuentos.
function calcularTotalEstadia(...numeros){
    return numeros.reduce((acc,n)=>acc-n,totalSinDescuento);
}

//funcion que muestra el estado de las cabañas libre u ocupada.
function muestraCabanasEstados(){
    document.getElementById("tablabodyCabanas").innerHTML="";
    let estadoColor;
    for (const cabana of listaCabanas) {
        cabana.estado === "libre" ? estadoColor ="bg-success" : estadoColor ="bg-danger";
        document.getElementById("tablabodyCabanas").innerHTML+=`
            <tr class="${estadoColor}">
                <td>${cabana.idCabana}</td>
                <td>${cabana.estado.toUpperCase()}</td>
            </tr>
        `;
    }
}

//funcion para obtener los números de cabañas
function obtenerCabanasSelect(){
    for (const cabana of listaCabanas) {
        document.getElementById("numero-cabana").innerHTML+=`
        <option value=${cabana.idCabana}>${cabana.idCabana}</option>
    `; 
    }
}

//funcion para eliminar una reserva
function eliminarReserva(id) {
    let indice =listaHuespedes.findIndex(h => h.cabanaReservada==id);
    listaHuespedes.splice(indice,1);
    let fila = document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);
    localStorage.setItem("listaHuespedes",JSON.stringify(listaHuespedes));

    for (const cabana of listaCabanas) {
        if(cabana.idCabana==id){
            cabana.estado="libre";
        }
    }

    Swal.fire({
        text:"Se ha eliminado la reserva de la cabaña "+id,
        icon:"success"
    });

    muestraCabanasEstados();

}


//funcion para cargar el estado de las cabañas
function cargarCabanas(){
    for(const cab of listaCabanasServicios){
        listaTablaCabanas.innerHTML+=`
        <tr>
            <td>${cab.idCabana}</td>
            <td>${cab.habitaciones}</td>
            <td>${cab.cocina.toUpperCase()}</td>
            <td>${cab.cochera.toUpperCase()}</td>
        </tr>
        `; 
    }
}

//funcion para cargar las provincias
function cargarProvincias(){
     for(const prov of listaProvincias.provincias){
        selectProvincias.innerHTML+=`
             <option value=${prov.nombre}>${prov.nombre}</option>
         `; 
     }
}

//funcion para cargar los municipios
function cargarMunicipios(){  
    for(const muni of listaMunicipios.municipios){
        selectMunicipios.innerHTML+=`
            <option value=${muni.id}>${muni.nombre}</option>
        `; 
    }
}

//Valida los campos cant-huespedes y cant-dias para simular el total por estadía
function simulaTotalEstadia(){
    cantHuespedes = document.getElementById("cant-huespedes");
    cantDias = document.getElementById("cant-dias");
    if((cantHuespedes.value==0) || (cantHuespedes.value==null)){
        Swal.fire({
            text: "Debe completar la cantidad de huespedes para la simulación.",
            icon: "warning"
        });
    }else if((cantDias.value==0) || (cantDias.value==null)){
        Swal.fire({
            text: "Debe completar la cantidad de días para la simulación.",
            icon: "warning"
        });
    }else{
        imprimeTotales();
    }
}

//Imprime los totales de descuentos y monto a cobrar.
function imprimeTotales(){
    cantHuespedes =parseInt(document.getElementById("cant-huespedes").value);
    cantDias = parseInt(document.getElementById("cant-dias").value);

    totalSinDescuento = precioPorEstadia(cantHuespedes,cantDias,precioPorPersona);
    document.getElementById("total-sin-desc").value= totalSinDescuento;

    (cantHuespedes>3) ? document.getElementById("desc-huespedes").value = descPorPersonas(totalSinDescuento,porcentajePersonas) : document.getElementById("desc-huespedes").value = 0 ;

    (cantDias>6) ? document.getElementById("desc-dias").value =descPorDias(totalSinDescuento,porcentajeDias) : document.getElementById("desc-dias").value =0; 

    document.getElementById("total").value = calcularTotalEstadia (document.getElementById("desc-dias").value, document.getElementById("desc-huespedes").value) ;

}

//funcion para limpiar el formulario.
function limpiarFormulario(){
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("documento").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("domicilio").value = "";
    document.getElementById("select-Provincias").value="";
    document.getElementById("select-Municipios").value="";
    document.getElementById("cant-huespedes").value = "";
    document.getElementById("cant-dias").value = "";
    document.getElementById("numero-cabana").value="";
    document.getElementById("total-sin-desc").value= "";
    document.getElementById("desc-huespedes").value = "";
    document.getElementById("desc-dias").value = "";
    document.getElementById("total").value = "";

}


//funcion para validar si la cabaña se encuentra libre o existe
function validarCabana(numCabana){

    let cabanaEncontrada=listaCabanas.find((c) => c.idCabana === numCabana);

    cabanaEncontrada ? (cabanaEncontrada.estado=="libre" ? ocupada= true :  ocupada=false ) : ocupada= false;

    return ocupada;
}


//funcion para ingresar la reserva
function ingresarReserva(){
 
    ocupada= true;    
    
    //Carga los valores de los campos del formulario
    nombre=document.getElementById("nombre").value; 
    apellido = document.getElementById("apellido").value; 
    documento = parseInt(document.getElementById("documento").value); 
    telefono = parseInt(document.getElementById("telefono").value); 
    mail = document.getElementById("mail").value;
    domicilio = document.getElementById("domicilio").value; 
    provincia= document.getElementById("select-Provincias").value;
    municipio=document.getElementById("select-Municipios").value;
    cantHuespedes= parseInt(document.getElementById("cant-huespedes").value); 
    cantDias = parseInt(document.getElementById("cant-dias").value); 
    elegirCabana= parseInt(document.getElementById("numero-cabana").value) ; 

    //valida si la cabaña se encuentra ocupada.
    validarCabana(elegirCabana);

    if(ocupada==false){
        //Si la cabaña seleccionada se encuentra ocupada pide ingresar otra.
        Swal.fire({
            text: "La cabaña se encuentra ocupada, seleccione otra.",
            icon: "warning"
        });
    }else{
        //Si la cabaña se encuentra desocupada realiza la reserva.
        let huesped = new Huesped(nombre,apellido,documento,telefono,mail,domicilio,provincia,municipio,cantHuespedes,cantDias,elegirCabana);

        //Ingresa los datos de huesped
        listaHuespedes.push(huesped);
    
        let indice = listaCabanas.findIndex((c) => c.idCabana === elegirCabana);

        if(indice != -1){
            listaCabanas[indice].estado = "ocupada"

            Swal.fire({
            text:"Se ha reservado la cabaña "+listaCabanas[indice].idCabana,
            icon:"success"
            });

            document.getElementById("tablabody").innerHTML+=`
            <tr id="fila${huesped.cabanaReservada}">
                <td>${huesped.cabanaReservada}</td>
                <td>${huesped.nombre.toUpperCase()+' '+huesped.apellido.toUpperCase()}</td>
                <td>${huesped.documento}</td>
                <td>${huesped.cantHuespedes}</td>
                <td>${huesped.cantDias}</td>
                <td><button class="btn btn-light" onclick="eliminarReserva(${huesped.cabanaReservada})"><img src="../assets/trash.svg"></button></td>
            </tr>
            `;
    
            //Muestras el estado de las cabañasS
            muestraCabanasEstados();

            //Carga los datos de la reserva en el localStorage
            localStorage.setItem("listaHuespedes",JSON.stringify(listaHuespedes));

            imprimeTotales(huesped.cantHuespedes,huesped.cantDias);
        }else{
            Swal.fire({
                text: "Debe completar los datos.",
                icon: "warning"
            });
        }  


    }
    
}

//llena el array de cabañas con el JSON cabanas.json
async function obtenerCabanasJson(){
    const URLJSON= "/cabanas.json" 
    const respuesta=await  fetch(URLJSON)
    const data=await respuesta.json()
    listaCabanasServicios = data;
    cargarCabanas();
}

//Obtiene provincias de una API
async function obtenerProvincias(){
    const URLJSON= "https://apis.datos.gob.ar/georef/api/provincias" 
    const respuesta=await  fetch(URLJSON)
    const data=await respuesta.json()
    listaProvincias = data;
    cargarProvincias();
}


//Obtiene los municipios de la provincia seleccionada de una API
async function obtenerMunicipio(provincia){
    const URLJSON= `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&max=150` 
    const respuesta=await  fetch(URLJSON)
    const data=await respuesta.json()
    listaMunicipios = data;
    cargarMunicipios();
}




