$(document).ready(function () {
    // Remplacez "julienbouze" par votre nom d'utilisateur GitHub
    const username = "julienbouze";

    // URL de l'API GitHub pour obtenir la liste des dépôts de l'utilisateur
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    // Sélectionnez l'élément de liste où vous voulez afficher les projets
    const projectList = $("#projectList");

    // Configuration de l'en-tête d'authentification avec votre PAT
    

    // Effectuez une requête GET à l'aide de jQuery pour obtenir la liste des dépôts
    $.ajax({
        url: apiUrl,
        success: function (repositories) {
            repositories.forEach(repo => {
                // Exclure le dépôt "Home" (ou tout autre dépôt que vous souhaitez exclure)
                if (repo.name !== "Home") {
                    const repoItem = $("<li></li>");

                    // Ajoutez le titre (nom du repo) à l'élément de liste
                    repoItem.append($("<h3></h3>").text(repo.name));

                    // Vérifiez si le dépôt a une description
                    if (repo.description) {
                        const description = $("<p></p>").text(repo.description);
                        repoItem.append(description);
                    }

                    // Créez un lien vers le dépôt GitHub (nommé "Repo")
                    const repoLink = $("<a></a>").attr("href", repo.html_url).text("Repo");
                    repoLink.addClass("repo-button"); // Utilisez la classe de bouton grenat
                    repoItem.append(repoLink);

                    // Vérifiez si le dépôt a des pages GitHub
                    if (repo.has_pages) {
                        const pagesLink = $("<a class='web-link'></a>")
                            .attr("href", `https://${username}.github.io/${repo.name}`)
                            .text("Page");
                        pagesLink.addClass("page-button"); // Utilisez la classe de bouton bleu nuit
                        repoItem.append(pagesLink);
                    }

                    // Ajoutez l'élément de liste à la liste des projets
                    projectList.append(repoItem);
                }
            });
        },
        error: function (error) {
            console.error(`Impossible d'obtenir la liste des dépôts de ${username}: ${error.statusText}`);
        }
    });
});