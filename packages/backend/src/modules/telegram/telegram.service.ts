import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Markup, Telegraf } from 'telegraf';
import { filter, firstValueFrom, Subject, timeout } from 'rxjs';
import { SymbolWithExchange } from '../stocks/domain/symbol-with-exchange';

interface ResponseData {
  chatId: string;
  messageId: number;
  text: string;
}

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private readonly chatId: string;
  private messageResponses = new Subject<ResponseData>();
  private pendingQuestions = new Map<number, string>();
  // Track active questions by chat ID
  private activeChatQuestions = new Map<string, number>();

  constructor(private configService: ConfigService) {
    // Initialize the Telegram bot with the token from your config
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);
    // Get the chat ID from your config
    this.chatId = this.configService.get<string>('MASTER_CHAT_ID');
  }

  onModuleInit() {
    // Command handlers
    this.bot.command('ping', (ctx) => {
      ctx.reply('Backend is up and running!');
    });

    // Handle incoming text messages
    this.bot.on('text', (ctx) => {
      const message = ctx.message;
      const chatId = ctx.chat.id.toString();

      // If this is a reply to a question we asked
      const reply = message.reply_to_message;
      if (reply && reply.message_id) {
        console.log('reply');
        this.messageResponses.next({
          chatId: ctx.chat.id.toString(),
          messageId: reply.message_id,
          text: message.text,
        });
        return;
      }

      const activeQuestionId = this.activeChatQuestions.get(chatId);
      console.log('activeQuestion');
      if (activeQuestionId) {
        this.messageResponses.next({
          chatId,
          messageId: activeQuestionId,
          text: message.text,
        });
        // Clear the active question after handling
        this.activeChatQuestions.delete(chatId);
      }
    });

    this.bot.launch();
  }

  /**
   * Sends a message and returns the message ID
   */
  async sendMessage(message: string): Promise<number> {
    try {
      const sentMessage = await this.bot.telegram.sendMessage(
        this.chatId,
        message,
      );
      return sentMessage.message_id;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      throw error;
    }
  }

  /**
   * Sends a question with optional custom keyboard and waits for a response
   * @param question The question to ask
   * @param keyboard Optional keyboard buttons to display
   * @param timeoutMs Timeout in milliseconds (default: 24 hours)
   * @returns A promise that resolves with the user's response
   */
  async askQuestion(
    question: string,
    keyboard?: string[],
    timeoutMs = 24 * 60 * 60 * 1000,
  ): Promise<string> {
    try {
      // Send the question with keyboard if provided
      let messageId: number;

      if (keyboard && keyboard.length > 0) {
        const sentMessage = await this.bot.telegram.sendMessage(
          this.chatId,
          question,
          {
            reply_markup: Markup.keyboard(keyboard).oneTime().resize()
              .reply_markup,
          },
        );
        messageId = sentMessage.message_id;
      } else {
        messageId = await this.sendMessage(question);
      }

      this.pendingQuestions.set(messageId, question);
      this.activeChatQuestions.set(this.chatId, messageId);

      // Wait for a response to this specific message
      const response = await firstValueFrom(
        this.messageResponses.pipe(
          filter(
            (resp) =>
              resp.messageId === messageId && resp.chatId === this.chatId,
          ),
          timeout(timeoutMs),
        ),
      );

      // Remove custom keyboard after response
      await this.bot.telegram.sendMessage(
        this.chatId,
        'Got it! Thanks for your response.',
        { reply_markup: { remove_keyboard: true } },
      );

      this.pendingQuestions.delete(messageId);
      this.activeChatQuestions.delete(this.chatId);
      return response.text;
    } catch (error) {
      this.activeChatQuestions.delete(this.chatId);
      // Remove keyboard on error as well
      await this.bot.telegram.sendMessage(
        this.chatId,
        'Operation timed out or failed.',
        { reply_markup: { remove_keyboard: true } },
      );

      if (error.name === 'TimeoutError') {
        throw new Error(`Question timed out after ${timeoutMs}ms: ${question}`);
      }
      throw error;
    }
  }

  /**
   * Remind user to create a buy order and wait for confirmation
   */
  async remindBuyOrder(
    symbol: string,
    quantity: number,
    price?: number,
  ): Promise<boolean> {
    const priceText = price ? `at $${price}` : '';
    const question = `🔔 REMINDER: Please create a buy order for ${quantity} ${symbol} ${priceText} in Disnat.`;

    const response = await this.askQuestion(question, ['✅ DONE', '❌ CANCEL']);
    console.log('response', response);
    return response.includes('DONE');
  }

  /**
   * Validate if a buy order was executed and get the actual price
   */
  async validateBuyOrderExecution(
    symbol: SymbolWithExchange,
  ): Promise<number | null> {
    const question = `✅ VALIDATION: Was your buy order for ${symbol.symbol} executed successfully?`;

    const initialResponse = await this.askQuestion(question, [
      '✅ YES',
      '❌ NO',
    ]);

    if (initialResponse.includes('YES')) {
      const priceQuestion = `What was the actual buy price for ${symbol.symbol}?`;
      const priceResponse = await this.askQuestion(priceQuestion);
      const price = parseFloat(priceResponse.trim());
      return isNaN(price) ? null : price;
    }

    return null;
  }

  /**
   * Remind user to create a sell order and wait for confirmation
   */
  async remindSellOrder(
    symbol: string,
    quantity: number,
    price?: number,
  ): Promise<boolean> {
    const priceText = price ? `at $${price}` : '';
    const question = `🔔 REMINDER: Please create a sell order for ${quantity} ${symbol} ${priceText} in Disnat.`;

    const response = await this.askQuestion(question, ['✅ DONE', '❌ CANCEL']);
    return response.includes('DONE');
  }

  async onModuleDestroy() {
    this.bot.stop();
  }
}
