import { motion, Variants } from "framer-motion";

export function SkillsSection() {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // ... (rest of the SkillsSection code as in page.tsx)
}

export default SkillsSection;