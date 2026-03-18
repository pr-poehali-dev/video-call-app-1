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
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [walletLocked, setWalletLocked] = useState(true);
  const [walletPin, setWalletPin] = useState("1234");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpCard, setTopUpCard] = useState("");
  const [topUpExpiry, setTopUpExpiry] = useState("");
  const [topUpCvv, setTopUpCvv] = useState("");
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCard, setWithdrawCard] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [savedCards, setSavedCards] = useState<{id: number; last4: string; type: string}[]>([
    { id: 1, last4: "4276", type: "Visa" },
  ]);
  const [callNotification, setCallNotification] = useState<Message | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Ваше Имя");
  const [profileStatus, setProfileStatus] = useState("Доступен для звонков");
  const [profileNotifs, setProfileNotifs] = useState(true);
  const [profileSounds, setProfileSounds] = useState(true);
  const [profileE2E, setProfileE2E] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactStatus, setNewContactStatus] = useState<"online" | "offline">("online");
  const [contactsList, setContactsList] = useState<Contact[]>(contacts);
  const [linkedAccounts, setLinkedAccounts] = useState<{id: number; name: string; avatar: string; messages: Record<number, Message[]>}[]>([]);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [viewingAccount, setViewingAccount] = useState<number | null>(null);
  const [viewingAccountChat, setViewingAccountChat] = useState<number | null>(null);
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [activeAccountId, setActiveAccountId] = useState<number | null>(null);
  const [emojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);
  const ADMIN_CODE = "admin2024";

  const emojiSets = [
    { label: "😀", name: "Смайлы", emojis: ["😀","😃","😄","😁","😆","🥹","😅","🤣","😂","🙂","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","😮‍💨","🤥","😌","😔","😪","🤤","😴","😷"] },
    { label: "❤️", name: "Любовь", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💕","💞","💓","💗","💖","💘","💝","💟","❣️","💔","♥️","🫶","💑","💏","😻","😽","😘","🥰","😍","🤩","💋","👄","🌹","🌷","💐","🎀","💌"] },
    { label: "👋", name: "Жесты", emojis: ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","💪"] },
    { label: "🎉", name: "Праздник", emojis: ["🎉","🎊","🎈","🎁","🎀","🎂","🍰","🧁","🥂","🍾","🎆","🎇","✨","🎯","🏆","🥇","🎵","🎶","🎸","🎤","🪩","🎭","🎪","🎬","📸","🎮","🕹️","🎲","🃏","🎰"] },
    { label: "🐱", name: "Животные", emojis: ["🐱","🐶","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦅","🦆","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐢","🐍","🦎","🐙","🐠","🐬","🐳","🦈"] },
    { label: "🍕", name: "Еда", emojis: ["🍕","🍔","🍟","🌭","🍿","🧂","🥚","🍳","🧇","🥞","🧈","🥐","🍞","🥖","🥨","🧀","🥗","🥙","🌮","🌯","🫔","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🍤","🍙","🍚","🍘","🍢","🍡","🍧","🍨","🍦","🥧","🍰","🧁","🍫","🍬","🍭","🍮","☕","🍵","🧋","🥤","🍺","🍷"] },
  ];
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

  const handlePinSubmit = () => {
    if (pinInput === walletPin) {
      setWalletLocked(false);
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
      setTimeout(() => setPinError(false), 1500);
    }
  };

  const handleSetNewPin = () => {
    if (newPin.length < 4 || newPin !== confirmPin) return;
    setWalletPin(newPin);
    setNewPin("");
    setConfirmPin("");
    setSettingPin(false);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const getCardType = (num: string) => {
    const d = num.replace(/\D/g, "");
    if (d.startsWith("4")) return "Visa";
    if (d.startsWith("5")) return "Mastercard";
    if (d.startsWith("2")) return "МИР";
    return "Карта";
  };

  const handleTopUp = () => {
    const amt = parseFloat(topUpAmount);
    if (!amt || amt <= 0) return;
    const cardDigits = topUpCard.replace(/\D/g, "");
    if (cardDigits.length < 16) return;

    const last4 = cardDigits.slice(-4);
    const cardType = getCardType(cardDigits);
    if (!savedCards.find(c => c.last4 === last4)) {
      setSavedCards(prev => [...prev, { id: Date.now(), last4, type: cardType }]);
    }

    setWalletBalance(prev => prev + amt);
    setWalletTxns(prev => [{
      id: Date.now(), contact: `${cardType} ••${last4}`, avatar: "💳",
      amount: amt, type: "in", desc: "Пополнение с карты", time: "Только что",
    }, ...prev]);
    setTopUpSuccess(true);
    setTimeout(() => {
      setTopUpSuccess(false);
      setTopUpOpen(false);
      setTopUpAmount("");
      setTopUpCard("");
      setTopUpExpiry("");
      setTopUpCvv("");
    }, 2000);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > walletBalance) return;
    const cardDigits = withdrawCard.replace(/\D/g, "");
    if (cardDigits.length < 16) return;

    const last4 = cardDigits.slice(-4);
    const cardType = getCardType(cardDigits);

    setWalletBalance(prev => prev - amt);
    setWalletTxns(prev => [{
      id: Date.now(), contact: `${cardType} ••${last4}`, avatar: "💳",
      amount: amt, type: "out", desc: "Вывод на карту", time: "Только что",
    }, ...prev]);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawCard("");
    }, 2000);
  };

  const generateFakeMessages = (ownerName: string): Record<number, Message[]> => {
    const phrases = [
      ["Привет!", "Как дела?", "Давно не виделись"],
      ["Всё хорошо, спасибо!", "Работаю 💪", "Скоро увидимся"],
      ["Завтра свободен?", "Может погуляем?", "Скинь адрес"],
      ["Ок, договорились!", "Буду в 15:00", "Жду!"],
    ];
    const result: Record<number, Message[]> = {};
    contacts.slice(0, 4).forEach((c, ci) => {
      result[c.id] = phrases[ci].flatMap((text, i) => [
        { id: i * 2 + 1, text, time: `${10 + ci}:${String(i * 12 + 5).padStart(2, "0")}`, own: false },
        { id: i * 2 + 2, text: phrases[(ci + 1) % 4][i] || "👍", time: `${10 + ci}:${String(i * 12 + 8).padStart(2, "0")}`, own: true },
      ]);
    });
    return result;
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_CODE) {
      setIsAdmin(true);
      setAdminLoginOpen(false);
      setAdminPassword("");
      setAdminError(false);
    } else {
      setAdminError(true);
      setAdminPassword("");
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  const handleAddAccount = () => {
    const name = newAccountName.trim();
    if (!name) return;
    const parts = name.split(" ");
    const avatar = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
    setLinkedAccounts(prev => [...prev, {
      id: Date.now(),
      name,
      avatar,
      messages: generateFakeMessages(name),
    }]);
    setNewAccountName("");
    setAddAccountOpen(false);
  };

  const handleRemoveAccount = (id: number) => {
    setLinkedAccounts(prev => prev.filter(a => a.id !== id));
    if (viewingAccount === id) {
      setViewingAccount(null);
      setViewingAccountChat(null);
    }
  };

  const handleAddContact = () => {
    const name = newContactName.trim();
    if (!name) return;
    const parts = name.split(" ");
    const avatar = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
    const newContact: Contact = {
      id: Date.now(),
      name,
      status: newContactStatus,
      avatar,
      lastMessage: "Контакт добавлен",
      lastSeen: "только что",
    };
    setContactsList(prev => [newContact, ...prev]);
    setNewContactName("");
    setNewContactStatus("online");
    setAddContactOpen(false);
  };

  const handleDeleteContact = (id: number) => {
    setContactsList(prev => prev.filter(c => c.id !== id));
  };

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
            {activeAccountId !== null ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name="Eye" size={11} className="text-amber-400" />
                <span className="text-[11px] font-medium text-amber-400">{linkedAccounts.find(a => a.id === activeAccountId)?.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon name="ShieldCheck" size={11} className="text-emerald-400" />
                <span className="shimmer-text text-[11px] font-medium">Сквозное шифрование</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="glass w-9 h-9 rounded-full flex items-center justify-center hover:glass-bright transition-all">
              <Icon name="Search" size={16} className="text-white/70" />
            </button>
            <div className="relative">
              <button
                onClick={() => setAccountSwitcherOpen(!accountSwitcherOpen)}
                className="avatar-ring cursor-pointer hover:scale-105 transition-transform relative"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  activeAccountId !== null
                    ? `bg-gradient-to-br ${avatarGrads[(linkedAccounts.findIndex(a => a.id === activeAccountId) + 2) % avatarGrads.length]}`
                    : "bg-gradient-to-br from-purple-500 to-pink-500"
                }`}>
                  {activeAccountId !== null
                    ? (linkedAccounts.find(a => a.id === activeAccountId)?.avatar || "?")
                    : profileName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                  }
                </div>
              </button>
              {isAdmin && linkedAccounts.length > 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0a0812] flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">{linkedAccounts.length + 1}</span>
                </span>
              )}

              {accountSwitcherOpen && (
                <div className="absolute right-0 top-12 w-56 glass-bright rounded-2xl border border-white/10 overflow-hidden animate-scale-in z-[60]" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
                  <div className="p-2">
                    <button
                      onClick={() => { setActiveAccountId(null); setAccountSwitcherOpen(false); }}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${activeAccountId === null ? "bg-purple-500/15 border border-purple-500/30" : "hover:bg-white/5"}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {profileName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{profileName}</p>
                        <p className="text-[10px] text-white/30">Основной</p>
                      </div>
                      {activeAccountId === null && <Icon name="Check" size={12} className="text-purple-400 flex-shrink-0" />}
                    </button>

                    {isAdmin && linkedAccounts.map((acc, i) => (
                      <button
                        key={acc.id}
                        onClick={() => { setActiveAccountId(acc.id); setAccountSwitcherOpen(false); }}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${activeAccountId === acc.id ? "bg-purple-500/15 border border-purple-500/30" : "hover:bg-white/5"}`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrads[(i + 2) % avatarGrads.length]} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                          {acc.avatar}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{acc.name}</p>
                          <p className="text-[10px] text-white/30">Связанный</p>
                        </div>
                        {activeAccountId === acc.id && <Icon name="Check" size={12} className="text-purple-400 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/5 p-2">
                    <button
                      onClick={() => { setAccountSwitcherOpen(false); setProfileOpen(true); }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition-all"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                        <Icon name="Settings" size={14} className="text-white/40" />
                      </div>
                      <p className="text-xs text-white/50">Управление аккаунтами</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Account switcher backdrop */}
      {accountSwitcherOpen && (
        <div className="fixed inset-0 z-[15]" onClick={() => setAccountSwitcherOpen(false)} />
      )}

      {/* Admin Login Modal */}
      {adminLoginOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => { setAdminLoginOpen(false); setAdminPassword(""); setAdminError(false); }}>
          <div className="w-full max-w-sm mx-4 glass-bright rounded-3xl p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Вход администратора</h3>
              <p className="text-xs text-white/40 mt-1">Введите код доступа для управления аккаунтами</p>
            </div>

            <div className="mb-4">
              <input
                autoFocus
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                className={`w-full glass rounded-xl px-4 py-3 text-sm text-white text-center tracking-wider placeholder:text-white/20 outline-none border transition-all ${
                  adminError ? "border-red-500/50 bg-red-500/5" : "border-transparent focus:border-amber-500/50"
                }`}
                placeholder="Код доступа"
              />
              {adminError && (
                <p className="text-red-400 text-xs text-center mt-2 animate-fade-in">Неверный код доступа</p>
              )}
            </div>

            <button
              onClick={handleAdminLogin}
              disabled={!adminPassword.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}
            >
              Войти
            </button>

            <p className="text-center text-[10px] text-white/20 mt-4">Доступ только для владельца</p>
          </div>
        </div>
      )}

      {/* Profile Overlay */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0812" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="orb w-[400px] h-[400px] top-[-80px] left-[50%] -translate-x-1/2 opacity-30" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)" }} />
          </div>

          {/* Profile header */}
          <div className="relative z-10 px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setProfileOpen(false); setEditingName(false); setEditingStatus(false); }} className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <Icon name="ArrowLeft" size={16} className="text-white/70" />
            </button>
            <h2 className="text-lg font-bold text-white">Профиль</h2>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-10">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center pt-4 pb-6">
              <div className="avatar-ring mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white">
                  {profileName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              </div>
              <button className="glass px-3 py-1.5 rounded-full text-[11px] text-purple-400 mb-4 flex items-center gap-1.5 hover:bg-white/10 transition-all">
                <Icon name="Camera" size={12} className="text-purple-400" />
                Изменить фото
              </button>

              {editingName ? (
                <input
                  autoFocus
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={e => e.key === "Enter" && setEditingName(false)}
                  className="bg-transparent text-xl font-bold text-white text-center outline-none border-b-2 border-purple-500 pb-1 w-48"
                />
              ) : (
                <button onClick={() => setEditingName(true)} className="text-xl font-bold text-white flex items-center gap-2 hover:text-purple-300 transition-colors">
                  {profileName}
                  <Icon name="Pencil" size={14} className="text-white/30" />
                </button>
              )}

              {editingStatus ? (
                <input
                  autoFocus
                  value={profileStatus}
                  onChange={e => setProfileStatus(e.target.value)}
                  onBlur={() => setEditingStatus(false)}
                  onKeyDown={e => e.key === "Enter" && setEditingStatus(false)}
                  className="bg-transparent text-sm text-white/60 text-center outline-none border-b border-purple-500/50 pb-0.5 mt-2 w-56"
                />
              ) : (
                <button onClick={() => setEditingStatus(true)} className="text-sm text-white/50 mt-1.5 flex items-center gap-1.5 hover:text-white/70 transition-colors">
                  {profileStatus}
                  <Icon name="Pencil" size={10} className="text-white/25" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-white">{contactsList.length}</p>
                <p className="text-[10px] text-white/40 mt-0.5">Контактов</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-white">{callHistory.length}</p>
                <p className="text-[10px] text-white/40 mt-0.5">Звонков</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-white">{mediaItems.length}</p>
                <p className="text-[10px] text-white/40 mt-0.5">Медиа</p>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-1.5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2 px-1">Настройки</p>

              <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Icon name="Bell" size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Уведомления</p>
                    <p className="text-[11px] text-white/35">Push и звуки</p>
                  </div>
                </div>
                <button onClick={() => setProfileNotifs(!profileNotifs)} className={`w-11 h-6 rounded-full transition-all relative ${profileNotifs ? "bg-purple-500" : "bg-white/10"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${profileNotifs ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Icon name="Volume2" size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Звуки в чате</p>
                    <p className="text-[11px] text-white/35">Звук сообщений</p>
                  </div>
                </div>
                <button onClick={() => setProfileSounds(!profileSounds)} className={`w-11 h-6 rounded-full transition-all relative ${profileSounds ? "bg-cyan-500" : "bg-white/10"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${profileSounds ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              <div className="glass rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Icon name="ShieldCheck" size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">E2E шифрование</p>
                    <p className="text-[11px] text-white/35">Для звонков и сообщений</p>
                  </div>
                </div>
                <button onClick={() => setProfileE2E(!profileE2E)} className={`w-11 h-6 rounded-full transition-all relative ${profileE2E ? "bg-emerald-500" : "bg-white/10"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${profileE2E ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2 mt-5 px-1">Связанные аккаунты</p>

              {isAdmin ? (
                <>
                  <div className="glass rounded-xl p-2.5 mb-2 flex items-center gap-2 border border-emerald-500/20">
                    <Icon name="ShieldCheck" size={12} className="text-emerald-400" />
                    <p className="text-[11px] text-emerald-400/80 flex-1">Режим администратора</p>
                    <button onClick={() => setIsAdmin(false)} className="text-[10px] text-white/30 hover:text-red-400 transition-colors">Выйти</button>
                  </div>

                  {linkedAccounts.map((acc, i) => (
                    <button
                      key={acc.id}
                      onClick={() => { setViewingAccount(acc.id); setViewingAccountChat(null); }}
                      className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all mb-1.5"
                    >
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrads[(i + 2) % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                        {acc.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm text-white font-medium">{acc.name}</p>
                        <p className="text-[11px] text-white/35">{Object.keys(acc.messages).length} чатов · Подключён</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 online-dot" />
                        <Icon name="ChevronRight" size={14} className="text-white/20" />
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setAddAccountOpen(true)}
                    className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all border border-dashed border-white/10"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Icon name="UserPlus" size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-white font-medium">Добавить аккаунт</p>
                      <p className="text-[11px] text-white/35">Просмотр переписки</p>
                    </div>
                    <Icon name="Plus" size={14} className="text-purple-400" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAdminLoginOpen(true)}
                  className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all border border-dashed border-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                    <Icon name="KeyRound" size={16} className="text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white font-medium">Войти как администратор</p>
                    <p className="text-[11px] text-white/35">Управление аккаунтами</p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-white/20" />
                </button>
              )}

              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2 mt-5 px-1">Аккаунт</p>

              <button className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Icon name="HardDrive" size={16} className="text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">Хранилище</p>
                  <p className="text-[11px] text-white/35">128 МБ из 5 ГБ</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-white/20" />
              </button>

              <button className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <Icon name="Palette" size={16} className="text-pink-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">Оформление</p>
                  <p className="text-[11px] text-white/35">Тёмная тема</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-white/20" />
              </button>

              <button className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Icon name="HelpCircle" size={16} className="text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">Поддержка</p>
                  <p className="text-[11px] text-white/35">Помощь и FAQ</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-white/20" />
              </button>

              <button className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all mt-3 border border-red-500/10">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Icon name="LogOut" size={16} className="text-red-400" />
                </div>
                <p className="text-sm text-red-400 font-medium">Выйти из аккаунта</p>
              </button>
            </div>

            <p className="text-center text-[10px] text-white/15 mt-6">ConnectX v1.0 · Защищено шифрованием</p>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {addAccountOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setAddAccountOpen(false); setNewAccountName(""); }}>
          <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Icon name="UserPlus" size={20} className="text-purple-400" />
              Добавить аккаунт
            </h3>
            <p className="text-xs text-white/40 mb-5">Введите имя для отслеживания переписки</p>

            <div className="mb-4">
              <label className="text-xs text-white/40 mb-1.5 block">Имя аккаунта</label>
              <input
                autoFocus
                value={newAccountName}
                onChange={e => setNewAccountName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddAccount()}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                placeholder="Имя и фамилия"
              />
            </div>

            {newAccountName.trim() && (
              <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3 animate-fade-in">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[Math.abs(newAccountName.length) % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                  {newAccountName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{newAccountName.trim()}</p>
                  <p className="text-[11px] text-white/30">Будет привязан к профилю</p>
                </div>
              </div>
            )}

            <div className="glass rounded-xl p-3 mb-5 flex items-center gap-2.5">
              <Icon name="ShieldAlert" size={14} className="text-amber-400 flex-shrink-0" />
              <p className="text-[11px] text-white/40">Вы сможете видеть переписку этого аккаунта. Данные зашифрованы.</p>
            </div>

            <button
              onClick={handleAddAccount}
              disabled={!newAccountName.trim()}
              className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Привязать аккаунт
            </button>
          </div>
        </div>
      )}

      {/* Viewing Linked Account Overlay */}
      {viewingAccount !== null && (() => {
        const acc = linkedAccounts.find(a => a.id === viewingAccount);
        if (!acc) return null;
        const viewingChat = viewingAccountChat !== null ? contacts.find(c => c.id === viewingAccountChat) : null;
        const chatMsgs = viewingAccountChat !== null ? (acc.messages[viewingAccountChat] || []) : [];

        return (
          <div className="fixed inset-0 z-[55] flex flex-col" style={{ background: "#0a0812" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="orb w-80 h-80 top-[-60px] right-[-60px] opacity-20" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)" }} />
            </div>

            {/* Header */}
            <div className="relative z-10 glass-bright border-b border-white/5 px-4 py-3 flex items-center gap-3">
              <button onClick={() => { if (viewingAccountChat !== null) { setViewingAccountChat(null); } else { setViewingAccount(null); } }} className="w-8 h-8 rounded-full glass flex items-center justify-center">
                <Icon name="ArrowLeft" size={16} className="text-white/70" />
              </button>
              {viewingChat ? (
                <>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrads[viewingChat.id % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                    {viewingChat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{viewingChat.name}</p>
                    <p className="text-[11px] text-white/30">Переписка от {acc.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGrads[(linkedAccounts.indexOf(acc) + 2) % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{acc.name}</p>
                    <p className="text-[11px] text-white/30">Связанный аккаунт</p>
                  </div>
                  <button onClick={() => handleRemoveAccount(acc.id)} className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all">
                    <Icon name="Trash2" size={14} className="text-red-400" />
                  </button>
                </>
              )}
            </div>

            {/* View mode badge */}
            <div className="relative z-10 flex justify-center py-2.5">
              <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full">
                <Icon name="Eye" size={10} className="text-amber-400" />
                <span className="text-[10px] text-amber-400/80">Режим просмотра</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">
              {viewingChat ? (
                <div className="space-y-2 pt-2">
                  {chatMsgs.map((msg, i) => (
                    <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} animate-fade-in`} style={{ animationDelay: `${i * 0.04}s` }}>
                      <div className={`max-w-[75%] px-4 py-2.5 ${msg.own ? "bubble-out" : "bubble-in"}`}>
                        <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${msg.own ? "justify-end" : ""}`}>
                          <span className="text-[10px] text-white/40">{msg.time}</span>
                          {msg.own && <Icon name="CheckCheck" size={11} className="text-cyan-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">Переписки аккаунта</p>
                  {contacts.slice(0, 4).map((c, i) => {
                    const msgs = acc.messages[c.id] || [];
                    const lastMsg = msgs[msgs.length - 1];
                    return (
                      <button
                        key={c.id}
                        onClick={() => setViewingAccountChat(c.id)}
                        className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:glass-bright transition-all animate-fade-in"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-sm font-bold text-white`}>
                            {c.avatar}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColors[c.status]} border-2 border-[#0a0812]`} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">{c.name}</p>
                            <span className="text-[11px] text-white/30">{lastMsg?.time || ""}</span>
                          </div>
                          <p className="text-xs text-white/40 truncate mt-0.5">{lastMsg?.text || "Нет сообщений"}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-white/20">{msgs.length}</span>
                          <Icon name="ChevronRight" size={14} className="text-white/20" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
            <button onClick={() => { setOpenChat(null); setEmojiPanelOpen(false); }} className="w-8 h-8 rounded-full glass flex items-center justify-center">
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

          {/* Emoji Panel */}
          {emojiPanelOpen && (
            <div className="relative z-10 border-t border-white/5 glass-bright animate-fade-in">
              <div className="flex gap-1 px-3 pt-2 pb-1 border-b border-white/5 overflow-x-auto">
                {emojiSets.map((set, i) => (
                  <button
                    key={i}
                    onClick={() => setEmojiCategory(i)}
                    className={`px-2.5 py-1.5 rounded-lg text-sm flex-shrink-0 transition-all ${emojiCategory === i ? "bg-purple-500/20 border border-purple-500/30" : "hover:bg-white/5"}`}
                  >
                    {set.label}
                  </button>
                ))}
              </div>
              <div className="p-2 h-44 overflow-y-auto">
                <p className="text-[10px] text-white/30 font-semibold px-1 mb-1.5">{emojiSets[emojiCategory].name}</p>
                <div className="grid grid-cols-8 gap-0.5">
                  {emojiSets[emojiCategory].emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => { setMsgInput(prev => prev + emoji); }}
                      className="w-full aspect-square rounded-lg flex items-center justify-center text-xl hover:bg-white/10 active:scale-90 transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
              <button
                onClick={() => setEmojiPanelOpen(!emojiPanelOpen)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${emojiPanelOpen ? "bg-purple-500/30 border border-purple-500/30" : "glass"}`}
              >
                <Icon name="Smile" size={16} className={emojiPanelOpen ? "text-purple-400" : "text-white/40"} />
              </button>
              {msgInput.trim() ? (
                <button onClick={() => { sendMessage(); setEmojiPanelOpen(false); }} className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
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
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                  placeholder="Поиск контактов..."
                />
              </div>
              <button
                onClick={() => setAddContactOpen(true)}
                className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
              >
                <Icon name="UserPlus" size={18} className="text-white" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">В сети сейчас</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {contactsList.filter(c => c.status === "online").map((c, i) => (
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
                {contactsList.map((c, i) => (
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
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); startCall(c); }}
                        className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center"
                      >
                        <Icon name="Video" size={14} className="text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteContact(c.id); }}
                        className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-red-500/30 transition-all"
                      >
                        <Icon name="Trash2" size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Contact Modal */}
        {addContactOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setAddContactOpen(false); setNewContactName(""); }}>
            <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="UserPlus" size={20} className="text-purple-400" />
                Добавить контакт
              </h3>

              <div className="mb-4">
                <label className="text-xs text-white/40 mb-1.5 block">Имя и фамилия</label>
                <input
                  autoFocus
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddContact()}
                  className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                  placeholder="Например: Иван Сидоров"
                />
              </div>

              <div className="mb-5">
                <label className="text-xs text-white/40 mb-2 block">Статус</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewContactStatus("online")}
                    className={`flex-1 glass rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all ${newContactStatus === "online" ? "border border-emerald-500/40 bg-emerald-500/10" : ""}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/70">В сети</span>
                  </button>
                  <button
                    onClick={() => setNewContactStatus("offline")}
                    className={`flex-1 glass rounded-xl py-2.5 flex items-center justify-center gap-2 transition-all ${newContactStatus === "offline" ? "border border-gray-500/40 bg-gray-500/10" : ""}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-xs text-white/70">Не в сети</span>
                  </button>
                </div>
              </div>

              {newContactName.trim() && (
                <div className="glass rounded-xl p-3 mb-4 flex items-center gap-3 animate-fade-in">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrads[Math.abs(newContactName.length) % avatarGrads.length]} flex items-center justify-center text-xs font-bold text-white`}>
                    {newContactName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{newContactName.trim()}</p>
                    <p className="text-[11px] text-white/30">Предпросмотр контакта</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddContact}
                disabled={!newContactName.trim()}
                className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Добавить
              </button>
            </div>
          </div>
        )}

        {/* CHATS TAB */}
        {tab === "chats" && (() => {
          const activeAcc = activeAccountId !== null ? linkedAccounts.find(a => a.id === activeAccountId) : null;
          const displayMessages = activeAcc ? activeAcc.messages : localMessages;
          const displayContacts = activeAcc ? contacts.slice(0, 4) : contactsList;

          return (
            <div className="animate-fade-in">
              {activeAcc && (
                <div className="glass rounded-2xl p-2.5 mb-3 flex items-center gap-2.5 border border-amber-500/20">
                  <Icon name="Eye" size={12} className="text-amber-400" />
                  <p className="text-[11px] text-amber-400/80 flex-1">Просмотр переписки: <span className="font-semibold text-amber-300">{activeAcc.name}</span></p>
                  <button onClick={() => setActiveAccountId(null)} className="text-[10px] text-white/40 hover:text-white/60 transition-colors">Выйти</button>
                </div>
              )}

              <div className="relative mb-4">
                <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className="w-full glass rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                  placeholder="Поиск по чатам..."
                />
              </div>

              <div className="space-y-2">
                {displayContacts.map((c, i) => {
                  const msgs = displayMessages[c.id] || [];
                  const lastMsg = msgs[msgs.length - 1];
                  const unread = !activeAcc && c.status === "online" && !lastMsg?.own ? 1 : 0;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (activeAcc) {
                          setViewingAccount(activeAcc.id);
                          setViewingAccountChat(c.id);
                        } else {
                          setOpenChat(c);
                        }
                      }}
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
                  <Icon name={activeAcc ? "Eye" : "Lock"} size={14} className={activeAcc ? "text-amber-400" : "text-purple-400"} />
                </div>
                <p className="text-[11px] text-white/40">{activeAcc ? "Вы просматриваете чужую переписку" : "Все сообщения защищены сквозным шифрованием"}</p>
              </div>
            </div>
          );
        })()}

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
                      const c = contactsList.find(ct => ct.name === call.name) ?? { id: call.id, name: call.name, avatar: call.avatar, status: "online" as const };
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
                {contactsList.filter(c => c.status === "online").slice(0, 3).map((c, i) => (
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
        {tab === "wallet" && walletLocked && (
          <div className="animate-fade-in flex flex-col items-center justify-center pt-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 glow-purple">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Кошелёк защищён</h2>
            <p className="text-sm text-white/40 mb-8">Введите PIN-код для входа</p>

            <div className="flex gap-3 mb-6">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    pinError
                      ? "bg-red-500 scale-110"
                      : pinInput.length > i
                        ? "bg-gradient-to-br from-purple-400 to-pink-400 scale-110"
                        : "bg-white/10 border border-white/20"
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-red-400 text-xs mb-4 animate-fade-in">Неверный PIN-код</p>
            )}

            <div className="grid grid-cols-3 gap-3 w-64 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((key, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (key === null) return;
                    if (key === "del") { setPinInput(prev => prev.slice(0, -1)); return; }
                    const next = pinInput + key;
                    setPinInput(next);
                    if (next.length === 4) {
                      setTimeout(() => {
                        if (next === walletPin) {
                          setWalletLocked(false);
                          setPinInput("");
                          setPinError(false);
                        } else {
                          setPinError(true);
                          setPinInput("");
                          setTimeout(() => setPinError(false), 1500);
                        }
                      }, 150);
                    }
                  }}
                  disabled={key === null}
                  className={`h-14 rounded-2xl flex items-center justify-center text-lg font-semibold transition-all ${
                    key === null
                      ? "opacity-0 cursor-default"
                      : key === "del"
                        ? "glass text-white/40 hover:text-white/70"
                        : "glass text-white hover:bg-white/10 active:scale-95"
                  }`}
                >
                  {key === "del" ? <Icon name="Delete" size={20} className="text-white/40" /> : key}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-white/20">PIN по умолчанию: 1234</p>
          </div>
        )}

        {tab === "wallet" && !walletLocked && (
          <div className="animate-fade-in">
            {/* Balance card */}
            <div className="rounded-3xl p-5 mb-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #06b6d4 100%)" }}>
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70 font-medium">Основной баланс</span>
                  <button onClick={() => setBalanceHidden(!balanceHidden)} className="hover:scale-110 transition-transform">
                    <Icon name={balanceHidden ? "EyeOff" : "Eye"} size={14} className="text-white/50" />
                  </button>
                </div>
                {balanceHidden ? (
                  <p className="text-3xl font-black text-white tracking-tight">••••••</p>
                ) : (
                  <p className="text-3xl font-black text-white tracking-tight">{walletBalance.toLocaleString("ru-RU")} ₽</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="TrendingUp" size={11} className="text-emerald-300" />
                  <span className="text-[11px] text-emerald-300 font-medium">{balanceHidden ? "•••" : "+1 800 ₽ за неделю"}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSendMoneyOpen(true)} className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                    <Icon name="Send" size={15} className="text-white" />
                    <span className="text-xs font-semibold text-white">Перевод</span>
                  </button>
                  <button onClick={() => setTopUpOpen(true)} className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                    <Icon name="Download" size={15} className="text-white" />
                    <span className="text-xs font-semibold text-white">Пополнить</span>
                  </button>
                  <button onClick={() => setWithdrawOpen(true)} className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 flex items-center justify-center gap-2 hover:bg-white/30 transition-all">
                    <Icon name="CreditCard" size={15} className="text-white" />
                    <span className="text-xs font-semibold text-white">Вывод</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick send */}
            <div className="mb-5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 px-1">Быстрый перевод</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {contactsList.filter(c => c.status !== "offline").map((c, i) => (
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
                        {balanceHidden ? "•••" : `${txn.type === "in" ? "+" : "−"}${txn.amount.toLocaleString("ru-RU")} ₽`}
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

            {/* Wallet actions */}
            <div className="mt-4 space-y-1.5">
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-2 px-1">Безопасность</p>
              <button
                onClick={() => { setWalletLocked(true); setPinInput(""); }}
                className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Icon name="Lock" size={16} className="text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">Заблокировать</p>
                  <p className="text-[11px] text-white/35">Закрыть кошелёк на PIN</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-white/20" />
              </button>

              <button
                onClick={() => setSettingPin(true)}
                className="glass rounded-2xl p-3.5 flex items-center gap-3 w-full hover:bg-white/5 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Icon name="KeyRound" size={16} className="text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium">Сменить PIN</p>
                  <p className="text-[11px] text-white/35">Изменить код доступа</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-white/20" />
              </button>

              <div className="glass rounded-2xl p-3 flex items-center gap-2.5 mt-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="ShieldCheck" size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Безопасные переводы</p>
                  <p className="text-[11px] text-white/40">Все транзакции защищены сквозным шифрованием</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change PIN Modal */}
        {settingPin && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { setSettingPin(false); setNewPin(""); setConfirmPin(""); }}>
            <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Icon name="KeyRound" size={20} className="text-purple-400" />
                Сменить PIN-код
              </h3>
              <p className="text-xs text-white/40 mb-5">Новый код должен содержать 4 цифры</p>

              <div className="mb-3">
                <label className="text-xs text-white/40 mb-1.5 block">Новый PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full glass rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-white font-bold placeholder:text-white/15 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                  placeholder="····"
                />
              </div>
              <div className="mb-5">
                <label className="text-xs text-white/40 mb-1.5 block">Повторите PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && handleSetNewPin()}
                  className={`w-full glass rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] text-white font-bold placeholder:text-white/15 outline-none border transition-all ${
                    confirmPin.length === 4 && confirmPin !== newPin ? "border-red-500/50" : "border-transparent focus:border-purple-500/50"
                  }`}
                  placeholder="····"
                />
                {confirmPin.length === 4 && confirmPin !== newPin && (
                  <p className="text-red-400 text-[11px] mt-1.5 text-center">PIN-коды не совпадают</p>
                )}
              </div>

              <button
                onClick={handleSetNewPin}
                disabled={newPin.length < 4 || newPin !== confirmPin}
                className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        )}

        {/* Top Up Modal */}
        {topUpOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { if (!topUpSuccess) { setTopUpOpen(false); setTopUpAmount(""); setTopUpCard(""); setTopUpExpiry(""); setTopUpCvv(""); } }}>
            <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              {topUpSuccess ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold text-white">Пополнено!</p>
                  <p className="text-sm text-white/40 mt-1">+{parseFloat(topUpAmount).toLocaleString("ru-RU")} ₽</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Icon name="CreditCard" size={20} className="text-emerald-400" />
                    Пополнить кошелёк
                  </h3>
                  <p className="text-xs text-white/40 mb-5">С банковской карты</p>

                  {savedCards.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-white/40 mb-2">Сохранённые карты</p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {savedCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => setTopUpCard(card.last4.padStart(16, "0"))}
                            className={`glass rounded-xl px-3 py-2 flex items-center gap-2 flex-shrink-0 hover:bg-white/10 transition-all ${topUpCard.replace(/\D/g, "").endsWith(card.last4) ? "border border-purple-500/40" : ""}`}
                          >
                            <span className="text-sm">💳</span>
                            <span className="text-xs text-white/70">{card.type} ••{card.last4}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="text-xs text-white/40 mb-1.5 block">Номер карты</label>
                    <input
                      value={formatCardNumber(topUpCard)}
                      onChange={e => setTopUpCard(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white font-mono tracking-wider placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                      placeholder="0000 0000 0000 0000"
                    />
                    {topUpCard.replace(/\D/g, "").length >= 1 && (
                      <p className="text-[11px] text-purple-400 mt-1">{getCardType(topUpCard)}</p>
                    )}
                  </div>

                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="text-xs text-white/40 mb-1.5 block">Срок</label>
                      <input
                        value={formatExpiry(topUpExpiry)}
                        onChange={e => setTopUpExpiry(e.target.value)}
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                        placeholder="MM/ГГ"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-white/40 mb-1.5 block">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={topUpCvv}
                        onChange={e => setTopUpCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white font-mono text-center placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                        placeholder="•••"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="text-xs text-white/40 mb-1.5 block">Сумма пополнения</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={topUpAmount}
                        onChange={e => setTopUpAmount(e.target.value)}
                        className="w-full glass rounded-xl px-4 py-3 text-xl text-white font-bold placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">₽</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[500, 1000, 2000, 5000].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setTopUpAmount(String(amt))}
                          className={`flex-1 glass rounded-lg py-1.5 text-xs text-center transition-all ${topUpAmount === String(amt) ? "text-purple-400 border border-purple-500/30" : "text-white/40 hover:text-white/60"}`}
                        >
                          {amt.toLocaleString("ru-RU")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleTopUp}
                    disabled={!topUpAmount || parseFloat(topUpAmount) <= 0 || topUpCard.replace(/\D/g, "").length < 16 || topUpCvv.length < 3}
                    className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Пополнить {topUpAmount ? `${parseFloat(topUpAmount).toLocaleString("ru-RU")} ₽` : ""}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <Icon name="Lock" size={10} className="text-emerald-400" />
                    <span className="text-[10px] text-white/30">Данные карты защищены шифрованием</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {withdrawOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => { if (!withdrawSuccess) { setWithdrawOpen(false); setWithdrawAmount(""); setWithdrawCard(""); } }}>
            <div className="w-full max-w-lg glass-bright rounded-t-3xl p-5 pb-8 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              {withdrawSuccess ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={32} className="text-emerald-400" />
                  </div>
                  <p className="text-lg font-bold text-white">Отправлено!</p>
                  <p className="text-sm text-white/40 mt-1">−{parseFloat(withdrawAmount).toLocaleString("ru-RU")} ₽ на карту</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Icon name="ArrowUpRight" size={20} className="text-amber-400" />
                    Вывод на карту
                  </h3>
                  <p className="text-xs text-white/40 mb-5">На банковскую карту</p>

                  {savedCards.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-white/40 mb-2">Сохранённые карты</p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {savedCards.map(card => (
                          <button
                            key={card.id}
                            onClick={() => setWithdrawCard(card.last4.padStart(16, "0"))}
                            className={`glass rounded-xl px-3 py-2 flex items-center gap-2 flex-shrink-0 hover:bg-white/10 transition-all ${withdrawCard.replace(/\D/g, "").endsWith(card.last4) ? "border border-purple-500/40" : ""}`}
                          >
                            <span className="text-sm">💳</span>
                            <span className="text-xs text-white/70">{card.type} ••{card.last4}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="text-xs text-white/40 mb-1.5 block">Номер карты получателя</label>
                    <input
                      value={formatCardNumber(withdrawCard)}
                      onChange={e => setWithdrawCard(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white font-mono tracking-wider placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                      placeholder="0000 0000 0000 0000"
                    />
                    {withdrawCard.replace(/\D/g, "").length >= 1 && (
                      <p className="text-[11px] text-purple-400 mt-1">{getCardType(withdrawCard)}</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="text-xs text-white/40 mb-1.5 block">Сумма вывода</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full glass rounded-xl px-4 py-3 text-xl text-white font-bold placeholder:text-white/20 outline-none border border-transparent focus:border-purple-500/50 transition-all"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm font-medium">₽</span>
                    </div>
                    <p className="text-[11px] text-white/30 mt-1.5">Доступно: {walletBalance.toLocaleString("ru-RU")} ₽</p>
                    <div className="flex gap-2 mt-2">
                      {[500, 1000, 2000].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setWithdrawAmount(String(Math.min(amt, walletBalance)))}
                          className={`flex-1 glass rounded-lg py-1.5 text-xs text-center transition-all ${withdrawAmount === String(amt) ? "text-purple-400 border border-purple-500/30" : "text-white/40 hover:text-white/60"}`}
                        >
                          {amt.toLocaleString("ru-RU")}
                        </button>
                      ))}
                      <button
                        onClick={() => setWithdrawAmount(String(walletBalance))}
                        className="flex-1 glass rounded-lg py-1.5 text-xs text-center text-white/40 hover:text-white/60 transition-all"
                      >
                        Всё
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletBalance || withdrawCard.replace(/\D/g, "").length < 16}
                    className="w-full btn-gradient py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Вывести {withdrawAmount ? `${parseFloat(withdrawAmount).toLocaleString("ru-RU")} ₽` : ""}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <Icon name="Lock" size={10} className="text-emerald-400" />
                    <span className="text-[10px] text-white/30">Перевод защищён шифрованием</span>
                  </div>
                </>
              )}
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
                    {contactsList.map((c, i) => (
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