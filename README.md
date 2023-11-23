
# Calcul DJU

Ce projet répond à un besoin d'un ami ingénieur dans une entreprise de chauffage.
Dans le cadre de son travail il avait besoin de connaitre le DJU (Degré Jour Unifié) d'une commune sur les 10 dernières années et de la comparer à celle de l'année en cours.

Pour ce faire il devait chercher avec les coordonnées GPS la station météo la plus proche sur une liste de plus de 70 stations en France, récupérer à la main les données météos sur 10 ans et faire les calculs.

L'idée était d'automatiser ce processus.

Ce projet a deux versions, selon les compétences techniques du moment.




## Préparation des données

Tout d'abord une liste de toute les communes de France a été récupérée avec leur coordonnées GPS, de même avec les stations météos en France.

J'ai ensuite calculé les distances avec les stations pour trouver la plus proche et l'ajouter à la liste des communes.

Les données météos ont été récupéré à la main sur le site https://public.opendatasoft.com/ pusqu'il ne disposait pas à ce moment d'une API gratuite qui me permettait de récupérer ces données.

Ces données ont été stocké dans un format CSV, un par stations



## Version 1

Cette version n'utilise que **JavaScript**, **HTML** et **CSS**.

Le script JavaScript est séparé en 2 partie, le fichier calculs effectuant tous les calculs et le fichier script gérant l'affichage utilisateur.

Dans l'interface, l'utilisateur rentre tout d'abord un code postal. Une fonction cherche toutes les communes qui ont ce code postal, les affiche et également les différentes stations.
Sur un même code postal 2 stations peuvent être présentes.

L'utilisateur choisi ensuite une station et un seuil de référence pour le calcul du DJU.

Les données du fichier CSV correspondant à la station sont extraites et les calculs sont fait et les résultats affichés.

Dans la construction du code j'ai essayé au maximum de séparer les calculs en différentes fonctions qui étaient appelées dans d'autres pour permettre un debuggage plus facile et être réutilisées plusieurs fois.

La gestion de l'interface a aussi été au maximum décorrelée de ces calculs, dans la même optique de lisibilité et de maintenabilité.

## Version 2

Cette version implémante l'utilisation de **TypeScript** comme entrainement et introduction à ce langage, **Python** pour transformer les données et les ajouter dans une base de donnée **Supabase**. **NodeJS** et **Express** pour créer un back-end qui extrait les données de la base de donnée et **React** pour la partie front-end et gérer un affichage dynamique.

Elle m'a permis de comprendre, avec le recul entre la première version et la seconde, l'intéret de ces technologies et qu'elles permettent un code bien plus efficace et plus lisible.
## Ressource

[Calcul de DJU](https://opera-energie.com/dju/)

