/**
 * Pre-indexed content from The Engine Room website (https://www.theengineroom.org/)
 * This content is used by the RAG system to answer questions about the organization.
 *
 * To update: Fetch new content from the website and update these entries.
 * Last updated: 2024-01-15
 */

export interface EngineRoomPage {
  slug: string;
  title: string;
  url: string;
  category: 'about' | 'services' | 'library' | 'news';
  content: string;
  tags: string[];
}

export const engineRoomContent: EngineRoomPage[] = [
  {
    slug: 'about-us',
    title: 'About The Engine Room',
    url: 'https://www.theengineroom.org/about/',
    category: 'about',
    tags: ['mission', 'organization', 'overview', 'values'],
    content: `The Engine Room is a nonprofit organization supporting civil society to use technology and data strategically and responsibly. Their vision is for "social justice movements to use technology and data in safe, responsible and strategic ways."

The organization operates across three main areas:

Direct Support Services:
- Light-touch support (no-fee) for under-resourced partners in Latin America and Africa
- Intensive support programs (no-fee)
- Paid consulting and research services for well-funded organizations

Field-Level Work:
- Identifying trends at intersections of technology, data, and justice-focused activism
- Providing strategic guidance on tech and data approaches
- Facilitating knowledge exchange among diverse communities and movements

The Engine Room partners with groups confronting "power imbalances, injustice and rights abuses," including associations, foundations, activist collectives, humanitarian organizations, and social movements.

Core Values: The organization prioritizes being rooted in community contexts, critically optimistic about technology, trusted across communities, committed to equity and staff wellbeing, aware of systemic injustices, and collaborative in approach.

Since 2011, they've supported over 800 organizations globally, resulting in improved organizational practices around technology use, data management, and technical infrastructure within civil society.`,
  },
  {
    slug: 'services-support',
    title: 'Services and Support Overview',
    url: 'https://www.theengineroom.org/services-support/',
    category: 'services',
    tags: ['services', 'support', 'consulting', 'research'],
    content: `The Engine Room offers four main service categories for organizations working on social justice and technology/data challenges:

1. Research
Focused on identifying trends and opportunities at the intersection of technology, data, and activism. Their approach combines civil society experience with critical analysis using interviews, desk research, surveys, participatory research and more. Suited for organizations with stable funding and funders.

2. Specialised Consulting
Flexible and customised support helping organizations strengthen tech practices, enhance security, adopt new tools, build technical confidence, and align tech choices with organizational values. Also targets well-funded organizations and funders.

3. LITS (Light-Touch Support)
A no-cost program offering quick and targeted assistance starting with an initial consultation, followed by guidance, resources, and connections. Prioritizes under-resourced civil society groups and activists with specific tech/data questions.

4. MATCHBOX (Intensive Support)
A no-cost, 3-6 month partnership program including targeted research, matchmaking, and customized recommendations. Specifically designed for civil society organizations, groups, and activists in Latin America and Africa facing broader technology and data challenges.

Additionally, The Engine Room provides free cybersecurity assessments through their Cybersecurity Assessment Tool and UX services for internet freedom tool developers.`,
  },
  {
    slug: 'matchbox-intensive-support',
    title: 'MATCHBOX Intensive Support Program',
    url: 'https://www.theengineroom.org/services-support/intensive-support/',
    category: 'services',
    tags: ['matchbox', 'intensive support', 'partnership', 'africa', 'latin america'],
    content: `MATCHBOX Intensive Support Program

Matchbox offers no-cost, comprehensive support to organizations in Sub-Saharan Africa and Latin America over 6-9 months. The program is demand-driven and tailored to partner needs, addressing both project design and organizational context.

What's Included:
Support covers strategic planning, project development, implementation guidance, plus organizational strengthening in areas like design and strategy to security and privacy. Regional leads and expert teams work with partners, combining remote interaction with in-person visits.

Eligibility Criteria:
- Focus on social justice issues using data and technology strategically
- Lack sufficient financial resources to implement this work independently
- Demonstrate openness to learning tech and data practices
- Be based or actively working in Sub-Saharan Africa or Latin America, engaging directly with local communities

Selection Process:
1. Open Call announcement
2. Initial Application (brief questionnaire for eligibility screening)
3. Full Application (detailed project and organizational needs)
4. Review and Interviews (video call assessments)
5. Final Selection based on impact potential and collaboration readiness

Note: Applications open periodically. Check the website for current application status.`,
  },
  {
    slug: 'light-touch-support',
    title: 'Light-Touch Support (LITS)',
    url: 'https://www.theengineroom.org/services-support/light-touch-support/',
    category: 'services',
    tags: ['lits', 'light-touch', 'free support', 'consultation'],
    content: `Light-Touch Support (LITS)

LITS is The Engine Room's no-cost program offering quick and targeted assistance for civil society organizations and activists with specific technology and data questions.

How it works:
1. Initial Consultation: A conversation to understand your specific tech/data challenge
2. Guidance & Resources: Tailored recommendations, resources, and connections
3. Follow-up: Ongoing support as needed

Who it's for:
- Under-resourced civil society groups
- Activists with specific tech/data questions
- Organizations that need targeted guidance rather than long-term support

Topics covered may include:
- Digital security assessments
- Tool selection and implementation
- Data management practices
- Technology strategy
- Privacy considerations

LITS prioritizes organizations that lack resources to access paid consulting services.`,
  },
  {
    slug: 'alternative-social-media-report',
    title: 'Alternative Social Media Platforms for Social Justice Organizations',
    url: 'https://www.theengineroom.org/library/new-report-exploring-a-transition-to-alternative-social-media-platforms-for-social-justice-organizations-in-the-majority-world/',
    category: 'library',
    tags: ['social media', 'mastodon', 'bluesky', 'report', 'research', 'global south'],
    content: `Alternative Social Media Platforms for Social Justice Organizations (November 2024)

The Engine Room released a comprehensive report examining how social justice organizations in the Global South might transition to alternative social media platforms. The research, conducted from July 2023 to October 2024 with Open Society Foundation support, explores pathways beyond mainstream platforms like Meta, X, and TikTok.

Key Findings:

Current Platform Use:
Organizations continue leveraging mainstream social media because these platforms offer broad reach, particularly in lower-connectivity areas. However, users navigate significant concerns about ad-based models, surveillance, and inadequate content moderation.

Alternative Platforms' Promise:
Platforms such as Mastodon and BlueSky create less extractive community-led experiences where users can establish and manage their own digital spaces. This enables marginalized communities to establish safer online environments.

Critical Challenges:
- High technical barriers prevent non-technical communities from adopting alternatives
- Self-hosting infrastructure (like Mastodon instances) demands dedicated technical expertise and funding
- Alternative platforms replicate mainstream platforms' content moderation failures
- Limited user bases create isolated "bubbles"

Recommended Direction:
Rather than promoting single replacements, the researchers advocate embracing a "pluriverse"—enabling organizations to move fluidly between mainstream platforms for broad reach, smaller community alternatives, and low-tech solutions tailored to specific needs.

The full report and executive summary are available in English and Spanish at theengineroom.org.`,
  },
  {
    slug: 'information-ecosystems-report',
    title: 'Working Towards Healthier Information Ecosystems',
    url: 'https://www.theengineroom.org/library/new-report-working-towards-healthier-information-ecosystems-collective-visions-from-civil-society-in-latin-america-and-the-caribbean/',
    category: 'library',
    tags: ['information ecosystems', 'latin america', 'caribbean', 'civil society', 'report'],
    content: `Working Towards Healthier Information Ecosystems (August 2024)

A report capturing collective visions from civil society in Latin America and the Caribbean for creating healthier information ecosystems.

This research examines how civil society organizations in the LAC region envision and work towards information environments that better serve democratic participation and social justice goals.

Key themes include:
- Combating misinformation and disinformation
- Supporting independent media and journalism
- Building digital literacy in communities
- Creating inclusive information spaces
- Addressing platform accountability
- Fostering community-led information initiatives

The report synthesizes perspectives from diverse civil society actors across the region, offering insights into both challenges and opportunities for improving information ecosystems.

Author: Barbara Paes
Published: August 2024`,
  },
  {
    slug: 'digital-resilience-hub',
    title: 'Digital Resilience Hub',
    url: 'https://www.theengineroom.org/library/elevating-digital-inclusivity/',
    category: 'library',
    tags: ['digital resilience', 'inclusivity', 'hub', 'resources'],
    content: `Elevating Digital Inclusivity: The Digital Resilience Hub (July 2024)

The Engine Room launched the Digital Resilience Hub to provide accessible resources and support for organizations building their digital resilience.

The hub offers:
- Practical guides and toolkits
- Best practices for digital security
- Resources for organizational technology planning
- Community connections and peer learning opportunities

The initiative focuses on elevating digital inclusivity by making resources accessible to under-resourced organizations and movements working on social justice issues.

Author: Cathy Richards
Published: July 2024`,
  },
  {
    slug: 'digital-rights-climate-justice',
    title: 'At the Confluence of Digital Rights & Climate Justice',
    url: 'https://www.theengineroom.org/library/new-report-at-the-confluence-of-digital-rights-climate-justice/',
    category: 'library',
    tags: ['digital rights', 'climate justice', 'environmental', 'report', 'research'],
    content: `At the Confluence of Digital Rights & Climate Justice (July 2022)

A report examining the intersections between digital rights and environmental/climate justice movements.

Key areas explored:
- How digital technologies impact environmental activism
- The environmental footprint of digital infrastructure
- Digital tools for climate justice organizing
- Data rights in environmental monitoring
- Technology's role in both enabling and hindering climate action
- Privacy considerations for environmental defenders

The report highlights opportunities for collaboration between digital rights and climate justice movements, as well as tensions that need to be addressed.

Author: Becky Kazansky
Published: July 2022`,
  },
  {
    slug: 'responsible-data',
    title: 'Responsible Data Policy',
    url: 'https://www.theengineroom.org/responsible-data-policy/',
    category: 'about',
    tags: ['responsible data', 'policy', 'data ethics', 'privacy'],
    content: `The Engine Room's Responsible Data Policy

The Engine Room is committed to responsible data practices in all their work. Their approach to data prioritizes:

- Informed consent from all participants
- Minimizing data collection to what's necessary
- Secure storage and handling of sensitive information
- Transparency about how data is used
- Respect for privacy and confidentiality
- Ethical considerations in data analysis and sharing

The organization has been a leader in developing responsible data frameworks for the civil society sector, helping other organizations adopt ethical data practices.`,
  },
  {
    slug: 'deep-dive-week',
    title: 'Deep Dive Week',
    url: 'https://www.theengineroom.org/library/ddw-zine/',
    category: 'news',
    tags: ['deep dive week', 'event', 'community', 'learning'],
    content: `Deep Dive Week Zine (October 2024)

Reflections and creative outputs from The Engine Room's inaugural Deep Dive Week initiative.

Deep Dive Week is a focused learning and collaboration event bringing together civil society practitioners to explore technology and data topics in depth. The initiative creates space for:

- Intensive learning on specific topics
- Peer-to-peer knowledge sharing
- Creative exploration of challenges
- Building community connections
- Developing practical skills

The zine captures participant reflections, insights, and creative outputs from the experience.

Author: Ledys Sanjuan Mejía
Published: October 2024`,
  },
];

// Helper to get all Engine Room content
export function getAllEngineRoomContent(): EngineRoomPage[] {
  return engineRoomContent;
}

// Helper to get content by category
export function getEngineRoomContentByCategory(category: EngineRoomPage['category']): EngineRoomPage[] {
  return engineRoomContent.filter(page => page.category === category);
}

// Helper to search Engine Room content
export function searchEngineRoomContent(query: string): EngineRoomPage[] {
  const queryLower = query.toLowerCase();
  return engineRoomContent.filter(page =>
    page.title.toLowerCase().includes(queryLower) ||
    page.content.toLowerCase().includes(queryLower) ||
    page.tags.some(tag => tag.toLowerCase().includes(queryLower))
  );
}
