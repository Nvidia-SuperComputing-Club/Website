import { teamService } from '../../../../services/supabaseService.js';

const MOCK_TEAM = [
  {
    name: "Daksh Pratap Singh",
    role: "Club President / NVIDIA Ambassador",
    bio: "Student engineer specializing in CUDA-based high-performance computing, GPU memory design, and parallel architectures. Focuses on research in accelerating sparse matrix operations.",
    github_url: "https://github.com/daxforge",
    linkedin_url: "https://linkedin.com/in/daksh-pratap",
    is_active: true
  },
  {
    name: "Alwin Mathew",
    role: "Vice President & Lead 3D Developer",
    bio: "Creative technologist and frontend engineer. Deep interest in WebGL, Three.js, shaders, and creating immersive 3D user experiences on the web.",
    github_url: "https://github.com/alwin2134",
    linkedin_url: "https://linkedin.com/in/alwin-mathew",
    is_active: true
  },
  {
    name: "Preet Biswas",
    role: "Backend & Systems Infrastructure Lead",
    bio: "Systems programmer and backend engineer. Focuses on RESTful and GraphQL API services, Postgres database optimization, Docker deployment, and cloud pipelines.",
    github_url: "https://github.com/preetbiswas12",
    linkedin_url: "https://linkedin.com/in/preet-biswas",
    is_active: true
  }
];

export default async function teamHandler(args = []) {
  let members = [];
  try {
    const data = await teamService.getTeamMembers();
    members = data.filter(m => m.is_active !== false);
  } catch (err) {
    // Only fallback if the database actually crashes/errors, not if it's just empty
    members = MOCK_TEAM;
  }

  if (args.length > 0) {
    const query = args.join(' ').toLowerCase();
    const match = members.find(m => m.name.toLowerCase().includes(query) || m.role.toLowerCase().includes(query));

    if (!match) {
      return `Member matching "${args.join(' ')}" not found in active records.`;
    }

    let profile = `MEMBER PROFILE: ${match.name}\n`;
    profile += `--------------------------------------------------------------------------------\n`;
    profile += `Role:        ${match.role}\n`;
    if (match.department)   profile += `Department:  ${match.department}\n`;
    if (match.year)         profile += `Year:        ${match.year}\n`;
    if (match.github_url)   profile += `GitHub:      ${match.github_url}\n`;
    if (match.linkedin_url) profile += `LinkedIn:    ${match.linkedin_url}\n`;
    if (match.twitter_url)  profile += `Twitter/X:   ${match.twitter_url}\n`;
    if (match.email)        profile += `Email:       ${match.email}\n`;
    profile += `--------------------------------------------------------------------------------\n\n`;
    profile += `Bio:\n${match.bio || 'No bio listed.'}\n`;
    return profile;
  }

  let output = `NVIDIA-SC TEAM MEMBERS:\n`;
  output += `--------------------------------------------------------------------------------\n`;
  output += `${'NAME'.padEnd(28)} ${'ROLE'}\n`;
  output += `--------------------------------------------------------------------------------\n`;

  if (members.length === 0) {
    output += `No active team members found in the database.\n`;
  } else {
    members.forEach(m => {
      output += `${m.name.padEnd(28)} ${m.role}\n`;
    });
  }

  output += `--------------------------------------------------------------------------------\n`;
  output += `Tip: Use "team <name>" to inspect bio & social details (e.g., team daksh).`;

  return output;
}
