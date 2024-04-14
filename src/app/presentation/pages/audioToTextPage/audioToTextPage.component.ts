import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TextMessageEvent } from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);



  handleMessageWithFile({prompt,file}: TextMessageEvent){
    console.log({prompt,file});

    const text = prompt ?? file.name ?? 'Traduce el audio';

    this.isLoading.set(true);

    this.messages.update(prev => [
      ...prev,
      {
        isGpt:false,
        text:text
      }
    ]);

    this.openAiService.audioToText(file,text)
    .subscribe( resp => this.handleResponse(resp));

  }


  handleResponse(response: AudioToTextResponse | null){

    this.isLoading.set(false);
    if(!response) return;

    const text = `## Transcripccion:
__Duración__ : ${Math.round(response.duration)} segundos.
## El texto es:
    ${response.text}
    `;

    this.messages.update( prev =>[
      ...prev,
      {
        isGpt:true,
        text:text
      }
    ]);

    for (const segmento of response.segments) {
        const segmentText = `
__De: ${Math.round(segmento.start)} a ${Math.round(segmento.end)} segundos.__
${segmento.text}
        `;

        this.messages.update( prev =>[
          ...prev,
          {
            isGpt:true,
            text:segmentText
          }
        ]);
    }

  }

}
