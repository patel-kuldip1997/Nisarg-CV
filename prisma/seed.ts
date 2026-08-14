import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: 'password123' }
  })

  await prisma.profile.create({
    data: {
      name: "Nisarg Patel",
      primaryTitle: "Technical Support Analyst",
      secondaryTitle: "L1/L2 Troubleshooting • API Integration • SQL",
      introduction: "I’m a results-driven Technical Support Engineer with over 3 years of hands-on experience in supporting enterprise logistics platforms, diagnosing API and system issues, and driving customer success through data and insights.",
      aboutSummary: "I specialize in L1/L2 technical troubleshooting, API integration assistance, and user adoption enablement, backed by a solid foundation in SQL, Postman, and cloud-based dashboards.",
      yearsOfExp: "3+",
      technologies: "15+",
      issuesResolved: "500+",
      supportLevel: "L1/L2",
      githubUrl: "https://github.com/nisarg",
      linkedinUrl: "https://linkedin.com/in/nisarg",
      email: "patelnisarg330@gmail.com"
    }
  })

  const catCore = await prisma.skillCategory.create({ data: { name: "Core Skills", order: 1 } })
  const catTech = await prisma.skillCategory.create({ data: { name: "Technologies", order: 2 } })

  await prisma.skill.createMany({
    data: [
      { name: "Technical Troubleshooting", level: 95, categoryId: catCore.id },
      { name: "API Integration", level: 90, categoryId: catCore.id },
      { name: "L1/L2 Support", level: 95, categoryId: catCore.id },
      { name: "SQL", level: 85, categoryId: catTech.id },
      { name: "Postman", level: 90, categoryId: catTech.id },
      { name: "Cloud Dashboards", level: 85, categoryId: catTech.id },
    ]
  })

  await prisma.experience.create({
    data: {
      company: "Enterprise Logistics Platform",
      position: "Technical Support Analyst",
      startDate: "Mar 2022",
      endDate: "Present",
      description: "• Supporting enterprise logistics platforms\n• Diagnosing API and system issues\n• Driving customer success through data and insights",
      technologies: "SQL, Postman, APIs"
    }
  })

  await prisma.education.createMany({
    data: [
      {
        institution: "University Name",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2017",
        endDate: "2021",
        description: "Focused on Mathematics, Physics, and Computer Science, with strong academic performance."
      },
      {
        institution: "High School",
        degree: "Higher Secondary Education",
        startDate: "2015",
        endDate: "2017",
        description: "Focused on Science."
      }
    ]
  })

  console.log("Database seeded successfully with Nisarg Patel's data.")
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect() })
