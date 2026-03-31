import React, { useState, useRef, useEffect } from 'react';
import { CopilotEngine, CopilotContext } from '../../lib/copilotCore';
import './copilot.css';

const i18n = {
  en: {
    title: 'AI Copilot',
    chatTab: 'Chat',
    commandTab: 'Commands',
    placeholder: 'Ask Copilot something...',
    suggestions: ['Explain this score', 'Suggest decision', 'Draft email', 'Summarize customer'],
    commands: [
      { icon: '📊', label: 'Explain Score', prompt: 'Explain the credit score' },
      { icon: '⚖️', label: 'Suggest Decision', prompt: 'Suggest a decision' },
      { icon: '✉️', label: 'Draft Email', prompt: 'Draft a customer email' },
      { icon: '👤', label: 'Summarize Customer', prompt: 'Summarize customer profile' },
    ],
    contextLabel: 'Context',
  },
  ar: {
    title: 'المساعد الذكي',
    chatTab: 'محادثة',
    commandTab: 'أوامر',
    placeholder: 'اسأل المساعد...',
    suggestions: ['شرح التقييم', 'اقتراح القرار', 'صياغة بريد', 'ملخص العميل'],
    commands: [
      { icon: '📊', label: 'شرح التقييم', prompt: 'شرح تقييم الائتمان' },
      { icon: '⚖️', label: 'اقتراح القرار', prompt: 'اقتراح قرار' },
      { icon: '✉️', label: 'صياغة بريد', prompt: 'صياغة رسالة للعميل' },
      { icon: '👤', label: 'ملخص العميل', prompt: 'ملخص ملف العميل' },
    ],
    contextLabel: 'السياق',
  }
};

export const CopilotUI = ({ lang = 'en', context = {}, payload = {}, isPulsing = false, insights = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const t = i18n[lang] || i18n.en;

  // Sync context whenever it changes
  useEffect(() => {
    CopilotContext.set(context);
  }, [context]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { role: 'user', text: trimmed, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate async engine call with realistic delay
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const result = await CopilotEngine.process(trimmed, lang, payload);
    setIsTyping(false);

    const assistantMsg = { role: 'assistant', text: result.text, confidence: result.confidence, id: Date.now() + 1 };
    setMessages(prev => [...prev, assistantMsg]);
  };

  const handleInsightClick = (insight) => {
    setIsOpen(true);
    sendMessage(lang === 'ar' ? `اشرح ${insight.label.ar}` : `Explain ${insight.label.en}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const activeCtx = CopilotContext.get();

  return (
    <>
      {/* Proactive Floating Action Button with Pulse & Badge */}
      <div className="copilot-fab-wrapper" style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000 }}>
        {isPulsing && !isOpen && (
          <div className="insight-chip" onClick={() => setIsOpen(true)}>
            {insights.length}
          </div>
        )}
        <button
          className={`copilot-fab ${isOpen ? 'open' : ''} ${isPulsing && !isOpen ? 'pulse-active' : ''}`}
          onClick={() => setIsOpen(p => !p)}
          aria-label={isOpen ? 'Close Copilot' : 'Open Copilot'}
          title="AI Copilot"
          style={{ position: 'relative' }}
        >
          {isOpen ? '✕' : isPulsing ? '✨' : '🤖'}
        </button>
      </div>

      {/* Side Panel */}
      <div className={`copilot-panel ${isOpen ? 'open' : ''}`} role="dialog" aria-label="AI Copilot Panel">

        {/* Header */}
        <div className="copilot-header">
          <div className="copilot-header-title">
            <div className="copilot-avatar">🤖</div>
            <span>{t.title}</span>
          </div>
          <button className="copilot-close-btn" onClick={() => setIsOpen(false)} aria-label="Close">✕</button>
        </div>

        {/* Proactive Insights Section (if pulsing) */}
        {insights.length > 0 && (
          <div className="copilot-proactive-alerts" style={{ padding: '8px 16px', background: 'rgba(244, 63, 94, 0.1)', borderBottom: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-risk)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-risk)', display: 'inline-block' }} />
              {lang === 'ar' ? 'تنبيهات استباقية' : 'Proactive Insights'}
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {insights.map((insight, idx) => (
                <button 
                  key={idx} 
                  className="chip chip-risk" 
                  onClick={() => handleInsightClick(insight)}
                  style={{ fontSize: '10px', whiteSpace: 'nowrap', background: 'var(--accent-risk)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '12px', cursor: 'pointer' }}
                >
                  {insight.label[lang]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Context Bar */}
        {(activeCtx.customerName || context.country) && (
          <div className="copilot-context-bar">
            <span>👤 {activeCtx.customerName || (lang === 'ar' ? 'مقدم الطلب' : 'Applicant')}</span>
            {payload.score && <span>📊 {payload.score}</span>}
            <span>🌍 {context.country || activeCtx.country}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="copilot-tabs">
          <button className={`copilot-tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>{t.chatTab}</button>
          <button className={`copilot-tab ${activeTab === 'command' ? 'active' : ''}`} onClick={() => setActiveTab('command')}>{t.commandTab}</button>
        </div>

        {/* Body — Chat Mode */}
        {activeTab === 'chat' && (
          <div className="copilot-body">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '40px', fontSize: '13px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>✨</div>
                <div>{lang === 'ar' ? 'كيف يمكنني مساعدتك؟' : 'How can I assist you today?'}</div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`copilot-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                )}
                <div className="copilot-bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="copilot-message assistant">
                <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                <div className="copilot-typing">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Body — Command Mode */}
        {activeTab === 'command' && (
          <div className="copilot-body">
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
              {lang === 'ar' ? 'اختر إجراءً سريعاً أدناه:' : 'Select a quick action below:'}
            </p>
            <div className="copilot-commands">
              {t.commands.map((cmd, i) => (
                <button
                  key={i}
                  className="copilot-command-btn"
                  onClick={() => { setActiveTab('chat'); sendMessage(cmd.prompt); }}
                >
                  <span className="copilot-command-icon">{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto-suggestions */}
        {activeTab === 'chat' && (
          <div className="copilot-suggestions">
            {t.suggestions.map((s, i) => (
              <button key={i} className="copilot-suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Footer Input */}
        {activeTab === 'chat' && (
          <div className="copilot-footer">
            <input
              ref={inputRef}
              className="copilot-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              aria-label="Copilot input"
              disabled={isTyping}
            />
            <button className="copilot-send-btn" onClick={() => sendMessage(inputValue)} disabled={isTyping} aria-label="Send">➤</button>
          </div>
        )}
      </div>
    </>
  );
};
