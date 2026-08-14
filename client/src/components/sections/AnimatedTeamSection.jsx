import * as React from "react"
import { motion, useAnimation } from "framer-motion"

function getCardState(index, total) {
  const centerIndex = (total - 1) / 2
  const distanceFromCenter = index - centerIndex
  const x = distanceFromCenter * 90
  const y = Math.abs(distanceFromCenter) * -30
  const rotate = distanceFromCenter * 12
  return { x, y, rotate }
}

export default function AnimatedTeamSection({ members }) {
  const controls = useAnimation()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 0, y: 0, rotate: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      x: getCardState(i, members.length).x,
      y: getCardState(i, members.length).y,
      rotate: getCardState(i, members.length).rotate,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    }),
  }

  if (!members.length) return null

  return (
    <motion.div
      className="relative mt-20 flex items-center justify-center"
      style={{ minHeight: "350px" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      animate={controls}
    >
      {members.map((member, index) => (
        <motion.div
          key={member._id || member.id || index}
          className="absolute w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-xl overflow-hidden shadow-lg border-2 border-nvidia/40 bg-obsidian-900"
          custom={index}
          variants={itemVariants}
          style={{
            zIndex: members.length - Math.abs(index - (members.length - 1) / 2),
          }}
          whileHover={{
            scale: 1.1,
            zIndex: 99,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          }}
        >
          {member.image_url ? (
            <img
              src={
                member.image_url.includes("cloudinary.com")
                  ? member.image_url.replace("/upload/", "/upload/f_auto,q_auto/")
                  : member.image_url
              }
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-nvidia/10 text-nvidia font-display font-bold text-2xl">
              {member.name
                .split(/\s+/)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
