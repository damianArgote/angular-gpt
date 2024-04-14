import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-assistant-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent
  ],
  templateUrl: './assistantPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssistantPageComponent implements OnInit {


  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public threadId = signal<string|undefined>(undefined)

  ngOnInit(): void {
    this.openAiService.createThread()
    .subscribe(id =>{
      this.threadId.set(id);
    })
  }

  handleMessage(prompt: string){

    this.isLoading.set(true);
    this.messages.update(prev => [
      ...prev,
      {
        isGpt:false,
        text:prompt
      }
    ]);

    this.openAiService.postQuestion(this.threadId()!,prompt)
    .subscribe(replies =>{


      this.isLoading.set(false);
      const currentMessages = new Set(this.messages().map((msg) => msg.text));

      for (const reply of replies) {
        for (const message of reply.content) {

          if (!currentMessages.has(message)){
            this.messages.update(prev =>[
              ...prev,
              {
                isGpt:reply.role === 'assistant',
                text:message
              }
            ])
          }


        }
      }

    })

  }

}
