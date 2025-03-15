import { useState, useEffect, useCallback } from "react";
import { Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
import _ from "lodash";

import moment from "moment";

interface ICountUP {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface IComent {
  usuario: string;
  texto: string;
  data: string;
  id: number;
}

moment.locale("pt-br");

const noShuffledImages = [
  "/foto01.jpeg",
  "/foto02.jpeg",
  "/foto03.jpeg",
  "/foto04.jpeg",
  "/foto05.jpeg",
  "/foto06.jpeg",
  "/foto07.jpeg",
  "/foto08.jpeg",
  "/foto09.jpeg",
  "/foto10.jpeg",
  "/foto11.jpeg",
  "/foto12.jpeg",
  "/foto13.jpeg",
  "/foto14.jpeg",
  "/foto15.jpeg",
  "/foto16.jpeg",
  "/foto17.jpeg",
  "/foto18.jpeg",
  "/foto19.jpeg",
  "/foto20.jpeg",
  "/foto21.jpeg",
  "/foto22.jpeg",
  "/foto23.jpeg",
  "/foto24.jpeg",
  "/foto25.jpeg",
  "/foto26.jpeg",
  "/foto27.jpeg",
  "/foto28.jpeg",
  "/foto29.jpeg",
  "/foto30.jpeg",
  "/foto31.jpeg",
  "/foto32.jpeg",
];

const shuffedImages = _.shuffle(noShuffledImages);

const ContadorNamoro = () => {
  const myUser = { login: "zzz.bebel" };
  const startRelationshipDate = moment("2024-03-18T19:00:00").utc();

  const defaultComents: IComent[] = [
    { usuario: "Pessoa 01", texto: "Casal mais lindo! ❤️", data: "2025-03-10T14:30:00", id: 1 },
    { usuario: "Pessoa 02", texto: "Muitas felicidades! 🎉", data: "2025-03-12T09:45:00", id: 2 }
  ];

  // Limite de Caracteres para comentários
  const MAX_COMMENT_LENGTH = 100;

  // Estado para controlar a imagem atual no carrossel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [flow, setFlow] = useState<"R" | "L">("R");

  // Estado para o contador
  const [countUp, setCountUp] = useState<ICountUP | null>(null);

  // Estado para curtidas
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  // Estado para controlar os comentários
  const [coment, setComent] = useState("");
  const [coments, setComents] = useState<IComent[]>([]);
  const [showAllComents, setShowAllComents] = useState(false);

  // Estado para controlar o Salvar
  const [isSaved, setIsSaved] = useState<boolean | null>(null);

  // Função para ir para a próxima imagem
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % shuffedImages.length);

    if (flow === "L") setFlow("R");
  }, [setCurrentImageIndex, shuffedImages.length, flow]);

  // Função para ir para a imagem anterior
  const previousImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? shuffedImages.length - 1 : prev - 1));

    if (flow === "R") setFlow("L");
  }, [setCurrentImageIndex, shuffedImages.length, flow]);

  // Função para calcular tempo juntos
  const calcCountUp = useCallback(() => {
    const now = moment.utc();
    const start = moment.utc(startRelationshipDate);

    const years = now.diff(start, "years");
    start.add(years, "years");

    const months = now.diff(start, "months");
    start.add(months, "months");

    const weeks = now.diff(start, "weeks");
    start.add(weeks, "weeks");

    const days = now.diff(start, "days");
    start.add(days, "days");

    const hours = now.diff(start, "hours");
    start.add(hours, "hours");

    const minutes = now.diff(start, "minutes");
    start.add(minutes, "minutes");

    const seconds = now.diff(start, "seconds");
    return { years, months, weeks, days, hours, minutes, seconds };
  }, [startRelationshipDate]);

  // Função para formatar a data de início
  const formatDate = () => startRelationshipDate.format("D [de] MMM [de] YYYY");

  // Função para alternar curtida
  const handleLikes = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes! - 1 : likes! + 1);
  };

  // Função para formatar data de comentários
  const formatComentDate = (dateStr: string) => {
    const date = moment(dateStr);
    const now = moment();

    const diffInMinutes = now.diff(date, "minutes");

    if (diffInMinutes < 60) {
      if (diffInMinutes < 1) return "Agora há pouco";
      return `${diffInMinutes}m atrás`;
    }

    const diffInHours = now.diff(date, "hours");

    // Menos de 24 horas
    if (diffInHours < 24) {
      if (diffInHours < 1) return "Agora há pouco";
      return `${diffInHours}h atrás`;
    }

    const diffInDays = now.diff(date, "days");

    // Menos de 7 dias
    if (diffInDays < 7) {
      return `${diffInDays}d atrás`;
    }

    // Outras datas
    return date.format("D [de] MMM [de] YYYY");
  };

  // Função para excluir um comentário
  const removeComent = (id: number) => {
    const newComents = coments.filter((coment) => coment.id !== id);
    setComents(newComents);
    if (!newComents.length) localStorage.removeItem("savedComents");
  };

  // Função para adicionar um comentário
  const newComent = (e: React.FormEvent) => {
    e.preventDefault();
    if (coment.trim() !== "") {
      const trimmedComent = coment.trim().slice(0, MAX_COMMENT_LENGTH);

      const newComent: IComent = {
        usuario: myUser.login,
        texto: trimmedComent,
        data: moment().utc().toISOString(),
        id: coments.length + 1
      };
      setComents([...coments, newComent]);
      setComent("");
    }
  };

  // Função para compartilhar no WhatsApp
  const shareMessage = () => {
    const message = `Estamos juntos há ${countUp?.years} anos, ${countUp?.months} meses e ${countUp?.days} dias! ❤️🥰 #Amor #Felizes`;

    if (navigator.share) {
      navigator
        .share({
          title: "Nosso Tempo Juntos",
          text: message,
          url: window.location.href
        })
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      console.log("O compartilhamento nativo não é suportado neste navegador.");
    }
  };

  // Função para marcar como salvo
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Efeito para trocar imagens automaticamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (flow === "R") nextImage();
      else previousImage();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [nextImage, previousImage, flow]);

  // Atualizar contador a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCountUp(calcCountUp());
    }, 1000);

    return () => clearInterval(interval);
  }, [calcCountUp]);

  // Carregar comentários do localStorage na inicialização
  useEffect(() => {
    const savedComents = localStorage.getItem("savedComents");
    if (savedComents) {
      try {
        const parsedComents = JSON.parse(savedComents);
        setComents(parsedComents);
      } catch (e) {
        console.error("Erro ao carregar comentários do localStorage:", e);
        setComents(defaultComents);
      }
    } else {
      localStorage.setItem("savedComents", JSON.stringify(defaultComents));
    }
  }, []);

  // Carregar curtidas e isLiked do localStorage na inicialização
  useEffect(() => {
    const savedLikes = localStorage.getItem("likes");
    const savedIsLiked = localStorage.getItem("isLiked");

    if (savedLikes !== null && savedIsLiked !== null) {
      try {
        const parsedLikes = JSON.parse(savedLikes);
        const parsedIsLiked = JSON.parse(savedIsLiked);

        setLikes(parsedLikes);
        setIsLiked(parsedIsLiked);
      } catch (e) {
        console.error("Erro ao carregar curtidas e isLiked do localStorage:", e);
        setLikes(301);
        setIsLiked(false);
      }
    } else {
      localStorage.setItem("likes", JSON.stringify(301));
      localStorage.setItem("isLiked", JSON.stringify(false));
    }
  }, []);

  // Carregar isSaved do localStorage na inicialização
  useEffect(() => {
    const savedIsSaved = localStorage.getItem("isSaved");
    if (savedIsSaved !== null) {
      try {
        const parsedIsSaved = JSON.parse(savedIsSaved);
        setIsSaved(parsedIsSaved);
      } catch (e) {
        console.error("Erro ao carregar isSaved do localStorage:", e);
        setIsSaved(false);
      }
    } else {
      localStorage.setItem("isSaved", JSON.stringify(false));
    }
  }, []);

  // Salvar comentários no localStorage sempre que houver alterações
  useEffect(() => {
    if (coments.length) localStorage.setItem("savedComents", JSON.stringify(coments));
  }, [coments]);

  // Salvar os Likes e o Isliked
  useEffect(() => {
    if (likes !== null && isLiked !== null) {
      localStorage.setItem("likes", JSON.stringify(likes));
      localStorage.setItem("isLiked", JSON.stringify(isLiked));
    }
  }, [likes, isLiked]);

  // Salvar isSaved
  useEffect(() => {
    if (isSaved !== null) localStorage.setItem("isSaved", JSON.stringify(isSaved));
  }, [isSaved]);

  // Determinar quais comentários mostrar
  const visibleComents = showAllComents ? coments : coments.slice(-2);

  return (
    <div className='p-3 md:p-2 max-w-lg mx-auto bg-white rounded-lg shadow-md md:shadow-none'>
      {/* Cabeçalho */}
      <div className='flex items-center p-3 border-b'>
        <div className='h-12 w-12 md:h-18 md:w-18 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
          <div className='h-11 w-11 md:h-17 md:w-17 bg-white rounded-full flex items-center justify-center'>
            <img
              src={shuffedImages[currentImageIndex < shuffedImages.length - 1 ? currentImageIndex + 1 : 0]}
              alt='Perfil'
              className='h-10 w-10 md:h-15 md:w-15 rounded-full'
            />
          </div>
        </div>
        <span className='ml-2 font-semibold md:text-2xl'>Contador de Tempo Juntos</span>
        <div className='ml-auto'>
          <svg className='w-5 h-5 md:w-8 md:h-8' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'></path>
          </svg>
        </div>
      </div>

      {/* Contador de tempo (acima do carrossel) */}
      <div className='bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4'>
        <div className='flex items-center justify-center gap-2 mb-2'>
          <Clock className='h-5 w-5' />
          <span className='font-medium'>Nossa jornada juntos</span>
        </div>

        <div className='grid grid-cols-4 gap-2 text-center text-black'>
          <div className='bg-white bg-opacity-20 rounded-lg p-2'>
            <div className='text-2xl font-bold'>{countUp?.years || 0}</div>
            <div className='text-xs'>Anos</div>
          </div>
          <div className='bg-white bg-opacity-20 rounded-lg p-2'>
            <div className='text-2xl font-bold'>{countUp?.months || 0}</div>
            <div className='text-xs'>Meses</div>
          </div>
          <div className='bg-white bg-opacity-20 rounded-lg p-2'>
            <div className='text-2xl font-bold'>{countUp?.weeks || 0}</div>
            <div className='text-xs'>Semanas</div>
          </div>
          <div className='bg-white bg-opacity-20 rounded-lg p-2'>
            <div className='text-2xl font-bold'>{countUp?.days || 0}</div>
            <div className='text-xs'>Dias</div>
          </div>
        </div>

        <div className='flex justify-center mt-2 gap-2 text-center text-black'>
          <div className='bg-white bg-opacity-10 rounded-lg px-2 py-1'>
            <span className='font-semibold'>{countUp?.hours || 0}</span>h
          </div>
          <div className='bg-white bg-opacity-10 rounded-lg px-2 py-1'>
            <span className='font-semibold'>{countUp?.minutes || 0}</span>m
          </div>
          <div className='bg-white bg-opacity-10 rounded-lg px-2 py-1'>
            <span className='font-semibold'>{countUp?.seconds || 0}</span>s
          </div>
        </div>

        <div className='text-center mt-2 text-sm font-light'>Juntos desde {formatDate()}</div>
      </div>

      {/* Carrossel de imagens */}
      <div className='relative'>
        <img src={shuffedImages[currentImageIndex]} alt='Foto do casal' className='w-full aspect-square object-cover' />

        {/* Botões de navegação */}
        <button
          onClick={previousImage}
          className='absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100'
        >
          <ChevronLeft className='h-6 w-6' />
        </button>

        <button
          onClick={nextImage}
          className='absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100'
        >
          <ChevronRight className='h-6 w-6' />
        </button>

        {/* Indicadores do carrossel */}
        <div className='absolute bottom-2 left-0 right-0 flex justify-center space-x-1'>
          {shuffedImages.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-blue-500" : "bg-gray-300"}`} />
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className='py-3'>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-4'>
            <button onClick={handleLikes}>
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button>
              <MessageCircle className='h-6 w-6' />
            </button>
            <button>
              <Send className='h-6 w-6' onClick={shareMessage} />
            </button>
          </div>
          <button>
            <Bookmark className={`h-6 w-6 ${isSaved ? "fill-black text-black" : ""}`} onClick={handleSave} />
          </button>
        </div>
      </div>

      {/* Curtidas */}
      <div className='font-semibold mb-2'>{likes || 0} curtidas</div>

      {/* Legenda */}
      <div className='mb-4'>
        <span className='font-semibold'>Luiz Henrique: </span>
        <p className='ml-1 pr-4'>
          <br />
          <br />
          <strong>De: </strong>Luiz
          <br />
          <strong>Para:</strong> Bebel.
          <br />
          <br />
          <p>Quem diria, não é? 💕 Um ano, minha gatinha! 🐱✨</p>
          <br />
          <p>
            Passou tão rápido que parece que foi ontem que eu estava ansioso para te ver, tremendo de expectativa pelas suas ligações todas
            as noites. Aqueles dias ainda parecem um sonho...
          </p>
          <p>Foi ali que tudo começou, não foi, princesa? 💖</p>
          <p>Aquelas noites que pareciam durar minutos, mas que na verdade eram horas. ⏱️</p>
          <br />
          <p>Em meio a tantas coincidências, nos conhecemos. </p>
          <p>E hoje, não tenho dúvidas de que este um ano é só o começo de tudo o que vamos viver juntos. 💫</p>
          <br />
          <p>Você é, sem sombra de dúvidas, a pessoa mais importante pra mim. 💎</p>
          <p> Você não é apenas o meu coração, mas também a minha alma. 💕</p>
          <p>Você é uma gota de perfeição, a minha lua. 🌙</p> <br />
          <p>Nossos sonhos estão se realizando, e o melhor de tudo é que vamos viver tudo isso lado a lado. 👩‍❤️‍💋‍👨</p>
          <p>Não vejo a hora de ouvir todas as músicas que você prometeu me dedicar. 🎶</p>
          <br />
          <p>Você é a minha princesinha, minha moreninha, minha praieira, o meu bebê, meu dengo, minha vida. 🌟</p>
          <p>Sempre será o meu tudo. 💕</p>
          <br />
          <p>Tenho tanto a expressar para você, mas sei que palavras não são suficientes. 📝 </p>
          <p> Só de olhar para você, eu sinto que digo tudo o que meu coração transborda. ❤️</p>
          <br />
          <p>Este é apenas o primeiro de muitos anos, minha alagoana. 🌊 </p>
          <p>Te amo eternamente, minha princesa. 👑</p> <br />
          <p>
            Cada um desses <strong>{moment().diff(startRelationshipDate, "days")} dias</strong> ao seu lado foi um presente! 🎁❤️
          </p>
          <br /> <strong>#amor❤️ #namoro💍 #felicidade😀 #eternidade💒</strong>
        </p>
      </div>

      {/* Botão Ver Mais Comentários */}
      {coments.length > 2 && (
        <button onClick={() => setShowAllComents(!showAllComents)} className='text-gray-500 text-sm mb-2 hover:text-gray-700'>
          {showAllComents ? "Mostrar menos comentários" : `Ver todos os ${coments.length} comentários`}
        </button>
      )}

      {/* Comentários */}
      <div className='max-h-64 overflow-y-auto'>
        {visibleComents.map((coment, index) => (
          <div key={index} className='mb-2'>
            <div className='flex items-start'>
              <div className='w-[85%] break-words'>
                <span className='font-semibold'>{coment.usuario}</span>
                <span className='ml-1'>{coment.texto}</span>
              </div>
              <div className='w-[15%] flex justify-end items-center ml-2'>
                <span className='text-xs text-gray-500 mr-2 whitespace-nowrap'>{formatComentDate(coment.data)}</span>
                {coment.usuario === myUser.login && (
                  <button onClick={() => removeComent(coment.id)} className='text-gray-400 hover:text-red-500'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adicionar comentário */}
      <form onSubmit={newComent} className='flex items-center p-3 border-t'>
        <input
          type='text'
          placeholder='Adicione um comentário...'
          className='flex-grow text-sm outline-none'
          value={coment}
          onChange={(e) => setComent(e.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
        />
        <div className='text-xs text-gray-400 mr-2'>
          {coment.length}/{MAX_COMMENT_LENGTH}
        </div>
        <button
          type='submit'
          className={`text-blue-500 font-semibold ${coment.trim() === "" ? "opacity-50" : ""}`}
          disabled={coment.trim() === ""}
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default ContadorNamoro;
