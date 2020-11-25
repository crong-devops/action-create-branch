import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github";

export async function createBranch(github: any, repo: string, sha: string, branch: string) {
  const toolkit : GitHub = new github(githubToken());
    let branchExists;
    // Sometimes branch might come in with refs/heads already
    branch = branch.replace('refs/heads/', '');
    
    // throws HttpError if branch already exists.
    try {
      console.log(branch);
      await toolkit.repos.getBranch({
        owner: 'actions',
        repo: repo,
        branch: branch
      })

      branchExists = true;
    } catch(error) {
      console.log('----error----');
      console.log(error);
      if(error.name == 'HttpError' && error.status == 404) {
        console.log('여기까지 온것인가?(1)');
        try {
          await toolkit.git.createRef({
            owner: 'actions',
            ref: `refs/heads/${branch}`,
            sha: sha,
            repo: repo
          });
        } catch (error) {
          console.log('Throw error2');
          console.log(error);
          throw Error(error);
        }
        console.log('여기까지 온것인가?(2)');
      } else {
        console.log('Throw error');
        console.log(error);
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
