import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // Créer l'utilisateur admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@portfolio.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Administrateur',
    },
  })
  console.log('✅ Utilisateur admin créé:', admin.email)

  // Créer le contenu de la page d'accueil
  const homeContent = [
    { key: 'home_hero_name', value: 'Giuseppe Rossi', type: 'text' },
    { key: 'home_hero_title', value: 'Consultant & Expert Digital', type: 'text' },
    { key: 'home_hero_subtitle', value: 'Je transforme vos idées en solutions digitales performantes et innovantes', type: 'textarea' },
    { key: 'home_hero_cta_text', value: 'Découvrir mes services', type: 'text' },
    { key: 'home_hero_cta_link', value: '/prestations', type: 'text' },
    { key: 'home_hero_image', value: '/avatar.jpg', type: 'image' },
    { key: 'home_services_title', value: 'Mes Prestations', type: 'text' },
    { key: 'home_services_intro', value: 'Découvrez comment je peux vous accompagner dans la réussite de vos projets digitaux', type: 'textarea' },
    { key: 'home_services_cta_text', value: 'Découvrir les prestations', type: 'text' },
  ]

  for (const content of homeContent) {
    await prisma.pageContent.upsert({
      where: { key: content.key },
      update: { value: content.value, type: content.type },
      create: content,
    })
  }
  console.log('✅ Contenu de la page d\'accueil créé')

  // Créer des articles de démonstration
  const articles = [
    {
      title: 'Les tendances du développement web en 2025',
      slug: 'tendances-developpement-web-2025',
      excerpt: 'Découvrez les technologies et pratiques qui façonnent l\'avenir du développement web.',
      content: `<h2>Introduction</h2>
<p>Le monde du développement web évolue constamment. En 2025, plusieurs tendances majeures émergent.</p>
<h2>Les frameworks modernes</h2>
<p>Next.js, React Server Components et les architectures edge-first deviennent la norme.</p>
<ul>
<li>Performance optimale</li>
<li>SEO amélioré</li>
<li>Expérience développeur exceptionnelle</li>
</ul>
<h2>L'intelligence artificielle</h2>
<p>L'IA s'intègre de plus en plus dans les outils de développement, améliorant la productivité et la qualité du code.</p>`,
      published: true,
      publishedAt: new Date('2025-01-15'),
    },
    {
      title: 'Comment optimiser les performances de votre site web',
      slug: 'optimiser-performances-site-web',
      excerpt: 'Des conseils pratiques pour améliorer la vitesse et l\'efficacité de votre site.',
      content: `<h2>Pourquoi la performance compte</h2>
<p>Un site rapide améliore l'expérience utilisateur et le référencement naturel.</p>
<h2>Les techniques essentielles</h2>
<ul>
<li>Optimisation des images (WebP, lazy loading)</li>
<li>Minification du code CSS/JS</li>
<li>Mise en cache stratégique</li>
<li>Utilisation d'un CDN</li>
</ul>
<h2>Outils de mesure</h2>
<p>Lighthouse, WebPageTest et Core Web Vitals vous aident à identifier les points d'amélioration.</p>`,
      published: true,
      publishedAt: new Date('2025-02-10'),
    },
    {
      title: 'Guide complet du référencement naturel (SEO)',
      slug: 'guide-complet-seo',
      excerpt: 'Maîtrisez les bases et les techniques avancées pour améliorer votre visibilité en ligne.',
      content: `<h2>Les fondamentaux du SEO</h2>
<p>Le référencement naturel est essentiel pour la visibilité de votre site web.</p>
<h2>On-page SEO</h2>
<ul>
<li>Balises title et meta description optimisées</li>
<li>Structure hiérarchique des titres (H1, H2, H3)</li>
<li>URLs propres et descriptives</li>
<li>Contenu de qualité et unique</li>
</ul>
<h2>SEO technique</h2>
<p>La vitesse de chargement, l'architecture du site et le mobile-first sont cruciaux.</p>
<h2>Link building</h2>
<p>Construire un réseau de liens de qualité renforce l'autorité de votre site.</p>`,
      published: true,
      publishedAt: new Date('2025-03-05'),
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    })
  }
  console.log(`✅ ${articles.length} articles créés`)

  // Créer des prestations
  const prestations = [
    {
      title: 'Développement Web Sur Mesure',
      description: 'Création de sites web et applications sur mesure, adaptés à vos besoins spécifiques.',
      price: 'À partir de 3 000€',
      benefits: JSON.stringify([
        'Design moderne et responsive',
        'Code optimisé et maintenable',
        'SEO intégré dès la conception',
        'Support et maintenance inclus',
      ]),
      order: 1,
    },
    {
      title: 'Consulting & Audit',
      description: 'Audit technique de votre site existant et recommandations d\'amélioration.',
      price: '800€ / jour',
      benefits: JSON.stringify([
        'Analyse complète de votre infrastructure',
        'Rapport détaillé avec recommandations',
        'Plan d\'action priorisé',
        'Suivi et accompagnement',
      ]),
      order: 2,
    },
    {
      title: 'Formation & Coaching',
      description: 'Formation personnalisée aux technologies web modernes pour vos équipes.',
      price: '1 200€ / jour',
      benefits: JSON.stringify([
        'Programme sur mesure',
        'Exercices pratiques',
        'Documentation complète',
        'Support post-formation',
      ]),
      order: 3,
    },
  ]

  for (const prestation of prestations) {
    await prisma.prestation.create({
      data: prestation,
    })
  }
  console.log(`✅ ${prestations.length} prestations créées`)

  // Créer des expériences professionnelles
  const experiences = [
    {
      position: 'Lead Developer',
      company: 'TechCorp Solutions',
      location: 'Paris, France',
      startDate: new Date('2022-01-01'),
      endDate: null,
      current: true,
      description: 'Direction technique d\'une équipe de 5 développeurs. Mise en place d\'architectures modernes et scalables pour des clients grands comptes. Accompagnement dans la transformation digitale.',
      skills: JSON.stringify(['Next.js', 'React', 'Node.js', 'TypeScript', 'AWS', 'Architecture']),
      order: 1,
    },
    {
      position: 'Full-Stack Developer',
      company: 'Digital Agency',
      location: 'Lyon, France',
      startDate: new Date('2019-06-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      description: 'Développement d\'applications web complexes pour des clients variés. Spécialisation en React et Node.js. Participation active aux phases de conception et d\'architecture.',
      skills: JSON.stringify(['React', 'Node.js', 'MongoDB', 'GraphQL', 'Docker']),
      order: 2,
    },
    {
      position: 'Web Developer',
      company: 'StartupLab',
      location: 'Remote',
      startDate: new Date('2017-03-01'),
      endDate: new Date('2019-05-31'),
      current: false,
      description: 'Développement de features pour une plateforme SaaS en forte croissance. Travail en méthode agile avec des sprints de 2 semaines. Focus sur la qualité du code et les tests.',
      skills: JSON.stringify(['JavaScript', 'Vue.js', 'PHP', 'MySQL', 'Git']),
      order: 3,
    },
  ]

  for (const experience of experiences) {
    await prisma.experience.create({
      data: experience,
    })
  }
  console.log(`✅ ${experiences.length} expériences créées`)

  // Créer les pages par défaut
  const pages = [
    {
      title: 'Prestations',
      slug: 'prestations',
      type: 'prestations',
      content: JSON.stringify({ intro: 'Découvrez mes services et prestations' }),
      published: true,
      showInNav: true,
      showInFooter: false,
      order: 1,
    },
    {
      title: 'Expériences',
      slug: 'experiences',
      type: 'experiences',
      content: JSON.stringify({ intro: 'Mon parcours professionnel' }),
      published: true,
      showInNav: true,
      showInFooter: false,
      order: 2,
    },
    {
      title: 'À propos',
      slug: 'about',
      type: 'about',
      content: JSON.stringify({
        title: 'À propos de moi',
        description: 'Consultant et expert digital passionné par les nouvelles technologies.',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        education: [],
        certifications: []
      }),
      published: true,
      showInNav: true,
      showInFooter: true,
      order: 3,
    },
    {
      title: 'Mes Activités',
      slug: 'activities',
      type: 'activities',
      content: JSON.stringify({
        title: 'Mes Activités',
        description: 'Découvrez mes projets et contributions à la communauté.',
        activities: []
      }),
      published: true,
      showInNav: false,
      showInFooter: true,
      order: 4,
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    })
  }
  console.log(`✅ ${pages.length} pages créées`)

  console.log('🎉 Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
