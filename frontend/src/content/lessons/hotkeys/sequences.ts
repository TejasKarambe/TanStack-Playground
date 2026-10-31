import type { LessonManifest } from '../../types'

export const hotkeysSequencesLesson: LessonManifest = {
  id: 'hotkeys-sequences',
  libraryId: 'hotkeys',
  topicId: 'hotkeys-sequences',
  title: 'TanStack Hotkeys: Shortcuts, Scopes & Command Palettes',
  description: 'Bind global keyboard shortcuts, modifier chords (Cmd/Ctrl + K), and modal-scoped hotkeys with headless priority routing.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://github.com/tanstack/hotkeys',
  learningObjectives: [
    'Register hotkey bindings using useHotkey("ctrl+k", callback).',
    'Handle modifier keys: Control, Command/Meta, Alt/Option, and Shift.',
    'Scope shortcuts to modal dialogs so parent handlers do not conflict.',
    'Construct an interactive Command Palette triggered by keyboard shortcuts.',
  ],
  conceptSections: [
    {
      title: 'Power-User Productivity',
      content:
        'Keyboard shortcuts turn repetitive mouse actions into instant operations. TanStack Hotkeys provides cross-platform normalized key names (e.g. Mod+K resolves to Cmd+K on macOS and Ctrl+K on Windows/Linux) and handles keyboard focus scopes cleanly.',
    },
    {
      title: 'Package Maturity & Verification',
      content:
        'Package: @tanstack/react-hotkeys (Beta). Designed specifically for heavy desktop-style productivity applications, code editors, and command menus.',
    },
  ],
  importantApis: [
    {
      name: 'useHotkey(combo, callback, options)',
      signature: 'useHotkey("mod+k", () => setOpen(true), { preventDefault: true })',
      description: 'Binds a keyboard sequence to a callback with platform normalization.',
    },
  ],
  previewInstructions: 'Press "Ctrl+K" (or Cmd+K) on your keyboard or click the shortcut badge to open the Command Palette. Press "Escape" to dismiss, or press "N" for a new document.',
  expectedResult: 'A responsive keyboard shortcut engine that intercepts modifier sequences and toggles an accessible Command Palette.',
  commonMistakes: [
    {
      mistake: 'Failing to prevent default browser behavior for shortcuts like Ctrl+S or Ctrl+P.',
      fix: 'Use preventDefault: true in hotkey configuration to intercept browser defaults.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is "Mod" in hotkey mapping conventions?',
      answer:
        '"Mod" is a platform-agnostic modifier that automatically maps to Command (⌘) on Apple macOS and Control (Ctrl) on Windows and Linux.',
    },
  ],
  example: {
    id: 'example-hotkeys-sequences',
    title: 'Interactive Command Palette & Modifier Shortcut Hub',
    description: 'Keyboard shortcut bindings with modifier support, modal scoping, and key event visualization.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState, useEffect } from 'react';
import { Keyboard, Search, Sparkles, Plus, Settings, FileText, CheckCircle2, CornerDownLeft } from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [recentKey, setRecentKey] = useState<string>('None');

  // Keyboard shortcut listener (Simulates TanStack Hotkeys useHotkey)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const keyName = \`\${isMod ? 'Mod+' : ''}\${e.altKey ? 'Alt+' : ''}\${e.shiftKey ? 'Shift+' : ''}\${e.key}\`;
      setRecentKey(keyName);

      // Mod+K or / opens command palette
      if ((isMod && e.key?.toLowerCase() === 'k') || (e.key === '/' && !isOpen)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Escape closes palette
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }

      // 'N' triggers new note when modal is closed
      if (e.key?.toLowerCase() === 'n' && !isOpen && !isMod) {
        setLastAction('Created New Document (HotKey: N)');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const runCommand = (action: string) => {
    setLastAction(action);
    setIsOpen(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh', position: 'relative' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={20} color="#a855f7" />
            <span>TanStack Hotkeys: Shortcuts Hub</span>
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Press keys anywhere to test normalized modifier recognition.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>Cmd/Ctrl + K</span>
        </button>
      </header>

      {/* Key Event Telemetry */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
        <div>
          <span style={{ color: '#94a3b8' }}>Last Detected Key Chord: </span>
          <strong style={{ color: '#c084fc', fontFamily: 'monospace', fontSize: '14px' }}>{recentKey}</strong>
        </div>
        <div style={{ color: '#64748b', fontSize: '11px' }}>Normalized by TanStack Hotkeys</div>
      </div>

      {lastAction && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '6px', color: '#065f46', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> Action Executed: <strong>{lastAction}</strong>
        </div>
      )}

      {/* Active Shortcuts Reference Card */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, color: '#334155' }}>Registered Hotkeys</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Toggle Command Palette</span>
            <kbd style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>Mod + K or /</kbd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Create New Document</span>
            <kbd style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>N</kbd>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Dismiss Active Modal</span>
            <kbd style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>Escape</kbd>
          </div>
        </div>
      </div>

      {/* Command Palette Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '60px',
            zIndex: 100,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              width: '440px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #e2e8f0', gap: '8px' }}>
              <Search size={16} color="#64748b" />
              <input
                autoFocus
                placeholder="Type a command or search..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px' }}
              />
              <kbd style={{ fontSize: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '1px 5px', borderRadius: '3px' }}>ESC</kbd>
            </div>

            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Create New Query Mock', icon: Plus, key: 'new' },
                { label: 'Open Workspace Settings', icon: Settings, key: 'settings' },
                { label: 'Export Table Data to CSV', icon: FileText, key: 'export' },
              ].map((cmd) => (
                <button
                  key={cmd.key}
                  onClick={() => runCommand(cmd.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <cmd.icon size={15} color="#7c3aed" />
                    <span>{cmd.label}</span>
                  </div>
                  <CornerDownLeft size={13} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`,
      },
    },
    dependencies: {
      'lucide-react': '^1.65.0',
    },
  },
}

