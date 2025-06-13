// Get version information from git
export async function getVersionInfo() {
  try {
    // Get the latest commit hash
    const commitHash = await fetch('/.git/HEAD')
      .then(res => res.text())
      .then(text => {
        if (text.startsWith('ref:')) {
          const ref = text.split(':')[1].trim();
          return fetch(`/.git/${ref}`).then(res => res.text());
        }
        return text.trim();
      })
      .catch(() => null);

    // Get the latest commit message
    const commitMessage = await fetch(`/.git/objects/${commitHash?.slice(0, 2)}/${commitHash?.slice(2)}`)
      .then(res => res.text())
      .then(text => {
        const message = text.split('\n\n')[1];
        return message ? message.split('\n')[0] : null;
      })
      .catch(() => null);

    // Get all commit messages to determine version
    const commits = await getAllCommits();
    const version = calculateVersion(commits);

    return {
      hash: commitHash ? commitHash.slice(0, 7) : null,
      message: commitMessage,
      version: version
    };
  } catch (error) {
    console.error('Error getting version info:', error);
    return { hash: null, message: null, version: '0.0.0' };
  }
}

async function getAllCommits() {
  try {
    const commits = [];
    let currentHash = await fetch('/.git/HEAD')
      .then(res => res.text())
      .then(text => {
        if (text.startsWith('ref:')) {
          const ref = text.split(':')[1].trim();
          return fetch(`/.git/${ref}`).then(res => res.text());
        }
        return text.trim();
      });

    while (currentHash) {
      const commit = await fetch(`/.git/objects/${currentHash.slice(0, 2)}/${currentHash.slice(2)}`)
        .then(res => res.text())
        .then(text => {
          const [header, message] = text.split('\n\n');
          const parentHash = header.split('\n').find(line => line.startsWith('parent'))?.split(' ')[1];
          return { hash: currentHash, message: message?.split('\n')[0], parentHash };
        });

      commits.push(commit);
      currentHash = commit.parentHash;
    }

    return commits;
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
}

function calculateVersion(commits) {
  let major = 0;
  let minor = 0;
  let patch = 0;

  for (const commit of commits) {
    const message = commit.message?.toLowerCase() || '';
    
    if (message.includes('[major]') || message.includes('breaking change')) {
      major++;
      minor = 0;
      patch = 0;
    } else if (message.includes('[minor]') || message.startsWith('feat:')) {
      minor++;
      patch = 0;
    } else if (message.includes('[patch]') || message.startsWith('fix:')) {
      patch++;
    }
  }

  return `${major}.${minor}.${patch}`;
} 