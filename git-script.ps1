# Récupérer le nom de commit dynamique en argument
$commit_message = $args[0]

# Vérifier si un argument a été fourni
if (-not $commit_message) {
    Write-Host "Usage: ./git-script.ps1 'message de commit'"
    exit 1
}

# Exécuter les commandes Git
git add .
git commit -m "$commit_message"
git push -u origin main
