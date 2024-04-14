import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMessageEvent, TextMessageBoxEvent, GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-chat-template',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './chatTemplate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatTemplateComponent {

  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage(texto: string){
    console.log(texto);

  }

  /* handleMessageWithFile({prompt,file}: TextMessageEvent){
    console.log({prompt,file});

  }

  handleMessageWithSelect(event: TextMessageBoxEvent){
    console.log(event);

  } */
}
