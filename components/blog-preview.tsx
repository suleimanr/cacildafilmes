import { motion } from 'framer-motion'

const blogPosts = [
  {
    id: 1,
    title: "5 Tendências em Educação Corporativa para 2023",
    excerpt: "Descubra as principais inovações que estão moldando o futuro do aprendizado nas empresas.",
    imageUrl: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 2,
    title: "Como Gamification Pode Revolucionar seus Treinamentos",
    excerpt: "Aprenda a usar elementos de jogos para aumentar o engajamento e a retenção de conhecimento.",
    imageUrl: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 3,
    title: "O Papel da IA na Personalização do Aprendizado",
    excerpt: "Explore como a inteligência artificial está criando experiências de aprendizado sob medida.",
    imageUrl: "/placeholder.svg?height=200&width=300"
  }
]

export default function BlogPreview() {
  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Últimas do Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <motion.a
                  href="#"
                  className="text-blue-400 font-semibold"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Leia mais →
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

