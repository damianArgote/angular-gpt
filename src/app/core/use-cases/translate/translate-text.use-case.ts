import type { TranslateResponse } from "@interfaces/translate.response";
import { environment } from "environments/environment";


export const translateTextUseCase = async (prompt:string,lang:string) =>{
  try {

    const resp = await fetch(`${environment.backendApi}/translate`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({prompt,lang})
    });

    if(!resp.ok) throw new Error('No se pudo realizar la traducción');

    const {message} = await resp.json() as TranslateResponse;

    return{
      ok:true,
      message
    }

  } catch (error) {
    console.log(error);
    return {
      ok:false,
      message:'No se pudo realizar la traducción'
    }
  }
};
