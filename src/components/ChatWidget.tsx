'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const t = useTranslations('chat');
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = { role: 'user', content: trimmed };
      const historyWithUser = [...messages, userMessage];

      setMessages([...historyWithUser, { role: 'assistant', content: '' }]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyWithUser, locale }),
        });

        if (!res.body) throw new Error('No response body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: assistantText };
            return updated;
          });
        }
      } catch {
        const errorText =
          locale === 'en'
            ? 'Sorry, something went wrong. Please try again.'
            : 'Przepraszam, coś poszło nie tak. Spróbuj ponownie.';
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: errorText };
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, locale],
  );

  const suggestions: string[] = t.raw('suggestions');

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label={t('open')}
          className="fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4332] text-white shadow-lg transition-[transform,bottom] duration-300 ease-in-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8927C]"
          style={{ bottom: '24px' }}
        >
          <MessageCircle size={24} />
          {/* Pulse dot */}
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8927C] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#E8927C]" />
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed right-6 z-50 flex h-[520px] w-[340px] flex-col overflow-hidden rounded-2xl border border-[#1B4332]/10 bg-[#FDF6EC] shadow-2xl transition-[bottom] duration-300 ease-in-out md:w-[380px]"
          style={{ bottom: '24px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#1B4332] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8927C] text-lg leading-none select-none">
                🐻
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{t('title')}</p>
                <p className="text-xs text-white/60">{t('subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t('close')}
              className="rounded p-1 hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-center text-xs text-[#1B4332]/50">{t('welcome')}</p>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="w-full rounded-xl border border-[#1B4332]/20 px-3 py-2 text-left text-sm text-[#1B4332] transition-colors hover:bg-[#1B4332]/5 active:bg-[#1B4332]/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-[#1B4332] text-white'
                      : 'rounded-bl-sm bg-white text-[#1B4332] shadow-sm'
                  }`}
                >
                  {msg.content === '' && isLoading && i === messages.length - 1 ? (
                    <span className="flex items-center gap-1 text-[#1B4332]/40">
                      <span className="animate-bounce [animation-delay:-0.3s]">·</span>
                      <span className="animate-bounce [animation-delay:-0.15s]">·</span>
                      <span className="animate-bounce">·</span>
                    </span>
                  ) : msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-1.5 last:mb-0 space-y-0.5" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-1.5 last:mb-0 space-y-0.5" {...props} />,
                        li: ({ node, ...props }) => <li {...props} />,
                        a: ({ node, ...props }) => <a className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-[#1B4332]/10 bg-white p-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={t('placeholder')}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-[#1B4332]/20 bg-[#FDF6EC] px-3 py-2 text-sm text-[#1B4332] placeholder:text-[#1B4332]/35 focus:border-[#1B4332]/40 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              aria-label={t('send')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8927C] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
