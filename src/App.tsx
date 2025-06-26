import { useEffect, useState } from 'react';

interface CardFace {
  name: string;
  image_uris: {
    normal: string;
  };
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
}

interface Card {
  id: string;
  name: string;
  set_name: string;
  set: string;
  collector_number: string;
  rarity: string;
  layout: string;
  image_uris?: { normal: string };
  card_faces?: CardFace[];
  type_line?: string;
  mana_cost?: string;
  oracle_text?: string;
}

function App() {
  const sets = ['fin', 'fic', 'fca', 'tfin'];
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownedCards, setOwnedCards] = useState<{ [cardId: string]: boolean }>({});
  const [flippedCards, setFlippedCards] = useState<{ [cardId: string]: boolean }>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOwned, setFilterOwned] = useState<'all' | 'owned' | 'missing'>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedSet, setSelectedSet] = useState<string>('all');

  const rarityOrder = ['common', 'uncommon', 'rare', 'mythic', 'special'];

const manaSymbols: { [symbol: string]: string } = {
  '{W}': 'https://svgs.scryfall.io/card-symbols/W.svg',
  '{U}': 'https://svgs.scryfall.io/card-symbols/U.svg',
  '{B}': 'https://svgs.scryfall.io/card-symbols/B.svg',
  '{R}': 'https://svgs.scryfall.io/card-symbols/R.svg',
  '{G}': 'https://svgs.scryfall.io/card-symbols/G.svg',
  '{C}': 'https://svgs.scryfall.io/card-symbols/C.svg',
  '{T}': 'https://svgs.scryfall.io/card-symbols/T.svg',
  '{0}': 'https://svgs.scryfall.io/card-symbols/0.svg',
  '{1}': 'https://svgs.scryfall.io/card-symbols/1.svg',
  '{2}': 'https://svgs.scryfall.io/card-symbols/2.svg',
  '{3}': 'https://svgs.scryfall.io/card-symbols/3.svg',
  '{4}': 'https://svgs.scryfall.io/card-symbols/4.svg',
  '{5}': 'https://svgs.scryfall.io/card-symbols/5.svg',
  '{6}': 'https://svgs.scryfall.io/card-symbols/6.svg',
  '{7}': 'https://svgs.scryfall.io/card-symbols/7.svg',
  '{8}': 'https://svgs.scryfall.io/card-symbols/8.svg',
  '{9}': 'https://svgs.scryfall.io/card-symbols/9.svg',
  '{10}': 'https://svgs.scryfall.io/card-symbols/10.svg',
  '{11}': 'https://svgs.scryfall.io/card-symbols/11.svg',
  '{12}': 'https://svgs.scryfall.io/card-symbols/12.svg',
  '{13}': 'https://svgs.scryfall.io/card-symbols/13.svg',
  '{14}': 'https://svgs.scryfall.io/card-symbols/14.svg',
  '{15}': 'https://svgs.scryfall.io/card-symbols/15.svg',
  '{16}': 'https://svgs.scryfall.io/card-symbols/16.svg',
  '{17}': 'https://svgs.scryfall.io/card-symbols/17.svg',
  '{18}': 'https://svgs.scryfall.io/card-symbols/18.svg',
  '{19}': 'https://svgs.scryfall.io/card-symbols/19.svg',
  '{20}': 'https://svgs.scryfall.io/card-symbols/20.svg',
  '{X}': 'https://svgs.scryfall.io/card-symbols/X.svg',
  '{Y}': 'https://svgs.scryfall.io/card-symbols/Y.svg',
  '{Z}': 'https://svgs.scryfall.io/card-symbols/Z.svg',
  '{S}': 'https://svgs.scryfall.io/card-symbols/S.svg',
  '{Q}': 'https://svgs.scryfall.io/card-symbols/Q.svg',
  '{E}': 'https://svgs.scryfall.io/card-symbols/E.svg',
  '{W/U}': 'https://svgs.scryfall.io/card-symbols/WU.svg',
  '{W/B}': 'https://svgs.scryfall.io/card-symbols/WB.svg',
  '{U/B}': 'https://svgs.scryfall.io/card-symbols/UB.svg',
  '{U/R}': 'https://svgs.scryfall.io/card-symbols/UR.svg',
  '{B/R}': 'https://svgs.scryfall.io/card-symbols/BR.svg',
  '{B/G}': 'https://svgs.scryfall.io/card-symbols/BG.svg',
  '{R/G}': 'https://svgs.scryfall.io/card-symbols/RG.svg',
  '{R/W}': 'https://svgs.scryfall.io/card-symbols/RW.svg',
  '{G/W}': 'https://svgs.scryfall.io/card-symbols/GW.svg',
  '{G/U}': 'https://svgs.scryfall.io/card-symbols/GU.svg',
  '{2/W}': 'https://svgs.scryfall.io/card-symbols/2W.svg',
  '{2/U}': 'https://svgs.scryfall.io/card-symbols/2U.svg',
  '{2/B}': 'https://svgs.scryfall.io/card-symbols/2B.svg',
  '{2/R}': 'https://svgs.scryfall.io/card-symbols/2R.svg',
  '{2/G}': 'https://svgs.scryfall.io/card-symbols/2G.svg',
  '{W/P}': 'https://svgs.scryfall.io/card-symbols/WP.svg',
  '{U/P}': 'https://svgs.scryfall.io/card-symbols/UP.svg',
  '{B/P}': 'https://svgs.scryfall.io/card-symbols/BP.svg',
  '{R/P}': 'https://svgs.scryfall.io/card-symbols/RP.svg',
  '{G/P}': 'https://svgs.scryfall.io/card-symbols/GP.svg',
  '{P}': 'https://svgs.scryfall.io/card-symbols/P.svg',
  '{HW}': 'https://svgs.scryfall.io/card-symbols/HW.svg'
};


  const replaceManaSymbolsWithIcons = (text: string = ''): React.ReactNode[] => {
    const regex = /\{[^}]+\}|[^\{\}]+/g;
    const parts = text.match(regex) || [];

    return parts.map((part, index) => {
      const trimmed = part.trim();
      const iconUrl = manaSymbols[trimmed];
      if (iconUrl) {
        return (
          <img
            key={index}
            src={iconUrl}
            alt={trimmed}
            style={{ width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 2px' }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

    useEffect(() => {
    const stored = localStorage.getItem('ownedCards');
    if (stored) setOwnedCards(JSON.parse(stored));

    const fetchAllCardsFromSet = async (setCode: string): Promise<Card[]> => {
      let allCards: Card[] = [];
      let url = `https://api.scryfall.com/cards/search?order=set&q=set:${setCode}&unique=prints`;

      while (url) {
        const res = await fetch(url);
        const data = await res.json();
        allCards = allCards.concat(data.data);
        url = data.has_more ? data.next_page : '';
      }

      return allCards;
    };

    const loadAllCards = async () => {
      const allCardsArray = await Promise.all(sets.map(set => fetchAllCardsFromSet(set)));
      setCards(allCardsArray.flat());
      setLoading(false);
    };

    loadAllCards();
  }, []);

  const toggleOwnership = (cardId: string) => {
    setOwnedCards(prev => {
      const updated = { ...prev, [cardId]: !prev[cardId] };
      localStorage.setItem('ownedCards', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCardFace = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getImageUrl = (card: Card) => {
    if (card.image_uris?.normal) return card.image_uris.normal;
    if (card.card_faces) {
      const faceIndex = flippedCards[card.id] ? 1 : 0;
      return card.card_faces[faceIndex]?.image_uris?.normal || '';
    }
    return '';
  };

  const uniqueSets = Array.from(new Set(cards.map(c => c.set_name)));
  const uniqueRarities = Array.from(new Set(cards.map(c => c.rarity)));
  const groupedByRarity: { [key: string]: Card[] } = {};
  cards.forEach(card => {
    if (!groupedByRarity[card.rarity]) {
      groupedByRarity[card.rarity] = [];
    }
    groupedByRarity[card.rarity].push(card);
  });
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Cartas Magic × Final Fantasy</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '5px', minWidth: '200px' }}
        />
        <select value={filterOwned} onChange={e => setFilterOwned(e.target.value as any)} style={{ padding: '5px' }}>
          <option value="all">Todas</option>
          <option value="owned">Solo tengo</option>
          <option value="missing">Solo me faltan</option>
        </select>
        <select value={selectedRarity} onChange={e => setSelectedRarity(e.target.value)} style={{ padding: '5px' }}>
          <option value="all">Todas las rarezas</option>
          {uniqueRarities.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={selectedSet} onChange={e => setSelectedSet(e.target.value)} style={{ padding: '5px' }}>
          <option value="all">Todos los sets</option>
          {uniqueSets.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p>Cargando cartas...</p> : (
        <>
          <p>Total: {cards.length} cartas</p>
          {rarityOrder.map(rarity => {
            const group = groupedByRarity[rarity];
            if (!group) return null;

            const sortedGroup = group.sort((a, b) =>
              (parseInt(a.collector_number.replace(/\D/g, '')) || 0) -
              (parseInt(b.collector_number.replace(/\D/g, '')) || 0)
            );

            const filteredGroup = sortedGroup.filter(card => {
              const nameMatches = card.name.toLowerCase().includes(searchTerm.toLowerCase());
              const isOwned = !!ownedCards[card.id];
              const ownershipMatches = filterOwned === 'all' ||
                (filterOwned === 'owned' && isOwned) ||
                (filterOwned === 'missing' && !isOwned);
              const rarityMatches = selectedRarity === 'all' || card.rarity === selectedRarity;
              const setMatches = selectedSet === 'all' || card.set_name === selectedSet;
              return nameMatches && ownershipMatches && rarityMatches && setMatches;
            });

            if (filteredGroup.length === 0) return null;

            const ownedCount = filteredGroup.filter(c => ownedCards[c.id]).length;

            return (
              <div key={rarity}>
                <h2 style={{ marginTop: '2rem' }}>
                  Rareza: {rarity} ({ownedCount} de {filteredGroup.length})
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px'
                }}>
                  {filteredGroup.map(c => (
                    <div
                      key={c.id}
                      style={{
                        border: ownedCards[c.id] ? '2px solid green' : '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '8px',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <img
                        src={getImageUrl(c)}
                        alt={c.name}
                        style={{ width: '100%', cursor: 'zoom-in' }}
                        onClick={() => setSelectedCard(c)}
                      />
                      <strong>{c.name}</strong><br />
                      <em>{c.set_name} ({c.collector_number})</em><br />
                      <label>
                        <input
                          type="checkbox"
                          checked={!!ownedCards[c.id]}
                          onChange={() => toggleOwnership(c.id)}
                        /> Tengo esta carta
                      </label><br />
                      {c.layout === 'transform' && c.card_faces?.length === 2 && (
                        <button onClick={() => toggleCardFace(c.id)} style={{ marginTop: '5px' }}>
                          Ver {flippedCards[c.id] ? 'cara frontal' : 'cara trasera'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {selectedCard && (
        <div onClick={() => setSelectedCard(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '2rem'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#fff', padding: '1rem', borderRadius: '8px',
            maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', textAlign: 'center'
          }}>
            <h2>{selectedCard.name}</h2>
            {selectedCard.layout === 'transform' && selectedCard.card_faces ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedCard.card_faces.map((face, i) => (
                  <div key={i} style={{ flex: '1 1 45%' }}>
                    <img
                      src={face.image_uris.normal}
                      alt={face.name}
                      style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain',
                        marginBottom: '0.5rem'
                      }}
                    />
                    <h3>{face.name}</h3>
                    <p><strong>Tipo:</strong> {face.type_line}</p>
                    <p><strong>Maná:</strong> {replaceManaSymbolsWithIcons(face.mana_cost)}</p>
                    <div style={{
                      maxHeight: '120px', overflowY: 'auto', background: '#f8f8f8',
                      padding: '8px', borderRadius: '4px', textAlign: 'left'
                    }}>
                      <strong>Texto:</strong><br />
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                          {replaceManaSymbolsWithIcons(face.oracle_text)}
                        </pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <img
                  src={getImageUrl(selectedCard)}
                  alt={selectedCard.name}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    marginBottom: '1rem'
                  }}
                />
                <p><strong>Tipo:</strong> {selectedCard.type_line}</p>
                <p><strong>Maná:</strong> {replaceManaSymbolsWithIcons(selectedCard.mana_cost)}</p>
                <div style={{
                  maxHeight: '120px', overflowY: 'auto', background: '#f8f8f8',
                  padding: '8px', borderRadius: '4px', textAlign: 'left'
                }}>
                  <strong>Texto:</strong><br />
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {replaceManaSymbolsWithIcons(selectedCard.oracle_text)}
                  </pre>
                </div>
              </>
            )}
            <button onClick={() => setSelectedCard(null)} style={{ marginTop: '1rem' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
