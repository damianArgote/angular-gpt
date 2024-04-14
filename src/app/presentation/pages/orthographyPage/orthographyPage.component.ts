import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  GptMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  TextMessageBoxFileComponent,
  TextMessageEvent,
  TextMessageBoxSelectComponent,
  TextMessageBoxEvent,
  GptMessageOrthographyComponent
} from '@components/index';
import { Message } from '@interfaces/index';
import { OpenAiService } from 'app/presentation/services/openai.service';


@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    GptMessageComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {

  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string){

    this.isLoading.set(true);

    this.messages.update((prev) =>[
      ...prev,
      {
        isGpt:false,
        text:prompt
      }
    ])

    this.openAiService.checkOrthography(prompt)
    .subscribe( resp =>{
      this.isLoading.set(false)

      this.messages.update( (prev) =>[
        ...prev,
        {
          isGpt:true,
          text:resp.message,
          info:resp
        }
      ])

    })
  }

}
