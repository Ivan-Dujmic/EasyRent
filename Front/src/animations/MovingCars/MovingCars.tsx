// components/MovingCars.tsx
import { Box } from '@chakra-ui/react';
import { motion, Transition } from 'framer-motion';

// Funkcija koja generiše nasumične pozicije i brzine
const getRandomProps = () => {
  const speed: number = Math.random() * 5 + 5; // Nasumična brzina između 5 i 10 sekundi
  const startY: string = Math.random() * 100 + '%'; // Nasumična vertikalna pozicija
  return { speed, startY };
};

interface MovingCarProps {
  speed: number;
  startY: string;
}

const MovingCar: React.FC<MovingCarProps> = ({ speed, startY }) => {
  // Definišemo transition kao tipa Transition
  const transition: Transition = {
    duration: speed,
    repeat: Infinity,
    ease: 'linear',
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: startY,
        right: 0, // Počinje s desne strane
        fontSize: '24px',
        pointerEvents: 'none', // Isključuje interakciju
      }}
      animate={{
        x: '-100vw', // Pokreće automobil s desna na levo
      }}
      transition={transition}
    >
      🚗
    </motion.div>
  );
};

const MovingCars: React.FC = () => {
  const carElements = Array.from({ length: 10 }).map((_, index) => {
    const { speed, startY } = getRandomProps();
    return <MovingCar key={index} speed={speed} startY={startY} />;
  });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      pointerEvents="none"
      zIndex="999" // Visok z-index da bi bili na vrhu
      overflow="hidden"
    >
      {carElements}
    </Box>
  );
};

export default MovingCars;
