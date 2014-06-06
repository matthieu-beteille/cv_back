
* * *
# Serveur InfoEvent Sails JS
* * *

> Note
> Aprés avoir récupéré le code, ne pas oublier de lancer la commande npm install à la racine du dossier, afin d'installer toutes les dépendances.

##  1. Généralités
***

Dossier contenant le code pour la partie serveur de l'application InfoEvent

Ce serveur a pour objectif de fournir une API afin de permettre aux clients de manipuler les données selon les conventions d'une architecture RESTful.


##  2. SVN et tags pour faciliter le codage en équipe
***

### Utilisation du SVN

<!-- TODO: Détailler fonctionnement du SVN-->

### Tags utilisés

Pour l'utilisation des tags avec Sublime suivre les instructions suivantes :

Il faut avoir le gestionnaire de paquets sublime installé (package control)

1.  Ctrl + Maj + P , Puis Install Package
2.  Installer le Package TodoReview (https://github.com/jonathandelgado/SublimeTodoReview)
3.  Aller dans Preferences/Package Settings/TodoReview/Settings-Default
4.  Ajouter les patterns suivantes (si elles n'y sont pas déjà)
        "TODO": "TODO[\\s]*?:+(?P<todo>.*)$",
        "NOTE": "NOTE[\\s]*?:+(?P<note>.*)$",
        "FIXME": "FIX ?ME[\\s]*?:+(?P<fixme>\\S.*)$",
        "CHANGED": "CHANGED[\\s]*?:+(?P<changed>\\S.*)$"
5.  Ajouter les dossiers désirés aux dossiers à exclure de la recherche de tags idem pour les fichiers, ajouter les dossiers  et fichiers suivants dans notre cas : (pour projet angular et sails)

    "exclude_folders": [
        ".git",
        "node_modules",
        "libs",
        "bower_components",
        ".svn",
        "linker",
        "config"
    ],
    "exclude_files": ["404.js",
    "500.js",
    "403.js",
    "400.js",
    "Gruntfile.js"
    ]

6. Ajouter le raccourci clavier pour afficher les tags, dans Preferences/Key Bindings-User
    {
      "keys": ["ctrl+shift+t"],
      "command": "todo_review",
      "args": {"open_files": true}
    }

Pour utiliser les tags mettre dans un commentaire (peu importe le langage) l'un des tags suivants (sans oublier les deux points) :

* TODO:
* NOTE:
* FIXME:
* CHANGED:

Pour accéder aux tags soit utiliser le raccourci programmé Ctrl + Shift + t, soit utiliser la console sulbime Ctrl + Shift + P et TodoReview Project Files

##  3. Infos sur la styntaxe MD pour rédiger le readme
***

# h1
## h2
### h3

* item1
* item2
* item3

+ item1
+ item2
+ item3

1. item1
2. item2
3. item3

horizontal rules :

***
 ___

