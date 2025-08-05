import { NextRequest, NextResponse } from 'next/server'

// Mock job data - replace with actual database query
const mockJobs = [
  {
    id: 1,
    created_at: "2024-01-15T10:00:00Z",
    company_id: 1,
    title: "Senior Frontend Developer",
    job_city: "Berlin",
    job_state: "Berlin",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€65,000 - €85,000",
    seniority: "Senior",
    job_origin: "LinkedIn",
    job_identifier: 12345,
    apply_link: "https://example.com/apply",
    applicants_number: "45",
    working_hours: "40",
    remote_work: "Hybrid",
    source: "LinkedIn",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies. You will be responsible for developing and maintaining web applications that serve millions of users.",
      description_responsibilities: "Develop and maintain web applications using React and TypeScript. Collaborate with design and backend teams. Write clean, maintainable code and participate in code reviews.",
      description_qualification: "5+ years of experience with React, TypeScript, and modern JavaScript. Experience with state management libraries like Redux or Zustand. Strong understanding of web performance and accessibility.",
      description_benefits: "Competitive salary, flexible working hours, remote work options, health insurance, professional development budget, and a great team environment.",
    },
    job_geopoint: "52.5200,13.4050",
    recruiter: {
      recruiter_name: "Sarah Johnson",
      recruiter_title: "Senior Recruiter",
      recruiter_url: "https://linkedin.com/in/sarah-johnson",
    },
    company: {
      id: 1,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "TechCorp GmbH",
      employer_logo: "/images/techcorp-logo.png",
      employer_website: "https://techcorp.com",
      employer_company_type: "Technology",
      employer_linkedin: "https://linkedin.com/company/techcorp",
      company_identifier: 1001,
      about: "Leading technology company in Berlin specializing in innovative web solutions",
      short_description: "Innovative tech solutions for modern businesses",
      founded: "2015",
      company_size: "100-500",
    },
  },
  {
    id: 2,
    created_at: "2024-01-14T14:30:00Z",
    company_id: 2,
    title: "UX/UI Designer",
    job_city: "München",
    job_state: "Bayern",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€55,000 - €75,000",
    seniority: "Mid-level",
    job_origin: "Indeed",
    job_identifier: 12346,
    apply_link: "https://example.com/apply-ux",
    applicants_number: "32",
    working_hours: "40",
    remote_work: "Remote",
    source: "Indeed",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "Join our design team to create amazing user experiences for our digital products. We're looking for a creative and detail-oriented UX/UI designer who can translate user needs into beautiful, functional interfaces.",
      description_responsibilities: "Design user interfaces and experiences for web and mobile applications. Conduct user research and usability testing. Create wireframes, prototypes, and high-fidelity designs. Collaborate with product managers and developers.",
      description_qualification: "3+ years of UX/UI design experience. Proficiency in Figma, Sketch, or similar design tools. Experience with user research and usability testing. Strong portfolio demonstrating user-centered design solutions.",
      description_benefits: "Remote work, creative environment, flexible hours, competitive salary, health benefits, and opportunities for professional growth.",
    },
    job_geopoint: "48.1351,11.5820",
    recruiter: {
      recruiter_name: "Michael Schmidt",
      recruiter_title: "Design Manager",
      recruiter_url: "https://linkedin.com/in/michael-schmidt",
    },
    company: {
      id: 2,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "DesignStudio AG",
      employer_logo: "/images/designstudio-logo.png",
      employer_website: "https://designstudio.com",
      employer_company_type: "Design",
      employer_linkedin: "https://linkedin.com/company/designstudio",
      company_identifier: 1002,
      about: "Creative design agency in Munich focused on creating beautiful digital experiences",
      short_description: "Beautiful digital experiences that users love",
      founded: "2018",
      company_size: "50-100",
    },
  },
  {
    id: 3,
    created_at: "2024-01-13T09:15:00Z",
    company_id: 3,
    title: "Product Manager",
    job_city: "Hamburg",
    job_state: "Hamburg",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€70,000 - €90,000",
    seniority: "Senior",
    job_origin: "Glassdoor",
    job_identifier: 12347,
    apply_link: "https://example.com/apply-pm",
    applicants_number: "28",
    working_hours: "40",
    remote_work: "On-site",
    source: "Glassdoor",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "Lead product development and strategy for our innovative technology solutions. You will be responsible for defining product vision, roadmap, and working closely with cross-functional teams to deliver exceptional products.",
      description_responsibilities: "Define product vision and roadmap. Gather and analyze user feedback and market research. Work with engineering, design, and marketing teams. Prioritize features and manage product backlog.",
      description_qualification: "5+ years of product management experience. Strong analytical and strategic thinking skills. Experience with agile methodologies. Excellent communication and leadership abilities.",
      description_benefits: "Competitive salary, career growth opportunities, health insurance, flexible working arrangements, and a collaborative work environment.",
    },
    job_geopoint: "53.5511,9.9937",
    recruiter: {
      recruiter_name: "Anna Weber",
      recruiter_title: "HR Director",
      recruiter_url: "https://linkedin.com/in/anna-weber",
    },
    company: {
      id: 3,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "InnovateTech Solutions",
      employer_logo: "/images/innovatetech-logo.png",
      employer_website: "https://innovatetech.com",
      employer_company_type: "Technology",
      employer_linkedin: "https://linkedin.com/company/innovatetech",
      company_identifier: 1003,
      about: "Innovative technology solutions provider helping businesses transform their digital presence",
      short_description: "Building the future of technology",
      founded: "2012",
      company_size: "500-1000",
    },
  },
  {
    id: 4,
    created_at: "2024-01-12T16:45:00Z",
    company_id: 4,
    title: "Backend Developer",
    job_city: "Köln",
    job_state: "Nordrhein-Westfalen",
    job_country: "Germany",
    job_employement_type: "Full-time",
    salary: "€60,000 - €80,000",
    seniority: "Mid-level",
    job_origin: "LinkedIn",
    job_identifier: 12348,
    apply_link: "https://example.com/apply-backend",
    applicants_number: "38",
    working_hours: "40",
    remote_work: "Hybrid",
    source: "LinkedIn",
    auto_apply: false,
    recruitment_agency: false,
    description: {
      description_original: "Join our backend development team to build scalable and robust server-side applications. We're looking for a developer with strong experience in Node.js, Python, or Java.",
      description_responsibilities: "Develop and maintain server-side applications and APIs. Design and implement database schemas. Ensure code quality through testing and code reviews. Collaborate with frontend developers and DevOps teams.",
      description_qualification: "3+ years of backend development experience. Proficiency in Node.js, Python, or Java. Experience with databases (PostgreSQL, MongoDB). Knowledge of cloud platforms (AWS, Azure, GCP).",
      description_benefits: "Competitive salary, hybrid work model, professional development, health benefits, and a supportive team environment.",
    },
    job_geopoint: "50.9375,6.9603",
    recruiter: {
      recruiter_name: "Thomas Müller",
      recruiter_title: "Tech Lead",
      recruiter_url: "https://linkedin.com/in/thomas-mueller",
    },
    company: {
      id: 4,
      created_at: "2024-01-01T00:00:00Z",
      employer_name: "Digital Solutions GmbH",
      employer_logo: "/images/digital-solutions-logo.png",
      employer_website: "https://digitalsolutions.com",
      employer_company_type: "Technology",
      employer_linkedin: "https://linkedin.com/company/digital-solutions",
      company_identifier: 1004,
      about: "Digital solutions company in Cologne providing innovative technology services",
      short_description: "Digital innovation at its best",
      founded: "2016",
      company_size: "200-500",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get search parameters
    const keyword = searchParams.get('keyword') || ''
    const location = searchParams.get('location') || ''
    const jobType = searchParams.get('jobType') || ''
    const experienceLevel = searchParams.get('experienceLevel') || ''
    const remoteWork = searchParams.get('remoteWork') || ''
    const companySize = searchParams.get('companySize') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Filter jobs based on search criteria
    let filteredJobs = mockJobs
    
    if (keyword) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.employer_name.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description.description_original.toLowerCase().includes(keyword.toLowerCase())
      )
    }
    
    if (location) {
      filteredJobs = filteredJobs.filter(job =>
        job.job_city.toLowerCase().includes(location.toLowerCase()) ||
        job.job_state.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    if (jobType) {
      filteredJobs = filteredJobs.filter(job => job.job_employement_type === jobType)
    }
    
    if (experienceLevel) {
      filteredJobs = filteredJobs.filter(job => job.seniority === experienceLevel)
    }
    
    if (remoteWork) {
      filteredJobs = filteredJobs.filter(job => job.remote_work === remoteWork)
    }
    
    if (companySize) {
      filteredJobs = filteredJobs.filter(job => job.company.company_size === companySize)
    }
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)
    
    // Calculate pagination info
    const totalJobs = filteredJobs.length
    const totalPages = Math.ceil(totalJobs / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      jobs: paginatedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      filters: {
        keyword,
        location,
        jobType,
        experienceLevel,
        remoteWork,
        companySize,
      }
    })
    
  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 