# 📝 Todo List

Une application web pour organiser ses tâches au quotidien.

## ✨ Fonctionnalités

- Créer une tâche avec un titre, une description, une date limite et une priorité.
- Consulter les détails, modifier ou supprimer une tâche.
- Marquer une tâche comme terminée ou à faire.
- Filtrer les tâches par statut et rechercher dans leur titre ou leur description.
- Retrouver ses tâches après un rechargement grâce au stockage local du navigateur.
- Utiliser l'application sur mobile ou sur ordinateur.

Les tâches sont enregistrées dans le navigateur utilisé : elles ne sont pas synchronisées entre appareils ou navigateurs. Quatre tâches d'exemple sont affichées au premier lancement.

## 🚀 Lancer le projet

Clone le dépôt, puis ouvre le fichier `index .html` dans ton navigateur. Attention : son nom contient un espace avant `.html`.

Les icônes Lucide sont chargées depuis un CDN : une connexion Internet est nécessaire pour les afficher.

## 🛠️ Technologies

- HTML, CSS et JavaScript
- [Tailwind CSS](https://tailwindcss.com/) pour les styles
- [Lucide](https://lucide.dev/) pour les icônes
- `localStorage` pour la sauvegarde des tâches

## 🎨 Modifier les styles

Pour régénérer le CSS après avoir modifié les classes ou `css/style.css`, installe les dépendances avec `npm install`, puis lance :

```bash
npx @tailwindcss/cli -i ./css/style.css -o ./css/output.css
```

## 🚧 Statut

Le projet est fonctionnel et reste en cours d'amélioration.
