echo deploying all functions in $1
firebase deploy --project "$1" --only functions:firstFunction