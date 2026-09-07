#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/commit-and-push.sh -m "Commit message" [--yes] [--remote origin] [--branch main] [path ...]

Examples:
  scripts/commit-and-push.sh -m "Update document downloads"
  scripts/commit-and-push.sh -m "Update homepage" index.html styles.css
  scripts/commit-and-push.sh -m "Publish current branch" --branch "$(git branch --show-current)" --yes

What this script does:
  1. Shows the current branch and working tree status.
  2. Stages all current changes when no paths are provided.
  3. Stages only the provided paths when paths are provided.
  4. Shows the staged file list and summary.
  5. Runs a whitespace/conflict-marker check on the staged diff.
  6. Commits with the message passed by -m.
  7. Pushes to the selected remote and branch.
  8. Verifies the remote branch points at the new commit.

It is not date-bound. It does not reset, delete, or clean untracked files.
Review the staged summary before confirming, especially when running without paths.
USAGE
}

commit_message=""
remote="origin"
branch=""
assume_yes="false"
paths=()

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    -m|--message)
      if [[ "$#" -lt 2 ]]; then
        echo "Missing value for $1." >&2
        usage >&2
        exit 2
      fi
      commit_message="$2"
      shift 2
      ;;
    --remote)
      if [[ "$#" -lt 2 ]]; then
        echo "Missing value for --remote." >&2
        usage >&2
        exit 2
      fi
      remote="$2"
      shift 2
      ;;
    --branch)
      if [[ "$#" -lt 2 ]]; then
        echo "Missing value for --branch." >&2
        usage >&2
        exit 2
      fi
      branch="$2"
      shift 2
      ;;
    -y|--yes)
      assume_yes="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      paths+=("$@")
      break
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      paths+=("$1")
      shift
      ;;
  esac
done

if [[ -z "$commit_message" ]]; then
  echo "Missing commit message." >&2
  usage >&2
  exit 2
fi

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if [[ -z "$branch" ]]; then
  branch="$(git branch --show-current)"
fi

if [[ -z "$branch" ]]; then
  echo "Could not determine the current branch. Pass --branch explicitly." >&2
  exit 1
fi

if ! git remote get-url "$remote" >/dev/null 2>&1; then
  echo "Unknown remote: $remote" >&2
  exit 1
fi

echo "Repository: $repo_root"
echo "Branch:     $branch"
echo "Remote:     $remote ($(git remote get-url "$remote"))"
echo
echo "Working tree before staging:"
git status --short --branch
echo

if [[ "${#paths[@]}" -eq 0 ]]; then
  echo "Staging all current tracked, untracked, and deleted files."
  git add -A
else
  echo "Staging selected paths:"
  printf '  %s\n' "${paths[@]}"
  git add -- "${paths[@]}"
fi

if git diff --cached --quiet; then
  echo "No staged changes to commit."
  exit 0
fi

echo
echo "Staged files:"
git diff --cached --name-status
echo
echo "Staged summary:"
git diff --cached --stat
echo

git diff --cached --check

if [[ "$assume_yes" != "true" ]]; then
  read -r -p "Commit and push these staged changes? [y/N] " answer
  case "$answer" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Aborted. The changes remain staged; adjust with git restore --staged if needed."
      exit 1
      ;;
  esac
fi

git commit -m "$commit_message"
head_sha="$(git rev-parse HEAD)"

echo
echo "Pushing $head_sha to $remote/$branch..."
if ! git push "$remote" "HEAD:$branch"; then
  echo
  echo "Standard push failed. Retrying with HTTP/1.1 and a larger post buffer..."
  git -c http.version=HTTP/1.1 -c http.postBuffer=157286400 push "$remote" "HEAD:$branch"
fi

remote_sha="$(git ls-remote "$remote" "refs/heads/$branch" | awk '{print $1}')"

echo
echo "Summary:"
echo "  Commit:       $head_sha"
echo "  Remote branch: $remote/$branch"
echo "  Remote SHA:   ${remote_sha:-unknown}"

if [[ "$remote_sha" == "$head_sha" ]]; then
  echo "  Result:       push verified"
else
  echo "  Result:       push completed, but remote verification did not match" >&2
  exit 1
fi
