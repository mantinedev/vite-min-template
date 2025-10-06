import { useRef, useState } from 'react'

import { Chip, Container, Group, InlineStyles, MantineProvider, PinInput, Stack } from "@mantine/core"
import { Notifications, showNotification } from '@mantine/notifications'
import { theme } from "./theme"

import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import React from 'react';

const words = [
  'bright',
  'planet',
  'forest',
  'stream',
  'castle',
  'silver',
  'butter',
  'garden',
  'window',
  'candle',
  'rabbit',
  'island',
  'flower',
  'marble',
  'hunter',
  'rocket',
  'bridge',
  'bottle',
  'copper',
  'dragon',
  'fabric',
  'glider',
  'hammer',
  'jungle',
  'laptop',
  'magnet',
  'orange',
  'pencil',
  'quartz',
  'rocket',
  'sailor',
  'throne',
  'tunnel',
  'violet',
  'whisky',
  'yellow',
  'artist',
  'butler',
  'circle',
  'danger',
  'engine',
  'friend',
  'gentle',
  'helmet',
  'insect',
  'kitten',
  'lawyer',
  'mother',
  'native',
  'object',
  'puzzle',
  'ribbon',
  'school',
  'throat',
  'united',
  'valley',
  'wander',
  'yellow',
  'zipper',
  'action',
  'beacon',
  'charge',
  'danger',
  'exotic',
  'flight',
  'golden',
  'hazard',
  'insult',
  'jacket',
  'keeper',
  'lesson',
  'market',
  'narrow',
  'option',
  'prince',
  'quiver',
  'rescue',
  'sample',
  'temple',
  'urgent',
  'vision',
  'wander',
  'xeroxs',
  'yearly',
  'zigzag',
  'anchor',
  'bricks',
  'cereal',
  'debate',
  'empire',
  'fusion',
  'garage',
  'honest',
  'income',
  'jungle',
  'kitten',
  'launch',
  'magnet',
  'number',
  'online',
  'planet',
  'quartz',
  'reward',
  'silent',
  'thread',
  'unique',
  'velvet',
  'wander',
  'yellow',
  'zygote',
  'absorb',
  'broken',
  'canvas',
  'demand',
  'effort',
  'flight',
  'gentle',
  'honour',
  'impact',
  'jigsaw',
  'kidnap',
  'legend',
  'moment',
  'nature',
  'outfit',
  'polish',
  'ranger',
  'shrink',
  'throne',
  'update',
  'volume',
  'wallet',
  'winter',
  'yonder',
  'zephyr',
  'archer',
  'blazer',
  'cactus',
  'drawer',
  'export',
  'frozen',
  'guitar',
  'humane',
  'invade',
  'jester',
  'ladder',
  'marine',
  'nickel',
  'office',
  'planet',
  'quaint',
  'remote',
  'sacred',
  'ticket',
  'uphold',
  'wander',
  'wonder',
  'yogurt',
  'zipper',
  'abrupt',
  'bounce',
  'cobalt',
  'doodle',
  'esteem',
  'fabric',
  'galaxy',
  'hammer',
  'ignore',
  'junior',
  'lament',
  'mantle',
  'nickel',
  'oracle',
  'pastel',
  'radius',
  'scarce',
  'talent',
  'update',
  'vacant',
  'walnut',
];

const wordsSet = new Set(words);

type CharacterData = {
  symbol: string,
  state: 'correct' | 'incorrect' | 'exists'
}

const bgColorMap: Record<CharacterData['state'], string> = {
  correct: 'lightgreen',
  incorrect: 'lightgray',
  exists: 'lightyellow'
}

type WordData = CharacterData[]

export default function App() {
  const todayWord = useRef(words[Math.trunc(Math.random() * words.length)]);
const todayWordChars = todayWord.current.split('');
const todayWordCharsSet = new Set(todayWordChars);

  const [history, setHistory] = useState<WordData[]>([]);
  const [rowAt, setRowAt] = useState(0);
  const [input, setInput] = useState('');

  const checkWord = () => {
    if (input.length !== 6) return;

    if (!wordsSet.has(input)) {
      showNotification({ message: 'Not in a word list' });
      return;
    }

    if (input === todayWord.current) {
      showNotification({ message: `Today's word: ${todayWord.current}` })

      // TODO

      return;
    }

    const wordData: WordData = [];

    input.split('').forEach((symbol, index) => {
      if (!todayWordCharsSet.has(symbol)) {
        wordData.push({symbol, state: 'incorrect'});
        return;
      }

      if (todayWordChars[index] === symbol) {
        wordData.push({symbol, state: 'correct'})
        return;
      }

      wordData.push({symbol, state: 'exists'})
    })

    setHistory(prev => prev.concat([wordData]));
    setRowAt(prev => prev + 1);
    setInput('');
  };

  console.log(history)

  return <MantineProvider theme={theme}>
    {todayWord.current}
    <Notifications />
    <Container pt={32}>
      <Stack gap={6}>
        {Array.from({ length: 6 }, (_, idx) => {
          const isProcessingRow = idx === rowAt;

          const showedValue = isProcessingRow ? input : (history[idx] || []);
          const callback = isProcessingRow ? (v: string) => {
            setInput(v)
          } : undefined;

          if (typeof showedValue === 'string') {
            return <PinInput
              styles={{
                input: {
                  borderColor: 'lightseagreen',
                  textTransform: 'uppercase',
                  fontWeight: 600
                },
              }}
              type={/^[a-zA-Z]*$/}
              disabled={idx !== rowAt}
              key={idx}
              length={6}
              placeholder=''
              value={showedValue}
              onChange={callback}
              onKeyUp={e => {
                if (e.code !== 'Enter') return;

                checkWord();

              }}
              data-state="red"
            />
          }

          if (idx > 0) {
            console.log(showedValue)
          }

          return <Group gap={12}>
            {Array.from({ length: 6 }, (_, cIdx) => {
              return <span key={cIdx}
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid lightgray',
                  borderRadius: '0.2rem',
                  lineHeight: '0',
                  height: '36px',
                  aspectRatio: '1/1',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  backgroundColor: showedValue[cIdx]?.state ? bgColorMap[showedValue[cIdx]?.state] : undefined,
                  color: 'rgba(0,0,0,0.5)'
                }}
              >
                {showedValue[cIdx]?.symbol || ''}
              </span>
            })}
          </Group>
        })}
      </Stack>
    </Container>
  </MantineProvider>;
}
