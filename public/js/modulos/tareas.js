import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', (e) =>{
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //request hacia /tareas/:id

            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');
                        
                        actualizarAvance();
                    }
                })
        }
        
        if(e.target.classList.contains('fa-trash')){
            
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            
            Swal.fire({
                title: '¿Deseas borrar esta tarea?',
                text: "Un tarea eliminada no se puede eliminar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                    //enviar el delete por axios
                    axios.delete(url, { params: {idTarea} })
                        .then(function(respuesta){
                            if(respuesta.status === 200){
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                //alerta
                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance();


                            }
                        })
                }

            });
                    
        }

    });


}

export default tareas;