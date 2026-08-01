// Virtual filesystem navigation definitions

const VIRTUAL_FS = {
  '~': {
    dirs: ['about', 'events', 'team', 'projects'],
    files: {
      'README.md': `NVIDIA Super Computing Club — Virtual Terminal
===================================================
Welcome! This is an interactive CLI portal.
Explore our folders or run command macros:
  - Type "ls" to list files and folders.
  - Type "cd <folder>" to enter a directory.
  - Type "cat <file>" to read files.
  - Type "events" or "team" to load dynamic database statistics.

Explore with passion.`
    }
  },
  '~/about': {
    dirs: [],
    files: {
      'mission.txt': `MISSION:
To democratize parallel GPU architecture skills and deep learning pipelines.
We provide active engineering workloads for Galgotias University students
using official NVIDIA Deep Learning Institute courseware.`,
      'founded.txt': `FOUNDED:
September 2025 at Galgotias University, Greater Noida.
Affiliated with the School of Computer Science & Engineering.`
    }
  },
  '~/events': {
    dirs: [],
    files: {
      'calendar.txt': `Run the "events" command at the prompt to see dynamically loaded club events.`,
      'sprints.txt': `AI SPRINTS:
24-hour GPU coding sprint to train, quantize, and optimize 70B+ LLMs.
Hardware: NVIDIA DGX H200 Node.
Location: Galgotias University Campus.`
    }
  },
  '~/team': {
    dirs: [],
    files: {
      'leads.txt': `CLUB ADMINISTRATIVE LEADS:
- Daksh Pratap Singh (Club President / NVIDIA Ambassador)
- Alwin Mathew (Vice President / 3D Design Lead)
- Preet Biswas (Systems Infrastructure / Backend Lead)`,
      'structure.txt': `FACULTY & ADVISORS:
Supervised by Galgotias University SCSE Faculty mentors and NVIDIA academic program managers.`
    }
  },
  '~/projects': {
    dirs: [],
    files: {
      'dgx_cluster.txt': `DGX CLUSTER:
An on-campus GPU lab cluster supporting multi-node training partitions.
Configured with Slurm scheduling and Docker orchestration.`,
      'cuda_libs.txt': `STUDENT RESEARCH PROJECTS:
1. cuSparseLU: CUDA-based sparse matrices solver
2. WebR3F-DGX: Three.js web canvas hardware visualizer (accessible on this landing page!)`
    }
  }
};

export function lsHandler(currentDir) {
  const fsNode = VIRTUAL_FS[currentDir] || VIRTUAL_FS['~'];
  
  const folders = fsNode.dirs.map(d => `${d}/`);
  const files = Object.keys(fsNode.files);
  const items = [...folders, ...files];
  
  if (items.length === 0) {
    return '(empty directory)';
  }
  
  // Format folders in NVIDIA green in terminal if possible, but raw string formatting is fine
  return items.join('    ');
}

export function cdHandler(args = [], currentDir) {
  const target = args[0] || '~';
  
  if (target === '~' || target === '/' || target === '') {
    return { output: '', newDir: '~' };
  }
  
  if (target === '..') {
    if (currentDir === '~') {
      return { output: '', newDir: '~' }; // already at root
    }
    // Subdirectories are just 1-level deep in our FS: '~/about' -> '~'
    return { output: '', newDir: '~' };
  }
  
  // Checking current directory context
  if (currentDir === '~') {
    const fsNode = VIRTUAL_FS['~'];
    if (fsNode.dirs.includes(target)) {
      return { output: '', newDir: `~/${target}` };
    }
    
    // Check if user tried to cd into a file
    if (fsNode.files[target]) {
      return { output: `cd: ${target}: Not a directory`, newDir: currentDir };
    }
  } else {
    // Already in a subdirectory. Cannot cd into sub-sub directories.
    if (target === '.') {
      return { output: '', newDir: currentDir };
    }
  }
  
  return { output: `cd: ${target}: No such file or directory`, newDir: currentDir };
}

export function catHandler(args = [], currentDir) {
  if (args.length === 0) {
    return 'cat: Missing filename.';
  }
  
  const filename = args[0];
  const fsNode = VIRTUAL_FS[currentDir] || VIRTUAL_FS['~'];
  
  // Check in current folder files
  if (fsNode.files[filename]) {
    return fsNode.files[filename];
  }
  
  // Check if filename was specified with relative path from root, like `cat about/mission.txt`
  if (currentDir === '~') {
    const parts = filename.split('/');
    if (parts.length === 2) {
      const subFolder = `~/${parts[0]}`;
      const subFile = parts[1];
      if (VIRTUAL_FS[subFolder] && VIRTUAL_FS[subFolder].files[subFile]) {
        return VIRTUAL_FS[subFolder].files[subFile];
      }
    }
  }
  
  // Check if target is a folder
  if (fsNode.dirs.includes(filename) || (currentDir === '~' && filename.endsWith('/'))) {
    const rawDir = filename.replace('/', '');
    if (VIRTUAL_FS[`~/${rawDir}`]) {
      return `cat: ${filename}: Is a directory`;
    }
  }
  
  return `cat: ${filename}: No such file or directory`;
}

export function pwdHandler(currentDir) {
  if (currentDir === '~') {
    return '/home/nvidia-sc';
  }
  // Convert '~/about' -> '/home/nvidia-sc/about'
  return `/home/nvidia-sc/${currentDir.replace('~/', '')}`;
}
