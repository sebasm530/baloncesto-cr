import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060608]"
      >
        {/* Logo animado */}
        <motion.img
          src="/logo.png"
          alt="Zona Basket CR"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-40 mb-8"
        />

        {/* Pelota rebotando */}
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl mb-6"
        >
          🏀
        </motion.div>

        {/* Barra de progreso */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-orange-500 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Mensaje */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-sm font-semibold tracking-wider uppercase"
        >
          {message}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}