import { environment } from "environments/environment";

//Funcion generadora
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export async function* prosConsStreamUseCase(prompt: string, abortSignal: AbortSignal){

 try {

  const resp = await fetch(`${environment.backendApi}/pros-cons-discusser-stream`,{
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({prompt}),
    signal: abortSignal
  });

  if(!resp.ok) throw new Error('No se pudo hacer la comparación');

  const reader = resp.body?.getReader();

  if(!reader){
    console.log('No se pudo generar el reader');
    throw new Error('No se pudo generar el reader')
  }

  const decoder = new TextDecoder(); //Clase nativa de js

  let text = ''; //se va a ir construyendo con cada pieza que se va leyendo del reader

  while(true){

    const {value, done} = await reader.read();

    if( done ) break; //Si se termino de leer para salir del while

    //esto es un pedazo de la respuesta
    const decodedChunk = decoder.decode(value , {stream:true});

    text +=decodedChunk;

    yield text;


  }

  return text;

 } catch (error) {
  return null;
 }
}
