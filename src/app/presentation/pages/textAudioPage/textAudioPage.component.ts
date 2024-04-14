import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './textAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextAudioPageComponent {

  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);


  handleMessageWithSelect({selectedOption,prompt}: TextMessageBoxEvent){

    const message = `${selectedOption} - ${prompt}`;

    this.messages.update( prev => [
      ...prev,
      {
        isGpt:false,
        text:message
      }
    ]);

    this.openAiService.textToAudio(prompt,selectedOption)
    .subscribe(({message,audioUrl}) =>{

      this.isLoading.set(false);
      this.messages.update(prev =>[
        ...prev,
        {
          isGpt:true,
          text:message,
          audioUrl:audioUrl
        }
      ])

    })

    this.isLoading.set(true);



  }
}
