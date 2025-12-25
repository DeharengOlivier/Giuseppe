import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Mise à jour des données CV...')

    // 1. Nettoyer les expériences existantes
    await prisma.experience.deleteMany({})
    console.log('🧹 Expériences existantes supprimées')

    // 2. Insérer les nouvelles expériences
    const experiences = [
        {
            position: 'Professeur d’hébreu biblique et moderne',
            company: 'Institut d’Études du Judaïsme de Bruxelles (I.E.J.)',
            location: 'Bruxelles',
            startDate: new Date('2005-01-01'),
            endDate: null,
            current: true,
            description: 'Enseignement de l’hébreu biblique et moderne.',
            skills: JSON.stringify(['Hébreu', 'Enseignement', 'Pédagogie']),
            order: 1
        },
        {
            position: 'Chargé de séminaire « Psychanalyse... »',
            company: 'CEPSYa-ULB (Centre d’études sur la Psychanalyse)',
            location: 'Bruxelles',
            startDate: new Date('2023-09-01'),
            endDate: null,
            current: true,
            description: 'En charge du séminaire « Psychanalyse ... et Religion, Philosophie et Littérature ».',
            skills: JSON.stringify(['Psychanalyse', 'Recherche', 'Philosophie']),
            order: 2
        },
        {
            position: 'Psychanalyste et Hypnopraticien',
            company: 'Cabinet Privé',
            location: 'Venise - Bruxelles - On-Line',
            startDate: new Date('2024-04-01'),
            endDate: null,
            current: true,
            description: 'Consultation en cabinet privé.',
            skills: JSON.stringify(['Psychanalyse', 'Hypnose', 'Thérapie']),
            order: 3
        },
        {
            position: 'Gérant',
            company: 'ABBA Consulting & Management S.r.l.',
            location: 'Venise',
            startDate: new Date('2020-01-01'),
            endDate: null,
            current: true,
            description: 'Société de services active, entre autres, dans la gestion d’appartements à vocation touristique.',
            skills: JSON.stringify(['Management', 'Gestion immobilière', 'Tourisme']),
            order: 4
        },
        {
            position: 'Directeur',
            company: 'Beit Venezia, Casa della Cultura Ebraica',
            location: 'Venise / États-Unis',
            startDate: new Date('2017-01-01'),
            endDate: new Date('2020-12-31'),
            current: false,
            description: 'Défense et valorisation de la culture juive. Réalisation d’événements culturels, publication d’ouvrages, collaborations internationales.',
            skills: JSON.stringify(['Direction', 'Événementiel', 'Culture', 'Relations internationales']),
            order: 5
        },
        {
            position: 'Professeur de français et de morale laïque',
            company: 'Ville de Bruxelles (Écoles secondaires)',
            location: 'Bruxelles',
            startDate: new Date('2010-01-01'),
            endDate: new Date('2014-12-31'),
            current: false,
            description: 'Enseignement secondaire.',
            skills: JSON.stringify(['Enseignement', 'Français', 'Morale']),
            order: 6
        },
        {
            position: 'Assistant (Philosophie et Sciences des Religions)',
            company: 'Université Libre de Bruxelles (C.I.E.R.L.)',
            location: 'Bruxelles',
            startDate: new Date('2004-01-01'),
            endDate: new Date('2010-12-31'),
            current: false,
            description: 'Assistant au Département de Philosophie et Sciences des Religions, responsable de la bibliothèque du Centre.',
            skills: JSON.stringify(['Recherche académique', 'Gestion de bibliothèque']),
            order: 7
        },
        {
            position: 'Bibliothécaire',
            company: 'Institut d’Études du Judaïsme',
            location: 'Bruxelles',
            startDate: new Date('2002-01-01'),
            endDate: new Date('2004-12-31'),
            current: false,
            description: 'Gestion de la bibliothèque.',
            skills: JSON.stringify(['Bibliothéconomie']),
            order: 8
        }
    ]

    for (const exp of experiences) {
        await prisma.experience.create({ data: exp })
    }
    console.log(`✅ ${experiences.length} expériences créées`)

    // 3. Mettre à jour les études (Model Course ?) ou Page About
    // On va utiliser le modèle Course s'il existe (vu dans schema.prisma), ou sinon stocker dans PageContent
    // Vérifions d'abord Course
    await prisma.course.deleteMany({}) // Nettoyage
    const educations = [
        {
            title: 'Diplôme d’Études Approfondies (D.E.A.)',
            institution: 'Université Libre de Bruxelles – Institut d’Études du Judaïsme',
            type: 'university',
            level: 'D.E.A.',
            period: '2000',
            description: 'Histoire, Pensées et Civilisation juives. Mémoire : traduction et analyse des Annales de Téglat-Phalazar I.'
        },
        {
            title: 'Licence en Langues et Littératures Orientales',
            institution: 'Université Libre de Bruxelles',
            type: 'university',
            level: 'Licence',
            period: '1997',
            description: 'Spécialisation Égypte et Mésopotamie. Mémoire : traduction d’une section du livre du Zohar.'
        },
        {
            title: 'Formation en psychanalyse',
            institution: 'S.A.B.O.F. (Milan)',
            type: 'professional',
            period: 'Depuis 2021',
            description: 'Società di Analisi Biografica a Orientamento Filosofico.'
        }
    ]

    for (const edu of educations) {
        await prisma.course.create({ data: edu })
    }
    console.log(`✅ ${educations.length} formations créées`)

    // 4. Mettre à jour les infos perso et compétences
    const personalInfo = [
        { key: 'home_hero_name', value: 'Giuseppe Balzano', type: 'text' },
        { key: 'home_hero_title', value: 'Psychanalyste & Consultant', type: 'text' }, // Titre suggéré
        { key: 'home_hero_subtitle', value: 'Expert en études juives, philosophie et psychanalyse. Consultant en gestion culturelle et touristique.', type: 'textarea' },
        { key: 'about_phone', value: '+39-370-319-3535', type: 'text' },
        { key: 'about_email', value: 'gbalzano1@gmail.com', type: 'text' },
        { key: 'about_languages', value: 'Français, Italien (Maternelles) | Anglais, Néerlandais, Espagnol, Hébreu (Courant) | Allemand (Passif) | Langues anciennes (Latin, Grec, Hébreu ancien, Araméen, Syrique, Akkadien, Sumérien, Égyptien)', type: 'textarea' }
    ]

    for (const info of personalInfo) {
        await prisma.pageContent.upsert({
            where: { key: info.key },
            update: { value: info.value, type: info.type },
            create: { key: info.key, value: info.value, type: info.type }
        })
    }
    console.log('✅ Informations personnelles mises à jour')

    console.log('🎉 Mise à jour CV terminée !')
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
