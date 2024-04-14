import { environment } from "environments/environment"


export const createThreadUseCase = async () =>{

  try {
    const resp = await fetch(`${environment.assistantApi}/create-thread`,{
      method:'POST'
    });

    const {id} = await resp.json();

    return id;
  } catch (error) {
    console.log(error);

    throw new Error('Error creating thread id')
  }

}
