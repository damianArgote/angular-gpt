import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GptMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { TextMessageBoxSelectComponent } from '../../components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GptMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {

  public messages =  signal<Message[]>([])
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public abortSignal = new AbortController()

  public languages = signal([
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);


  handleMessageWithSelect(event: TextMessageBoxEvent){
    const message = `Traduce a ${event.selectedOption}: ${event.prompt} `
    this.isLoading.set(true);
    this.messages.update( prev => [
      ...prev,
      {
        isGpt:false,
        text:message,
      }
    ]);

    this.openAiService.translateText(event.prompt, event.selectedOption)
    .subscribe(resp =>{
      this.isLoading.set(false);
      this.messages.update(prev =>[
        ...prev,
        {
          isGpt:true,
          text:resp.message
        }
      ])
    })

  }

  async handleMessageStreamWithSelect(event: TextMessageBoxEvent){
    const message = `Traduce a ${event.selectedOption}: ${event.prompt} `

    this.abortSignal.abort(); //abortamos la señal anterior
    this.abortSignal = new AbortController(); //creamos una nueva
    this.isLoading.set(true);
    this.messages.update( prev => [
      ...prev,
      {
        isGpt:false,
        text:message,
      },
      {
        isGpt:true,
        text:'...'
      }
    ]);

    const stream = this.openAiService.translateTextStream(event.prompt, event.selectedOption,this.abortSignal.signal);

    this.isLoading.set(false);

    for await( const text of stream){
      console.log(text);

      this.handleStreamResponse(text);
    }

  }

  handleStreamResponse(message: string){

    this.messages().pop(); //saco el ultimo mensaje

    const messages = this.messages();

    this.messages.set([...messages, {
      isGpt:true,
      text: message
    }])
  }
}
