import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github";

export async function createBranch(github: any, context: Context, branch: string) {
  const toolkit : GitHub = new github(githubToken());
    let branchExists;
    // Sometimes branch might come in with refs/heads already
    branch = branch.replace('refs/heads/', '');
    
    // throws HttpError if branch already exists.
    try {
      console.log(branch);
      await toolkit.repos.getBranch({
        ...context.repo,
        branch
      })

      branchExists = true;
    } catch(error) {
      console.log('----error----');
      console.log(error);
      if(error.name === 'HttpError' && error.status === 404) {
        await toolkit.git.createRef({
          ref: `refs/heads/${branch}`,
          sha: context.sha,
          ...context.repo
        })
      } else {
        throw Error(error)
      }
    }
}

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token)
    throw ReferenceError('No token defined in the environment variables');
  return token;
}
