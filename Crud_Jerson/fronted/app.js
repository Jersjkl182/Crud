// Función que consulta todos los registros en el servidor y muestra la información en la tabla
function consulta_general() {
    let url = "http://127.0.0.1:5000/";  // URL del servidor donde se hace la consulta
  
    // Realiza una solicitud GET a la API para obtener todos los datos
    fetch(url)
        .then(response => response.json())  // Convierte la respuesta a formato JSON
        .then(data => visualizar(data))  // Pasa los datos a la función visualizar() para mostrarlos
        .catch(error => console.log(error));  // Si hay un error en la solicitud, lo muestra en la consola
  
    // Función que recibe los datos y los muestra en la tabla HTML
    const visualizar = (data) => {
        console.log(data);  // Muestra los datos en la consola (para depuración)
        let b = '';  // Variable para almacenar el contenido HTML que representará cada fila de la tabla
  
        // Itera sobre cada registro de la respuesta
        for (let i = 0; i < data.baul.length; i++) {
            console.log(data.baul[i].Plataforma);  // Muestra la plataforma en la consola
            console.log(data.baul[i].usuario);  // Muestra el usuario en la consola
            console.log(data.baul[i].clave);  // Muestra la contraseña en la consola
  
            // Construye una fila de tabla para cada registro
            b += `<tr>
                    <td>${data.baul[i].id_baul}</td>
                    <td>${data.baul[i].Plataforma}</td>
                    <td>${data.baul[i].usuario}</td>
                    <td>${data.baul[i].clave}</td>
                    <td>
                        <button type='button' class='btn btn-info' onclick="location.href='edit.html?variable1=${data.baul[i].id_baul}'">
                            <img src='img/editar.png' height='25' width='25'/>
                        </button>
                        <button type='button' class='btn btn-warning' onclick="eliminar(${data.baul[i].id_baul})">
                            <img src='img/borrar.png' height='25' width='25'/>
                        </button>
                    </td>
                  </tr>`;
        }
        
        // Inserta el contenido generado en el elemento con id "data" (probablemente un tbody de una tabla)
        document.getElementById('data').innerHTML = b;
    };
  }
  
  // Función que elimina un registro específico basado en su id
  function eliminar(id) {
    let url = "http://127.0.0.1:5000/eliminar/" + id;  // Construye la URL para la eliminación
  
    // Realiza una solicitud DELETE a la API para eliminar el registro con el id proporcionado
    fetch(url, {
        method: 'DELETE',  // Indica que la solicitud es de tipo DELETE
    })
    .then(response => response.json())  // Convierte la respuesta en formato JSON
    .then(res => visualizar(res))  // Llama a la función visualizar() para actualizar la vista con los nuevos datos
    .catch(error => console.error("Error:", error));  // Muestra cualquier error en la consola
  
    // Función que muestra una notificación después de eliminar el registro
    const visualizar = (res) => {
        // Muestra un mensaje de éxito usando una librería como SweetAlert
        swal("Mensaje", "Registro " + res.mensaje + " exitosamente", "success")
        .then(() => {
            window.location.reload();  // Recarga la página para reflejar los cambios
        });
    };
  }
  
  // Función para registrar un nuevo registro en la base de datos
  function registrar() {
    let url = "http://127.0.0.1:5000/registro/";  // URL de la API para el registro
  
    // Obtiene los valores de los campos de entrada en el formulario
    let plata = document.getElementById("plataforma").value;
    let usua = document.getElementById("usuario").value;
    let clave = document.getElementById("clave").value;
  
    // Crea un objeto con los datos que se enviarán en el cuerpo de la solicitud
    let data = {
        "plataforma": plata,
        "usuario": usua,
        "clave": clave
    };
    console.log(data);  // Muestra los datos en la consola para depuración
  
    // Realiza una solicitud POST a la API para agregar el nuevo registro
    fetch(url, {
        method: "POST",  // Método HTTP POST para insertar un nuevo registro
        body: JSON.stringify(data),  // Convierte el objeto 'data' a formato JSON
        headers: {
            "Content-Type": "application/json",  // Especifica que el cuerpo de la solicitud es en formato JSON
        },
    })
    .then((res) => res.json())  // Convierte la respuesta en formato JSON
    .then((response) => visualizar(response))  // Pasa la respuesta a la función visualizar() para mostrar el resultado
    .catch((error) => console.error("Error:", error));  // Muestra cualquier error en la consola
  
    // Función que muestra una notificación después de registrar un nuevo registro
    const visualizar = (response) => {
        console.log("Success:", response);  // Muestra la respuesta en la consola
        if (response.mensaje === "Error") {  // Si la respuesta indica un error
            swal("Mensaje", "Error en el registro", "error");  // Muestra un mensaje de error
        } else {
            swal("Mensaje", "Registro agregado exitosamente", "success");  // Muestra un mensaje de éxito
        }
    };
  }
  
  // Función para obtener los datos de un registro individual basado en su id
  function consulta_individual(id) {
    let url = "http://127.0.0.1:5000/consulta_individual/" + id;  // Construye la URL con el id del registro
  
    // Realiza una solicitud GET a la API para obtener un solo registro
    fetch(url)
        .then(response => response.json())  // Convierte la respuesta en formato JSON
        .then(data => visualizar(data))  // Pasa los datos a la función visualizar() para mostrarlos
        .catch(error => console.log(error));  // Muestra cualquier error en la consola
  
    // Función que llena el formulario con los datos del registro consultado
    const visualizar = (data) => {
        console.log(data);  // Muestra los datos en la consola para depuración
  
        // Llena los campos del formulario con los valores obtenidos de la respuesta
        document.getElementById("plataforma").value = data.baul.Plataforma;
        document.getElementById("usuario").value = data.baul.usuario;
        document.getElementById("clave").value = data.baul.clave;
    };
  }
  
  // Función para actualizar un registro específico basado en su id
  function modificar(id) {
    let url = "http://127.0.0.1:5000/actualizar/" + id;  // Construye la URL con el id del registro
  
    // Obtiene los valores de los campos del formulario que se quieren actualizar
    let plat = document.getElementById("plataforma").value;
    let usua = document.getElementById("usuario").value;
    let clav = document.getElementById("clave").value;
  
    // Crea un objeto con los datos actualizados
    let data = {
        "plataforma": plat,
        "usuario": usua,
        "clave": clav
    };
  
    console.log(data);  // Muestra los datos en la consola para depuración
  
    // Realiza una solicitud PUT a la API para actualizar el registro
    fetch(url, {
        method: "PUT",  // Método HTTP PUT para actualizar un registro existente
        body: JSON.stringify(data),  // Convierte el objeto 'data' a formato JSON
        headers: {
            "Content-Type": "application/json",  // Especifica que el cuerpo de la solicitud es en formato JSON
        },
    })
    .then((res) => res.json())  // Convierte la respuesta en formato JSON
    .then((response) => visualizar(response))  // Pasa la respuesta a la función visualizar() para mostrar el resultado
    .catch((error) => console.error("Error:", error));  // Muestra cualquier error en la consola
  
    // Función que muestra una notificación después de actualizar el registro
    const visualizar = (response) => {
        console.log("Success:", response);  // Muestra la respuesta en la consola
        if (response.mensaje === "Error") {  // Si la respuesta indica un error
            swal("Mensaje", "Error en la actualización", "error");  // Muestra un mensaje de error
        } 
        else {
            swal("Mensaje", "Registro actualizado exitosamente", "success");  // Muestra un mensaje de éxito
        }
    };
  }
  