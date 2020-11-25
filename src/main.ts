import * as core from '@actions/core';
import { GitHub, context} from '@actions/github'
import { createBranch } from './create-branch';

async function run() {
  try {
    const repo = core.getInput('repo');
    const sha = core.getInput('sha');
    const branch = core.getInput('branch');

    core.debug(`Creating branch ${branch}`);
    await createBranch(GitHub, repo, sha, branch);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
