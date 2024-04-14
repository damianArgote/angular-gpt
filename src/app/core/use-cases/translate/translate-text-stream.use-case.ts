import { environment } from "environments/environment";

export async function* translateTextStreamUseCase(prompt:string,lang:string, abortSignal:AbortSignal){
  try {

    const resp = await fetch(`${environment.backendApi}/translate-stream`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({prompt,lang}),
      signal: abortSignal
    });

    if(!resp.ok) throw new Error('No se pudo realizar la traducción');

    const reader = resp.body?.getReader();

    if(!reader){
      console.log('No se pudo generar el reader');
      throw new Error('No se pudo generar el reader')
    }

    const decoder = new TextDecoder();
    let text = '';

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
    return null
  }
};
