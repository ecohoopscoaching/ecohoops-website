import { motion } from 'framer-motion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const GALLERY_IMAGES = [
  { src: '/images/IMG_0373.JPG', alt: 'Game action at the rim' },
  { src: '/images/11.png', alt: 'Girls team photo' },
  { src: '/images/IMG_0294.JPG', alt: 'Player dribbling' },
  { src: '/images/IMG_0281.JPG', alt: 'Coach directing' },
  { src: '/images/3.png', alt: 'Girls playing defense' },
  { src: '/images/IMG_0350.JPG', alt: 'Players passing' },
  { src: '/images/IMG_0481.JPG', alt: 'Coach with players' },
  { src: '/images/5.png', alt: 'Shooting at hoop' },
  { src: '/images/IMG_0340.JPG', alt: 'Team discussion circle' },
  { src: '/images/IMG_0379.JPG', alt: 'Layup in action' },
]

export default function PhotoGallery() {
  const { ref, isVisible } = useScrollReveal(0.05)

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="tag mb-4 inline-block">Gallery</span>
          <h2 className="font-display text-section uppercase mb-4">
            <span className="text-white">ON THE </span>
            <span className="gradient-text">COURT</span>
          </h2>
        </motion.div>
      </div>

      {/* Scrolling photo rows */}
      <div className="space-y-4">
        {/* Row 1 - scrolls left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex animate-marquee gap-4"
        >
          {[...GALLERY_IMAGES.slice(0, 5), ...GALLERY_IMAGES.slice(0, 5)].map((img, i) => (
            <div
              key={`row1-${i}`}
              className="flex-shrink-0 w-[300px] md:w-[400px] h-[200px] md:h-[260px] rounded-2xl overflow-hidden relative group"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-eco-blue/0 group-hover:border-eco-blue/30 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </motion.div>

        {/* Row 2 - scrolls right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex animate-marquee-reverse gap-4"
        >
          {[...GALLERY_IMAGES.slice(5), ...GALLERY_IMAGES.slice(5)].map((img, i) => (
            <div
              key={`row2-${i}`}
              className="flex-shrink-0 w-[300px] md:w-[400px] h-[200px] md:h-[260px] rounded-2xl overflow-hidden relative group"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-eco-blue/0 group-hover:border-eco-blue/30 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
