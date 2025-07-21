import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chatbox',
  imports: [CommonModule,FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
  isExpanded = false;
  isDarkMode = false;
  newMessage = '';
  isWaitingForResponse = false;
  messages: any[] = [
    {
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ];

  toggleChat(): void {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private ai: ChatbotService, private auth: AuthService) { }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim() && !this.isWaitingForResponse) {
      // Add user message
      this.messages.push({
        text: this.newMessage,
        isUser: true,
        timestamp: new Date()
      });

      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isWaitingForResponse = true;

      try {
        // Simulate bot typing indicator
        const typingMessage = {
          text: '...',
          isUser: false,
          isTyping: true,
          timestamp: new Date()
        };
        this.messages.push(typingMessage);

        // Get bot response (replace with your actual function)
        const botResponse = await this.getBotResponse(userMessage);
        const objectIdRegex = /"([a-f\d]{24})"/g;

        return botResponse.replace(objectIdRegex, (_: any, id: any) => {
          return `<a href="/book-info/${id}/details">View book</a>`;
        });

        // Remove typing indicator
        this.messages = this.messages.filter(m => !m.isTyping);
        
        // Add actual response
        this.messages.push({
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error getting bot response:', error);
        this.messages.push({
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date()
        });
      } finally {
        this.isWaitingForResponse = false;
      }

      // Scroll to bottom
      setTimeout(() => {
        const container = document.querySelector('.chatbox-content');
        if (container) container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }

  private async getBotResponse(userMessage: string): Promise<any> {
    try {
      if (!this.auth.isLoggedIn()) {
        return 'Please log in to use the chat feature.';
      }
      const response: any = await firstValueFrom(this.ai.getAIResponse(userMessage));
      return response.message  || 'No response from AI';
    } catch (error) {
      return 'Error getting response from AI';
    }
  }
}