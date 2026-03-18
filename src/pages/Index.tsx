import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "contacts" | "calls" | "media";
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

  const startCall = (contact: Contact) => {
    setActiveCaller(contact);
    setCallState("active");
  };

  const endCall = () => {
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setActiveCaller(null);
    }, 1500);
  };

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "contacts", icon: "Users", label: "Контакты" },
    { id: "calls", icon: "Video", label: "Звонки" },
    { id: "media", icon: "Image", label: "Медиа" },
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
          <div className="relative flex-1 flex flex-col items-center justify-center gap-6 z-10">
            <div className="text-center animate-fade-in">
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
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Icon name="Lock" size={12} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">E2E шифрование активно</span>
            </div>
          </div>
          <div className="relative z-10 pb-10 px-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? "glass-bright" : "bg-red-500/80"}`}
              >
                <Icon name={micOn ? "Mic" : "MicOff"} size={22} className="text-white" />
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
                  <button key={c.id} onClick={() => startCall(c)} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
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
                      onClick={() => startCall(c)}
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
