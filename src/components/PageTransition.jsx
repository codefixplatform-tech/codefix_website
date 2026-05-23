import { motion } from "framer-motion";

const PageTransition = ({ children, noSlide = false }) => {
  const customAnimations = noSlide ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      variants={customAnimations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: noSlide ? 0.22 : 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;