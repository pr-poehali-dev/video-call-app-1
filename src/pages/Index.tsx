import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Tab = "contacts" | "chats" | "calls" | "media" | "wallet";
type CallState = "idle" | "active" | "ended";

interface Contact {
  id: number;
  name: string;
  status: "online" | "offline" | "busy";
  avatar: string;
  lastSeen?: string;
  lastMessage?: string;
}

const contacts: Contact[] = [
  { id: 1, name: "Алексей Петров", status: "online", avatar: "АП", lastMessage: "Привет! Как дела?", lastSeen: "только что" },
  { id: 2, name: "Мария Соколова", status: "online", avatar: "МС", lastMessage: "Отправила фото", lastSeen: "1 мин назад" },
  { id: 3, name: "Дмитрий Иванов", status: "busy", avatar: "ДИ", lastMessage: "На звонке", lastSeen: "5 мин назад" },
  { id: 4, name: "Анна Новикова", status: "offline", avatar: "АН", lastMessage: "Окей, до завтра!", lastSeen: "2 часа назад" },
  { id: 5, name: "Кирилл Федоров", status: "online", avatar: "КФ", lastMessage: "Посмотри видео 👀", lastSeen: "3 мин назад" },
  { id: 6, name: "Екатерина Белова", status: "offline", avatar: "ЕБ", lastMessage: "Спасибо за звонок!", lastSeen: "вчера" },
];

const callHistory = [
  { id: 1, name: "Алексей Петров", avatar: "АП", type: "outgoing", duration: "12:43", time: "Сегодня, 14:20" },
  { id: 2, name: "Мария Соколова", avatar: "МС", type: "incoming", duration: "5:12", time: "Сегодня, 11:05" },
  { id: 3, name: "Дмитрий Иванов", avatar: "ДИ", type: "missed", duration: "—", time: "Вчера, 22:18" },
  { id: 4, name: "Кирилл Федоров", avatar: "КФ", type: "outgoing", duration: "32:01", time: "Вчера, 18:30" },
  { id: 5, name: "Анна Новикова", avatar: "АН", type: "incoming", duration: "8:55", time: "18 марта, 09:44" },
];

const mediaItems = [
  { id: 1, type: "photo", emoji: "🌇", from: "Мария С.", time: "5 мин" },
  { id: 2, type: "video", emoji: "🎬", from: "Алексей П.", time: "32 мин" },
  { id: 3, type: "photo", emoji: "🏔️", from: "Кирилл Ф.", time: "1 ч" },
  { id: 4, type: "photo", emoji: "🎉", from: "Мария С.", time: "2 ч" },
  { id: 5, type: "video", emoji: "🎵", from: "Алексей П.", time: "3 ч" },
  { id: 6, type: "photo", emoji: "🌊", from: "Анна Н.", time: "вчера" },
  { id: 7, type: "video", emoji: "🚀", from: "Дмитрий И.", time: "вчера" },
  { id: 8, type: "photo", emoji: "🌸", from: "Екатерина Б.", time: "2 дня" },
];

interface Message {
  id: number;
  text: string;
  time: string;
  own: boolean;
  type?: "text" | "photo" | "video";
}

const chatMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Привет! Как дела?", time: "14:12", own: false },
    { id: 2, text: "Привет! Всё отлично, работаю над проектом 🚀", time: "14:13", own: true },
    { id: 3, text: "Круто! Покажешь потом?", time: "14:14", own: false },
    { id: 4, text: "Конечно, созвонимся вечером", time: "14:15", own: true },
    { id: 5, text: "Давай в 19:00 👍", time: "14:15", own: false },
  ],
  2: [
    { id: 1, text: "Отправила фото с поездки!", time: "12:30", own: false, type: "photo" },
    { id: 2, text: "Вау, красиво! Где это?", time: "12:32", own: true },
    { id: 3, text: "Это Алтай, рекомендую!", time: "12:33", own: false },
    { id: 4, text: "Обязательно поеду 🏔️", time: "12:35", own: true },
  ],
  3: [
    { id: 1, text: "Привет, ты на звонке?", time: "11:00", own: true },
    { id: 2, text: "Да, перезвоню через 10 мин", time: "11:05", own: false },
    { id: 3, text: "Ок, жду!", time: "11:05", own: true },
  ],
  5: [
    { id: 1, text: "Посмотри видео 👀", time: "10:20", own: false, type: "video" },
    { id: 2, text: "Классное! Кинь ещё", time: "10:25", own: true },
    { id: 3, text: "Ловиии 🎬", time: "10:26", own: false, type: "video" },
  ],
};

interface Transaction {
  id: number;
  contact: string;
  avatar: string;
  amount: number;
  type: "in" | "out";
  desc: string;
  time: string;
}

const transactions: Transaction[] = [
  { id: 1, contact: "Алексей Петров", avatar: "АП", amount: 500, type: "in", desc: "За обед", time: "Сегодня, 15:30" },
  { id: 2, contact: "Мария Соколова", avatar: "МС", amount: 1200, type: "out", desc: "Подарок", time: "Сегодня, 12:00" },
  { id: 3, contact: "Кирилл Федоров", avatar: "КФ", amount: 350, type: "in", desc: "Такси", time: "Вчера, 21:10" },
  { id: 4, contact: "Анна Новикова", avatar: "АН", amount: 2000, type: "out", desc: "За билеты", time: "Вчера, 14:45" },
  { id: 5, contact: "Дмитрий Иванов", avatar: "ДИ", amount: 150, type: "in", desc: "Кофе", time: "17 марта, 09:20" },
  { id: 6, contact: "Мария Соколова", avatar: "МС", amount: 800, type: "in", desc: "Возврат", time: "16 марта, 18:00" },
];

const statusColors: Record<string, string> = {
  online: "bg-emerald-400",
  offline: "bg-gray-500",
  busy: "bg-amber-400",
};

const avatarGrads = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-purple-500",
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("contacts");
  const [callState, setCallState] = useState<CallState>("idle");
  const [activeCaller, setActiveCaller] = useState<Contact | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [openChat, setOpenChat] = useState<Contact | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>(chatMessages);
  const [callChatOpen, setCallChatOpen] = useState(false);
  const [callMsgInput, setCallMsgInput] = useState("");
  const [walletBalance, setWalletBalance] = useState(4850);
  const [walletTxns, setWalletTxns] = useState<Transaction[]>(transactions);
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [sendTo, setSendTo] = useState<Contact | null>(null);
  const [sendAmount, setSendAmount] = useState("");
  const [sendDesc, setSendDesc] = useState("");
  const [callNotification, setCallNotification] = useState<Message | null>(null);
  const notifTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playNotifSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) { /* audio not supported */ }
  };

  const incomingCallReplies = [
    "Подожди секунду, сейчас покажу 😄",
    "Отлично выглядишь!",
    "Слышишь меня? Связь нормальная?",
    "Скину фотку после звонка 📸",
    "Классно поговорили! 🎉",
  ];

  useEffect(() => {
    if (callState !== "active" || !activeCaller) return;

    const scheduleReply = (delay: number) => {
      notifTimeoutRef.current = setTimeout(() => {
        const randomText = incomingCallReplies[Math.floor(Math.random() * incomingCallReplies.length)];
        const newMsg: Message = {
          id: Date.now(),
          text: randomText,
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          own: false,
        };

        setLocalMessages(prev => ({
          ...prev,
          [activeCaller.id]: [...(prev[activeCaller.id] || []), newMsg],
        }));

        if (!callChatOpen) {
          setCallNotification(newMsg);
          playNotifSound();
          setTimeout(() => setCallNotification(null), 4000);
        }

        scheduleReply(8000 + Math.random() * 7000);
      }, delay);
    };

    scheduleReply(4000 + Math.random() * 3000);

    return () => {
      if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    };
  }, [callState, activeCaller?.id]);

  const handleSendMoney = () => {
    const amt = parseFloat(sendAmount);
    if (!sendTo || !amt || amt <= 0 || amt > walletBalance) return;
    const newTxn: Transaction = {
      id: Date.now(),
      contact: sendTo.name,
      avatar: sendTo.avatar,
      amount: amt,
      type: "out",
      desc: sendDesc.trim() || "Перевод",
      time: "Только что",
    };
    setWalletTxns([newTxn, ...walletTxns]);
    setWalletBalance(prev => prev - amt);
    setSendMoneyOpen(false);
    setSendTo(null);
    setSendAmount("");
    setSendDesc("");
  };

  const sendMessage = () => {
    if (!msgInput.trim() || !openChat) return;
    const msgs = localMessages[openChat.id] || [];
    const newMsg: Message = {
      id: msgs.length + 1,
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      own: true,
    };
    setLocalMessages({ ...localMessages, [openChat.id]: [...msgs, newMsg] });
    setMsgInput("");
  };

  const sendCallMessage = () => {
    if (!callMsgInput.trim() || !activeCaller) return;
    const msgs = localMessages[activeCaller.id] || [];
    const newMsg: Message = {
      id: msgs.length + 1,
      text: callMsgInput.trim(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      own: true,
    };
    setLocalMessages({ ...localMessages, [activeCaller.id]: [...msgs, newMsg] });
    setCallMsgInput("");
  };

  const startCall = (contact: Contact) => {
    setActiveCaller(contact);
    setCallState("active");
  };

  const endCall = () => {
    setCallState("ended");
    setCallChatOpen(false);
    setCallMsgInput("");
    setTimeout(() => {
      setCallState("idle");
      setActiveCaller(null);
    }, 1500);
  };

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "contacts", icon: "Users", label: "Контакты" },
    { id: "chats", icon: "MessageCircle", label: "Чаты" },
    { id: "calls", icon: "Video", label: "Звонки" },
    { id: "media", icon: "Image", label: "Медиа" },
    { id: "wallet", icon: "Wallet", label: "Кошелёк" },
  ];

  return (
    <div className="bg-mesh min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="orb w-96 h-96 top-[-100px] right-[-100px] opacity-30" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)" }} />
      <div className="orb w-80 h-80 bottom-[100px] left-[-80px] opacity-20" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)" }} />
      <div className="orb w-64 h-64 top-[40%] right-[10%] opacity-15" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.6) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="font-display text-2xl font-black gradient-text tracking-tight">ConnectX</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Icon name="ShieldCheck" size={11} className="text-emerald-400" />
              <span className="shimmer-text text-[11px] font-medium">Сквозное шифрование</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-bright transition-all">
              <Icon name="Search" size={16} className="text-white/70" />
            </button>
            <div className="avatar-ring">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                ВЫ
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Active Call Overlay */}
      {callState === "active" && activeCaller && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #0d0820 40%, #0a1628 100%)" }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="orb w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-40" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)" }} />
            <div className="orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-30" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)" }} />
          </div>

          {/* Video area */}
          <div className={`relative flex-1 flex flex-col items-center justify-center gap-6 z-10 transition-all duration-300 ${callChatOpen ? "pb-0" : ""}`}>
            <div className={`text-center animate-fade-in transition-all duration-300 ${callChatOpen ? "scale-75 -translate-y-4" : ""}`}>
              <div className="float inline-block mb-4">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatarGrads[activeCaller.id % avatarGrads.length]} flex items-center justify-center text-3xl font-black text-white shadow-2xl ring-pulse`}>
                  {activeCaller.avatar}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{activeCaller.name}</h2>
              <p className="text-white/60 text-sm mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block online-dot" />
                Видеозвонок · <span className="text-emerald-400">Зашифрован</span>
              </p>
              <p className="text-white/40 text-xs mt-1">00:02:17</p>
            </div>
            <div className="absolute top-10 right-4 w-24 h-32 rounded-2xl glass-bright overflow-hidden border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Icon name="User" size={24} className="text-white/40 mx-auto mb-1" />
                <p className="text-white/30 text-[10px]">Вы</p>
              </div>
            </div>
            {!callChatOpen && (
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full animate-fade-in">
                <Icon name="Lock" size={12} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">E2E шифрование активно</span>
              </div>
            )}

            {/* Incoming message notification toast */}
            {callNotification && !callChatOpen && activeCaller && (
              <button
                onClick={() => { setCallChatOpen(true); setCallNotification(null); }}
                className="absolute bottom-4 left-4 right-4 glass-bright rounded-2xl p-3 flex items-center gap-3 animate-slide-in-right cursor-pointer hover:bg-white/10 transition-all border border-purple-500/20"
                style={{ boxShadow: "0 4px 20px rgba(168,85,247,0.3)" }}
              >
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrads[activeCaller.id % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {activeCaller.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-purple-300 font-semibold">{activeCaller.name.split(" ")[0]}</p>
                  <p className="text-xs text-white/80 truncate">{callNotification.text}</p>
                </div>
                <Icon name="MessageCircle" size={14} className="text-purple-400 flex-shrink-0" />
              </button>
            )}
          </div>

          {/* In-call chat panel */}
          <div className={`relative z-10 transition-all duration-300 ease-out overflow-hidden ${callChatOpen ? "max-h-[45vh] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="glass-bright border-t border-white/10 flex flex-col" style={{ height: "45vh" }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={14} className="text-purple-400" />
                  <span className="text-xs font-semibold text-white/70">Чат с {activeCaller.name.split(" ")[0]}</span>
                </div>
                <button onClick={() => setCallChatOpen(false)} className="w-7 h-7 rounded-full glass flex items-center justify-center">
                  <Icon name="X" size={13} className="text-white/50" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {(localMessages[activeCaller.id] || []).map((msg, i) => (
                  <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} animate-fade-in`} style={{ animationDelay: `${i * 0.03}s` }}>
                    <div className={`max-w-[80%] px-3 py-2 ${msg.own ? "bubble-out" : "bubble-in"}`}>
                      <p className="text-xs text-white leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-0.5 ${msg.own ? "justify-end" : ""}`}>
                        <span className="text-[9px] text-white/35">{msg.time}</span>
                        {msg.own && <Icon name="CheckCheck" size={9} className="text-cyan-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3 pb-3 pt-1">
                <div className="glass rounded-xl flex items-center gap-2 p-1">
                  <input
                    value={callMsgInput}
                    onChange={e => setCallMsgInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendCallMessage()}
                    className="flex-1 bg-transparent text-xs text-white placeholder:text-white/25 outline-none py-2 px-2"
                    placeholder="Написать..."
                  />
                  {callMsgInput.trim() ? (
                    <button onClick={sendCallMessage} className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center flex-shrink-0">
                      <Icon name="Send" size={12} className="text-white" />
                    </button>
                  ) : (
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center flex-shrink-0">
                      <Icon name="Smile" size={12} className="text-white/30" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="relative z-10 pb-10 px-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? "glass-bright" : "bg-red-500/80"}`}
              >
                <Icon name={micOn ? "Mic" : "MicOff"} size={22} className="text-white" />
              </button>
              <button
                onClick={() => { setCallChatOpen(!callChatOpen); setCallNotification(null); }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative ${callChatOpen ? "bg-purple-500/60 border border-purple-400/40" : "glass-bright"}`}
              >
                <Icon name="MessageCircle" size={22} className="text-white" />
                {callNotification && !callChatOpen && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center online-dot">
                    <span className="text-[8px] text-white font-bold">!</span>
                  </span>
                )}
              </button>
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full btn-danger flex items-center justify-center shadow-2xl"
                style={{ boxShadow: "0 0 30px rgba(239,68,68,0.5)" }}
              >
                <Icon name="PhoneOff" size={26} className="text-white" />
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOn ? "glass-bright" : "bg-red-500/80"}`}
              >
                <Icon name={camOn ? "Video" : "VideoOff"} size={22} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {callState === "ended" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-bright rounded-3xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mx-auto mb-4">
              <Icon name="PhoneOff" size={24} className="text-white/60" />
            </div>
            <p className="text-white font-semibold text-lg">Звонок завершён</p>
            <p className="text-white/40 text-sm mt-1">00:02:17</p>
          </div>
        </div>
      )}

      {/* Open Chat Overlay */}
      {openChat && callState === "idle" && (
        <div className="fixed inset-0 z-40 flex flex-col" style={{ background: "#0a0812" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb w-80 h-80 top-[-60px] right-[-60px] opacity-20" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)" }} />
            <div className="orb w-60 h-60 bottom-[80px] left-[-40px] opacity-15" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)" }} />
          </div>

          {/* Chat header */}
          <div className="relative z-10 glass-bright border-b border-white/5 px-4 py-3 flex items-center gap-3">
            <button onClick={() => setOpenChat(null)} className="w-8 h-8 rounded-full glass flex items-center justify-center">
              <Icon name="ArrowLeft" size={16} className="text-white/70" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[openChat.id % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
              {openChat.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{openChat.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors[openChat.status]} ${openChat.status === "online" ? "online-dot" : ""}`} />
                <span className="text-[11px] text-white/40">
                  {openChat.status === "online" ? "в сети" : openChat.status === "busy" ? "занят" : "не в сети"}
                </span>
              </div>
            </div>
            <button onClick={() => startCall(openChat)} className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center">
              <Icon name="Video" size={16} className="text-white" />
            </button>
            <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <Icon name="Phone" size={16} className="text-white/60" />
            </button>
          </div>

          {/* Encryption badge */}
          <div className="relative z-10 flex justify-center py-3">
            <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
              <Icon name="Lock" size={10} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-400/80">Сообщения зашифрованы</span>
            </div>
          </div>

          {/* Messages */}
          <div className="relative z-10 flex-1 overflow-y-auto px-4 space-y-2 pb-4">
            {(localMessages[openChat.id] || []).map((msg, i) => (
              <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} animate-fade-in`} style={{ animationDelay: `${i * 0.04}s` }}>
                <div className={`max-w-[75%] px-4 py-2.5 ${msg.own ? "bubble-out" : "bubble-in"}`}>
                  {msg.type === "photo" && (
                    <div className="w-full h-24 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                      <span className="text-2xl">🖼️</span>
                    </div>
                  )}
                  {msg.type === "video" && (
                    <div className="w-full h-24 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="Play" size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${msg.own ? "justify-end" : ""}`}>
                    <span className="text-[10px] text-white/40">{msg.time}</span>
                    {msg.own && <Icon name="CheckCheck" size={11} className="text-cyan-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="relative z-10 px-4 pb-5 pt-2">
            <div className="glass-bright rounded-2xl flex items-center gap-2 p-1.5 border border-white/10">
              <button className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <Icon name="Paperclip" size={16} className="text-white/40" />
              </button>
              <input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none py-2"
                placeholder="Сообщение..."
              />
              <button className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <Icon name="Smile" size={16} className="text-white/40" />
              </button>
              {msgInput.trim() ? (
                <button onClick={sendMessage} className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
                  <Icon name="Send" size={16} className="text-white" />
                </button>
              ) : (
                <button className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
                  <Icon name="Mic" size={16} className="text-white/40" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 pb-28 max-w-lg mx-auto w-full">

        {/* CONTACTS TAB */}
        {tab === "contacts" && (
          <div className="animate-fade-in">
            <div className="relative mb-4">
              <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                placeholder="Поиск контактов..."
              />
            </div>

            <div className="mb-5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">В сети сейчас</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {contacts.filter(c => c.status === "online").map((c, i) => (
                  <button key={c.id} onClick={() => { setOpenChat(c); setTab("chats"); }} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-sm font-bold text-white group-hover:scale-110 transition-transform shadow-lg`}>
                        {c.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${statusColors[c.status]} border-2 border-[#0a0812] online-dot`} />
                    </div>
                    <span className="text-[11px] text-white/60 w-14 text-center truncate">{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">Все контакты</p>
              <div className="space-y-2">
                {contacts.map((c, i) => (
                  <div
                    key={c.id}
                    className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:glass-bright transition-all cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => { setOpenChat(c); setTab("chats"); }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-sm font-bold text-white`}>
                        {c.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColors[c.status]} border-2 border-[#0a0812]`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <span className="text-[11px] text-white/30">{c.lastSeen}</span>
                      </div>
                      <p className="text-xs text-white/40 truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); startCall(c); }}
                      className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Video" size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CHATS TAB */}
        {tab === "chats" && (
          <div className="animate-fade-in">
            <div className="relative mb-4">
              <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                placeholder="Поиск по чатам..."
              />
            </div>

            <div className="space-y-2">
              {contacts.map((c, i) => {
                const msgs = localMessages[c.id] || [];
                const lastMsg = msgs[msgs.length - 1];
                const unread = c.status === "online" && !lastMsg?.own ? 1 : 0;
                return (
                  <div
                    key={c.id}
                    onClick={() => setOpenChat(c)}
                    className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:glass-bright transition-all cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-sm font-bold text-white`}>
                        {c.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColors[c.status]} border-2 border-[#0a0812]`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <span className="text-[11px] text-white/30">{lastMsg?.time || ""}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {lastMsg?.own && <Icon name="CheckCheck" size={11} className="text-cyan-400 flex-shrink-0" />}
                        <p className="text-xs text-white/40 truncate">
                          {lastMsg ? (lastMsg.type === "photo" ? "📷 Фото" : lastMsg.type === "video" ? "🎬 Видео" : lastMsg.text) : "Начните диалог"}
                        </p>
                      </div>
                    </div>
                    {unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-white font-bold">{unread}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 glass rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Lock" size={14} className="text-purple-400" />
              </div>
              <p className="text-[11px] text-white/40">Все сообщения защищены сквозным шифрованием</p>
            </div>
          </div>
        )}

        {/* CALLS TAB */}
        {tab === "calls" && callState === "idle" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">История звонков</h2>
              <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Очистить</button>
            </div>

            <div className="space-y-2 mb-5">
              {callHistory.map((call, i) => (
                <div key={call.id} className="glass rounded-2xl p-3.5 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {call.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{call.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Icon
                        name={call.type === "incoming" ? "PhoneIncoming" : call.type === "outgoing" ? "PhoneOutgoing" : "PhoneMissed"}
                        size={11}
                        className={call.type === "missed" ? "text-red-400" : call.type === "incoming" ? "text-emerald-400" : "text-purple-400"}
                      />
                      <span className={`text-xs ${call.type === "missed" ? "text-red-400" : "text-white/40"}`}>
                        {call.type === "missed" ? "Пропущен" : call.type === "incoming" ? "Входящий" : "Исходящий"}
                      </span>
                      {call.duration !== "—" && <span className="text-xs text-white/30">· {call.duration}</span>}
                    </div>
                    <p className="text-[11px] text-white/25 mt-0.5">{call.time}</p>
                  </div>
                  <button
                    onClick={() => {
                      const c = contacts.find(ct => ct.name === call.name) ?? { id: call.id, name: call.name, avatar: call.avatar, status: "online" as const };
                      startCall(c);
                    }}
                    className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center flex-shrink-0"
                  >
                    <Icon name="Video" size={15} className="text-white" />
                  </button>
                </div>
              ))}
            </div>

            <div className="glass-bright rounded-2xl p-4 border border-purple-500/20">
              <p className="text-sm text-white/60 text-center mb-3">Позвонить сейчас</p>
              <div className="flex gap-2">
                {contacts.filter(c => c.status === "online").slice(0, 3).map((c, i) => (
                  <button key={c.id} onClick={() => startCall(c)} className="flex-1 flex flex-col items-center gap-1.5 glass rounded-xl p-2 hover:bg-white/10 transition-all">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[i]} flex items-center justify-center text-xs font-bold text-white`}>
                      {c.avatar}
                    </div>
                    <span className="text-[10px] text-white/50 truncate w-full text-center">{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {tab === "media" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Медиафайлы</h2>
              <div className="flex gap-1">
                <button className="glass px-3 py-1.5 rounded-full text-xs text-purple-400 border border-purple-500/30">Фото</button>
                <button className="glass px-3 py-1.5 rounded-full text-xs text-white/40">Видео</button>
                <button className="glass px-3 py-1.5 rounded-full text-xs text-white/40">Все</button>
              </div>
            </div>

            <div className="glass-bright rounded-2xl p-4 mb-4 border border-dashed border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
                <Icon name="Upload" size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Отправить медиа</p>
                <p className="text-xs text-white/40">Фото или видео · Шифруется автоматически</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {mediaItems.map((item, i) => (
                <div
                  key={item.id}
                  className="glass rounded-2xl overflow-hidden aspect-square relative cursor-pointer group hover:scale-[1.02] transition-transform animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} opacity-25`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl">{item.emoji}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs text-white font-semibold">{item.from}</p>
                    <p className="text-[10px] text-white/60">{item.time}</p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="glass px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Icon name={item.type === "video" ? "Play" : "Image"} size={9} className="text-white" />
                      <span className="text-[9px] text-white">{item.type === "video" ? "VID" : "IMG"}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Icon name="Lock" size={10} className="text-emerald-400 opacity-70" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 glass rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="ShieldCheck" size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Все файлы защищены</p>
                <p className="text-[11px] text-white/40">E2E шифрование — никто кроме вас не видит медиа</p>
              </div>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {tab === "wallet" && (
          <div className="animate-fade-in">
            {/* Balance card */}
            <div className="rounded-3xl p-5 mb-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #06b6d4 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70 font-medium">Основной баланс</span>
                  <Icon name="Eye" size={14} className="text-white/50" />
                </div>
                <p className="text-3xl font-black text-white tracking-tight">{walletBalance.toLocaleString("ru-RU")} ₽</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="TrendingUp" size={11} className="text-emerald-300" />
                  <span className="text-[11px] text-emerald-300 font-medium">+1 800 ₽ за неделю</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSendMoneyOpen(true)} className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                    <Icon name="Send" size={15} className="text-white" />
                    <span className="text-xs font-semibold text-white">Отправить</span>
                  </button>
                  <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                    <Icon name="Download" size={15} className="text-white" />
                    <span className="text-xs font-semibold text-white">Пополнить</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick send */}
            <div className="mb-5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">Быстрый перевод</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {contacts.filter(c => c.status !== "offline").map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => { setSendTo(c); setSendMoneyOpen(true); }}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white group-hover:scale-110 transition-transform`}>
                      {c.avatar}
                    </div>
                    <span className="text-[10px] text-white/50 w-12 text-center truncate">{c.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">История</p>
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Все</button>
              </div>
              <div className="space-y-2">
                {walletTxns.map((txn, i) => (
                  <div key={txn.id} className="glass rounded-2xl p-3.5 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                      {txn.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{txn.contact}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">{txn.desc} · {txn.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${txn.type === "in" ? "text-emerald-400" : "text-white/80"}`}>
                        {txn.type === "in" ? "+" : "−"}{txn.amount.toLocaleString("ru-RU")} ₽
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <Icon name="Lock" size={8} className="text-emerald-400/60" />
                        <span className="text-[9px] text-white/25">Защищён</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security notice */}
            <div className="mt-4 glass rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Icon name="ShieldCheck" size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Безопасные переводы</p>
                <p className="text-[11px] text-white/40">Все транзакции защищены сквозным шифрованием</p>
              </div>
            </div>
          </div>
        )}

        {/* Send Money Modal */}
        {sendMoneyOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setSendMoneyOpen(false); setSendTo(null); setSendAmount(""); setSendDesc(""); }}>
            <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <h3 className="text-lg font-bold text-white mb-4">Отправить перевод</h3>

              {!sendTo ? (
                <div>
                  <p className="text-xs text-white/40 mb-3">Выберите получателя</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {contacts.map((c, i) => (
                      <button key={c.id} onClick={() => setSendTo(c)} className="w-full glass rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-all">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                          {c.avatar}
                        </div>
                        <p className="text-sm text-white font-medium">{c.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 glass rounded-xl p-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[sendTo.id % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                      {sendTo.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{sendTo.name}</p>
                      <p className="text-[11px] text-white/40">Получатель</p>
                    </div>
                    <button onClick={() => setSendTo(null)} className="text-xs text-purple-400">Изменить</button>
                  </div>
                  <div className="mb-3">
                    <label className="text-xs text-white/40 mb-1.5 block">Сумма</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={sendAmount}
                        onChange={e => setSendAmount(e.target.value)}
                        className="w-full glass rounded-xl px-4 py-3 text-xl text-white font-bold placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">₽</span>
                    </div>
                    <p className="text-[11px] text-white/30 mt-1.5">Доступно: {walletBalance.toLocaleString("ru-RU")} ₽</p>
                  </div>
                  <div className="mb-5">
                    <label className="text-xs text-white/40 mb-1.5 block">Комментарий</label>
                    <input
                      value={sendDesc}
                      onChange={e => setSendDesc(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                      placeholder="За что перевод..."
                    />
                  </div>
                  <button
                    onClick={handleSendMoney}
                    disabled={!sendAmount || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > walletBalance}
                    className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Отправить {sendAmount ? `${parseFloat(sendAmount).toLocaleString("ru-RU")} ₽` : ""}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-5 pt-2">
        <div className="max-w-lg mx-auto">
          <div className="glass-bright rounded-2xl flex items-stretch p-1 border border-white/10" style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.08)" }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all ${tab === item.id ? "nav-active" : "hover:bg-white/5"}`}
              >
                <Icon name={item.icon} size={20} className={tab === item.id ? "text-purple-400" : "text-white/40"} />
                <span className={`text-[10px] font-semibold ${tab === item.id ? "text-purple-300" : "text-white/30"}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}