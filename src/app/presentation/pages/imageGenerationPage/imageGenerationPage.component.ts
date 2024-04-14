import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-generation-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './imageGenerationPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageGenerationPageComponent {

  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string){

    this.isLoading.set(true);

    this.messages.update(prev => [
      ...prev,
      {
        isGpt:false,
        text:prompt
      }
    ]);

    this.openAiService.imageGeneration(prompt)
    .subscribe(resp =>{
      if(!resp) return;
      this.isLoading.set(false);
      this.messages.update(prev =>[
        ...prev,
        {
          isGpt:true,
          text:resp.alt,
          imageInfo: resp
        }
      ])

    })

  }

  /* handleMessageWithFile({prompt,file}: TextMessageEvent){
    console.log({prompt,file});

  }

  handleMessageWithSelect(event: TextMessageBoxEvent){
    console.log(event);

  } */
}
