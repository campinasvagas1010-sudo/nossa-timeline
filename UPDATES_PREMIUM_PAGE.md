# Atualizações para app/h/[slug]/page.tsx

## Adicionar ao topo (depois dos imports existentes):

```typescript
import {  EyeOff, Eye, Ban } from 'lucide-react';
```

## Adicionar novos states (depois dos states existentes):

```typescript
const [hiddenMoments, setHiddenMoments] = useState<number[]>([]);
const [timeRemaining, setTimeRemaining] = useState<string>('');
const [isExpired, setIsExpired] = useState(false);
```

## Atualizar useEffect de carregamento:

```typescript
useEffect(() => {
  if (slug) {
    loadStory();
    // Carregar momentos ocultados do localStorage
    const saved = localStorage.getItem(`hidden_moments_${slug}`);
    if (saved) {
      setHiddenMoments(JSON.parse(saved));
    }
  }
}, [slug]);
```

## Adicionar novo useEffect para contador:

```typescript
// Contador regressivo
useEffect(() => {
  if (!story?.expires_at) return;

  const updateTimer = () => {
    const now = new Date().getTime();
    const expiresAt = new Date(story.expires_at).getTime();
    const distance = expiresAt - now;

    if (distance < 0) {
      setIsExpired(true);
      setTimeRemaining('Expirado');
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeRemaining(`${hours}h ${minutes}m`);
  };

  updateTimer();
  const interval = setInterval(updateTimer, 60000);

  return () => clearInterval(interval);
}, [story]);
```

## Atualizar loadStory para verificar expiração:

```typescript
const loadStory = async () => {
  try {
    const response = await fetch(`/api/stories/${slug}`);
    const data = await response.json();
    
    if (data.success) {
      setStory(data.story);
      
      // Verificar se expirou
      if (data.story.expires_at) {
        const now = new Date().getTime();
        const expiresAt = new Date(data.story.expires_at).getTime();
        setIsExpired(now > expiresAt);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar história:', error);
  } finally {
    setLoading(false);
  }
};
```

## Adicionar função para ocultar momentos:

```typescript
const toggleHideMoment = (index: number) => {
  const newHidden = hiddenMoments.includes(index)
    ? hiddenMoments.filter(i => i !== index)
    : [...hiddenMoments, index];
  
  setHiddenMoments(newHidden);
  localStorage.setItem(`hidden_moments_${slug}`, JSON.stringify(newHidden));
};
```

## Adicionar tela de expiração (antes do return principal):

```typescript
// Se expirou, mostrar mensagem
if (isExpired) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">História Expirada</h1>
        <p className="text-gray-600 mb-6">
          Esta história ficou disponível por 48 horas e agora foi arquivada para proteger a privacidade dos participantes.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
        >
          <HomeIcon className="w-5 h-5" />
          Criar Minha História
        </Link>
      </div>
    </div>
  );
}
```

## Adicionar contador no header (dentro do flex items-center gap-3):

```typescript
{/* Contador de expiração */}
{story.is_premium && timeRemaining && (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
    <Clock className="w-4 h-4" />
    Expira em {timeRemaining}
  </div>
)}
```

## Atualizar renderização dos momentos na timeline:

Dentro do map dos momentos, adicionar:

```typescript
const isHidden = hiddenMoments.includes(index);

// No início do card, adicionar:
{/* Overlay de oculto */}
{isHidden && (
  <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-10 rounded-2xl">
    <div className="text-center">
      <Ban className="w-16 h-16 text-white mx-auto mb-2" />
      <p className="text-white font-semibold">Momento Oculto</p>
      <p className="text-gray-300 text-sm">Privacidade protegida</p>
    </div>
  </div>
)}

// No footer do card, adicionar botão:
{story.is_premium && (
  <button
    onClick={() => toggleHideMoment(index)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all text-xs ${
      isHidden
        ? 'bg-green-100 text-green-700 hover:bg-green-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {isHidden ? (
      <>
        <Eye className="w-3 h-3" />
        Mostrar
      </>
    ) : (
      <>
        <EyeOff className="w-3 h-3" />
        Ocultar
      </>
    )}
  </button>
)}
```

## Mudar displayedMoments para usar timeline:

```typescript
const displayedMoments = story.is_premium ? story.timeline : story.timeline?.slice(0, 4) || [];
```
