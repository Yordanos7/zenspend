"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  'Can I afford a Birr 1,000 vacation?',
  'How much did I spend on food this month?',
  'Where can I cut expenses?',
  'What are my biggest spending categories?',
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Financial Coach. I can help you understand your spending patterns, plan for goals, and make smarter money decisions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Chat cleared. I'm ready for a fresh start! How can I help you today?",
      },
    ]);
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
  'Can I afford a Birr 1,000 vacation?': 
          "Based on your current finances, let me analyze this for you:\n\n**Current Status:**\n- Remaining budget this month: Birr 3,835\n- Average monthly savings: Birr 1,200\n\n**My Assessment:**\nYes, you can afford a Birr 1,000 vacation! Here's why:\n\n1. Your spending is 12% below average this month\n2. You have consistent income from your salary (Birr 5,500) plus occasional freelance work\n3. You've been meeting your savings goals\n\n**Recommendation:** I'd suggest booking for next month and setting aside Birr 250/week starting now. This way, you'll have the full amount ready without impacting your emergency fund. Would you like me to help you create a vacation savings plan?",
        
        'How much did I spend on food this month?':
          "Here's your food spending breakdown for January:\n\n**Total Food Spending: Birr 455.92**\n\n**Breakdown:**\n- Groceries (Whole Foods, Trader Joe's): Birr 149.47\n- Dining Out: Birr 243.45\n- Coffee & Quick Bites: Birr 63.00\n\n**Compared to Last Month:** You spent 18% more on food this January.\n\n**Insight:** Your dining out expenses are higher than usual. Consider meal prepping 2-3 days a week to bring this down. Would you like me to suggest a weekly food budget?",
        
        'Where can I cut expenses?':
          "I've analyzed your spending patterns. Here are my top recommendations:\n\n**1. Subscriptions (Birr 158/month)**\nYou have 5 active subscriptions. The iCloud storage (Birr 2.99) and gym membership (Birr 49) have low usage based on your patterns.\n\n**2. Transport (Birr 320/month)**\nYou've already reduced this by 16% over 3 months—great job! Consider carpooling once a week for additional Birr 40-60/month savings.\n\n**3. Dining Out (Birr 243/month)**\nThis is 53% of your food budget. Cutting 2 restaurant visits/week could save Birr 150/month.\n\n**Total Potential Savings: Birr 200-250/month**\n\nWhich area would you like to focus on first?",
        
        'What are my biggest spending categories?':
          "Here's your spending breakdown for January:\n\n**1. 🏠 Rent & Housing — Birr 1,800 (42%)**\nThis is your largest fixed expense. It's within the recommended 30-35% for your income, so you're doing well here.\n\n**2. 🍔 Food & Dining — Birr 455 (11%)**\nSlightly higher than last month. Most of this is dining out.\n\n**3. 🚗 Transport — Birr 320 (8%)**\nTrending down—you've saved Birr 80 compared to 3 months ago.\n\n**4. 💡 Utilities — Birr 204 (5%)**\nNormal for this time of year.\n\n**5. 🛍️ Shopping — Birr 203 (5%)**\nMostly Amazon and Target purchases.\n\nWould you like detailed advice on any of these categories?",
      };

      const response = responses[text] || 
        "I understand you're asking about your finances. Based on your current data:\n\n- Your total spending this month is Birr 2,514\n- You have Birr 3,835 remaining in your budget\n- You're on track with your financial goals\n\nIs there something specific you'd like me to analyze or help you plan for?";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent text-accent-foreground shadow-sm">
                <Bot className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Financial Coach</h1>
                <p className="text-muted-foreground">Ask me anything about your finances</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm',
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-muted text-foreground rounded-bl-sm'
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <span key={i} className="font-bold">{part}</span> : part
                      )}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1 h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    className="px-4 py-2 rounded-lg bg-muted/50 text-sm hover:bg-muted hover:text-foreground text-muted-foreground transition-all border border-transparent hover:border-border"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your finances..."
                className="flex-1 h-12 px-4 rounded-xl border border-input bg-background/50 focus:bg-background hover:border-accent/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/50"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-sm',
                  input.trim() && !isTyping
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
