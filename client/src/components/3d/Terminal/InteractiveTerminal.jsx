import { useState, useRef, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────
// Terminal commands — UI-DESIGN.md spec
// Core: help, about, events, team, stats, clear
// Easter eggs: sudo, hack, nvidia-smi, matrix, ls, cd, cat, exit
// ─────────────────────────────────────────

const STATS = {
  members: 150,
  events: 20,
  projects: 10,
  partners: 5,
}

const UPCOMING_EVENTS = [
  { name: 'CUDA Workshop Series', date: '2026-08-15', type: 'workshop' },
  { name: 'DGX H200 Hackathon', date: '2026-09-01', type: 'hackathon' },
  { name: 'LLM Fine-Tuning Masterclass', date: '2026-09-20', type: 'workshop' },
]

const TEAM_MEMBERS = [
  { name: 'Alwin Mathew', role: 'Club Founder & President' },
  { name: 'Vice President', role: 'Research Lead' },
  { name: 'Technical Secretary', role: 'CUDA Engineering' },
  { name: 'Events Director', role: 'Hackathon & Workshops' },
]

function processCommand(cmd) {
  const raw = cmd.trim().toLowerCase()
  const args = raw.split(/\s+/)
  const command = args[0]

  switch (command) {
    case 'help':
      return [
        { text: '', type: 'output' },
        { text: 'Available commands:', type: 'output dim' },
        { text: '  help        Show this help message', type: 'output' },
        { text: '  about       About the NVIDIA SC Club', type: 'output' },
        { text: '  events      List upcoming events', type: 'output' },
        { text: '  team        List team members', type: 'output' },
        { text: '  stats       Show club statistics', type: 'output' },
        { text: '  clear       Clear the terminal', type: 'output' },
        { text: '', type: 'output' },
        { text: 'Fun commands:', type: 'output dim' },
        { text: '  nvidia-smi  GPU utilization report', type: 'output' },
        { text: '  hack        Initiate hacking sequence', type: 'output' },
        { text: '  matrix      Enter the matrix', type: 'output' },
        { text: '  sudo        Try it ;)', type: 'output' },
        { text: '  ls          List files', type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'about':
      return [
        { text: '', type: 'output' },
        { text: '╔══════════════════════════════════════════╗', type: 'output' },
        { text: '║     NVIDIA SUPER COMPUTING CLUB          ║', type: 'output' },
        { text: '║     Galgotias University                 ║', type: 'output' },
        { text: '╚══════════════════════════════════════════╝', type: 'output' },
        { text: '', type: 'output' },
        { text: 'The premier GPU computing student society at', type: 'output white' },
        { text: 'Galgotias University powered by our flagship', type: 'output white' },
        { text: 'NVIDIA DGX H200 supercomputer node.', type: 'output white' },
        { text: '', type: 'output' },
        { text: '  Hardware : NVIDIA DGX H200', type: 'output' },
        { text: '  Memory   : 141GB HBM3e @ 4.8 TB/s', type: 'output' },
        { text: '  Location : Galgotias University, Greater Noida', type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'events':
      return [
        { text: '', type: 'output' },
        { text: '=== UPCOMING EVENTS ===', type: 'output' },
        { text: '', type: 'output' },
        ...UPCOMING_EVENTS.map((e) => ({
          text: `  [${e.type.toUpperCase()}]  ${e.name}  →  ${e.date}`,
          type: 'output',
        })),
        { text: '', type: 'output' },
        { text: `Type 'events --all' for the full calendar.`, type: 'output dim' },
        { text: '', type: 'output' },
      ]

    case 'team':
      return [
        { text: '', type: 'output' },
        { text: '=== EXECUTIVE BOARD ===', type: 'output' },
        { text: '', type: 'output' },
        ...TEAM_MEMBERS.map((m) => ({
          text: `  ${m.name.padEnd(25)} ${m.role}`,
          type: 'output',
        })),
        { text: '', type: 'output' },
      ]

    case 'stats':
      return [
        { text: '', type: 'output' },
        { text: '=== CLUB STATISTICS ===', type: 'output' },
        { text: '', type: 'output' },
        { text: `  Members         ${STATS.members}+`, type: 'output' },
        { text: `  Events Hosted   ${STATS.events}+`, type: 'output' },
        { text: `  Projects        ${STATS.projects}+`, type: 'output' },
        { text: `  Partners        ${STATS.partners}+`, type: 'output' },
        { text: '', type: 'output' },
        { text: '  [████████████████████] 100% Awesome', type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'clear':
      return [{ text: '__CLEAR__', type: 'control' }]

    case 'nvidia-smi':
    case 'gpu':
      return [
        { text: '', type: 'output' },
        { text: '+-----------------------------------------------------------------------------+', type: 'output' },
        { text: '| NVIDIA-SMI 550.90.07    Driver Version: 550.90.07    CUDA Version: 12.4    |', type: 'output' },
        { text: '|-------------------------------+----------------------+----------------------+', type: 'output' },
        { text: '| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |', type: 'output' },
        { text: '| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |', type: 'output' },
        { text: '|===============================+======================+======================|', type: 'output' },
        { text: '|   0  NVIDIA H200 SXM    On  | 00000000:00:1E.0 Off |                    0 |', type: 'output' },
        { text: '| N/A   32C    P0    72W / 700W |  12288MiB / 141568MiB |      0%      Default |', type: 'output' },
        { text: '+-----------------------------------------------------------------------------+', type: 'output' },
        { text: '', type: 'output' },
        { text: '+-----------------------------------------------------------------------------+', type: 'output' },
        { text: '| Processes:                                                                  |', type: 'output' },
        { text: '|  GPU   GI   CI        PID   Type   Process name              GPU Memory    |', type: 'output' },
        { text: '|        ID   ID                                                Usage         |', type: 'output' },
        { text: '|=============================================================================|', type: 'output' },
        { text: '|   0    N/A  N/A     12345    C   python train_llm.py          8192MiB      |', type: 'output' },
        { text: '+-----------------------------------------------------------------------------+', type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'hack':
      return [
        { text: '', type: 'output' },
        { text: 'Initiating hacking sequence...', type: 'output' },
        { text: '', type: 'output' },
        { text: '> Bypassing BIOS security...      [DONE]', type: 'output' },
        { text: '> Injecting CUDA kernels...        [DONE]', type: 'output' },
        { text: '> Overclocking memory bus...       [DONE]', type: 'output' },
        { text: '> Training rogue LLM...            [DONE]', type: 'output' },
        { text: '> Achieving sentience...           [DONE]', type: 'output' },
        { text: '', type: 'output' },
        { text: 'Just kidding. We do real research here :)', type: 'output dim' },
        { text: '', type: 'output' },
      ]

    case 'matrix':
      return [
        { text: '', type: 'output' },
        { text: '01001110 01010110 01001001 01000100', type: 'output' },
        { text: '01001001 01000001 00100000 01000111', type: 'output' },
        { text: '01010000 01010101 00100000 01000011', type: 'output' },
        { text: '01001100 01010101 01000010 00100000', type: 'output' },
        { text: '', type: 'output' },
        { text: 'Wake up, Neo. The Matrix has you...', type: 'output dim' },
        { text: `Decoded: "NVIDIA GPU CLUB"`, type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'sudo':
      return [
        { text: '', type: 'output' },
        { text: '[sudo] password for nvidia-sc:', type: 'output white' },
        { text: 'Sorry, user nvidia-sc is not in the sudoers file.', type: 'output error' },
        { text: 'This incident will be reported.', type: 'output error' },
        { text: '', type: 'output' },
      ]

    case 'ls':
      return [
        { text: '', type: 'output' },
        { text: 'about.md    events/    projects/    team.json    README.md', type: 'output' },
        { text: 'dgx-h200/   cuda-labs/  research/   hackathons/  .nvidia-secret', type: 'output' },
        { text: '', type: 'output' },
      ]

    case 'cd':
      return [
        { text: '', type: 'output' },
        { text: `bash: cd: ${args[1] || '~'}: Permission denied (join the club first!)`, type: 'output error' },
        { text: '', type: 'output' },
      ]

    case 'cat':
      if (args[1] === '.nvidia-secret') {
        return [
          { text: '', type: 'output' },
          { text: '> The real DGX H200 was the friends we trained along the way.', type: 'output' },
          { text: '', type: 'output' },
        ]
      }
      return [
        { text: '', type: 'output' },
        { text: `cat: ${args[1] || 'file'}: No such file or directory`, type: 'output error' },
        { text: '', type: 'output' },
      ]

    case 'exit':
      return [
        { text: '', type: 'output' },
        { text: "There is no escape from GPU computing.", type: 'output' },
        { text: '', type: 'output' },
      ]

    case '':
      return []

    default:
      return [
        { text: '', type: 'output' },
        { text: `nvidia-sc: command not found: ${command}`, type: 'output error' },
        { text: `Type 'help' to see available commands.`, type: 'output dim' },
        { text: '', type: 'output' },
      ]
  }
}

const PROMPT = 'nvidia-sc@website:~$ '
const TYPING_SPEED = 30 // ms per character

const INITIAL_OUTPUT = [
  { text: '╔══════════════════════════════════════════════════════════════╗', type: 'output' },
  { text: '║   nvidia-sc@website                                         ║', type: 'output' },
  { text: '╚══════════════════════════════════════════════════════════════╝', type: 'output' },
  { text: '', type: 'output' },
  { text: "Welcome to the NVIDIA Super Computing Club terminal.", type: 'output white' },
  { text: "Type 'help' to see all commands.", type: 'output dim' },
  { text: '', type: 'output' },
]

export default function InteractiveTerminal() {
  const [lines, setLines] = useState(INITIAL_OUTPUT)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)

  const inputRef = useRef(null)
  const bodyRef = useRef(null)
  const typingRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [lines])

  // Focus input when clicking anywhere in terminal
  const focusInput = () => { if (inputRef.current && !isTyping) inputRef.current.focus() }

  // Typing animation
  const typeOutput = useCallback((outputLines) => {
    setIsTyping(true)
    let lineIdx = 0
    let charIdx = 0

    const type = () => {
      if (lineIdx >= outputLines.length) {
        setIsTyping(false)
        if (inputRef.current) inputRef.current.focus()
        return
      }
      const line = outputLines[lineIdx]
      if (charIdx === 0) {
        setLines((prev) => [...prev, { text: '', type: line.type }])
      }
      if (charIdx < line.text.length) {
        setLines((prev) => {
          const next = [...prev]
          next[next.length - 1] = { text: line.text.slice(0, charIdx + 1), type: line.type }
          return next
        })
        charIdx++
        typingRef.current = setTimeout(type, TYPING_SPEED)
      } else {
        lineIdx++
        charIdx = 0
        typingRef.current = setTimeout(type, TYPING_SPEED)
      }
    }
    type()
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (isTyping || !input.trim() && input !== '') return

    const cmd = input
    setInput('')
    setHistIdx(-1)

    // Add command echo
    setLines((prev) => [
      ...prev,
      { text: `${PROMPT}${cmd}`, type: 'prompt-echo' },
    ])

    // Save to history
    if (cmd.trim()) {
      setHistory((prev) => [cmd, ...prev].slice(0, 50))
    }

    const result = processCommand(cmd)

    if (result.length === 1 && result[0]?.type === 'control' && result[0]?.text === '__CLEAR__') {
      setLines([...INITIAL_OUTPUT])
      return
    }

    // Short outputs: instant; long outputs: typing animation
    if (result.length <= 3) {
      setLines((prev) => [...prev, ...result])
    } else {
      typeOutput(result)
    }
  }, [input, isTyping, typeOutput])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIdx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(newIdx)
      setInput(history[newIdx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIdx = Math.max(histIdx - 1, -1)
      setHistIdx(newIdx)
      setInput(newIdx === -1 ? '' : history[newIdx] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Tab completion
      const cmds = ['help', 'about', 'events', 'team', 'stats', 'clear', 'nvidia-smi', 'hack', 'matrix', 'sudo', 'ls', 'cd', 'cat', 'exit']
      const match = cmds.find((c) => c.startsWith(input))
      if (match) setInput(match)
    }
  }

  useEffect(() => {
    return () => { if (typingRef.current) clearTimeout(typingRef.current) }
  }, [])

  return (
    <div
      className="terminal-window w-full max-w-3xl mx-auto"
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal — type 'help' for commands"
    >
      {/* CRT scanlines overlay */}
      <div className="terminal-scanlines" aria-hidden="true" />

      {/* macOS-style title bar — per UI-DESIGN.md spec */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111111] border-b border-white/5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="ml-2 text-xs font-mono text-text-tertiary select-none">
          nvidia-sc@website — bash
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={bodyRef}
        className="terminal-body"
        aria-live="polite"
        aria-atomic="false"
      >
        {lines.map((line, i) => {
          if (line.type === 'prompt-echo') {
            return (
              <div key={i} className="leading-relaxed">
                <span className="terminal-prompt select-none">{PROMPT}</span>
                <span style={{ color: '#fff' }}>{line.text.replace(PROMPT, '')}</span>
              </div>
            )
          }
          const colorClass =
            line.type === 'output error' ? 'text-red-400' :
            line.type === 'output dim' ? 'text-text-secondary' :
            line.type === 'output white' ? 'text-white' :
            'text-nvidia'

          return (
            <div key={i} className={`leading-relaxed ${colorClass}`}>
              {line.text || '\u00A0'}
            </div>
          )
        })}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-0 mt-1">
          <span className="terminal-prompt select-none whitespace-nowrap">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="terminal-input bg-transparent border-none flex-1 text-white caret-nvidia font-mono text-sm"
            style={{ minWidth: '0', outline: 'none', caretColor: '#76B900' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal input"
            id="terminal-input"
          />
          {isTyping && <span className="cursor-blink" aria-hidden="true" />}
        </form>
      </div>
    </div>
  )
}
