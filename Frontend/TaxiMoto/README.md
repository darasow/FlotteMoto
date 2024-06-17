## Pour executer le projet Angular:
  - Installez les dependances (npm i)
## Techno design
  - TaillwindCss

## Logique de traitement :
   Formulaire de contrat :
    - Par defaut le champs montant_initial est desactiver tanque le type du contrat n'es pas 

    Lors de la modification d'un contrat quand on change le type en credit automatiquement le montant_initial qui y etai pass a null

    Quand on annule ou on termine un contrat automatiquement le chauffeur et la moto lie a se contrat devients libre pour etre affecter a un autre contrat si besoin

## Logique panne et entretien:
   - On entretien ou  on s'occupe des pannes seulement des moto qui sont en contrat d'embauche

## Logique des recettes :
   J'ai oublier de mettre le montant a payer un montant fixe, pour le moment il est saisisable mais je vais modifier pour que si la recette

## Logique des utilisateurs:
   - J'ai mis en place les permissions seul les admins peuvent deleter les objets
   - Les manager peuvent creer un chauffeur
   - chauffeurs voient leurs recettes(s'ils sont en contrat credit), les pannes en entretiens de leurs moto (s'ils sont en contrat d'embauche)

   




