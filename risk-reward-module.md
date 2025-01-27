# Ajouter des entrées

1) Etape 1 : ajouter un wish

- [ ] Symbol
- [ ] Buy Price
- [ ] Stop Loss
- [ ] Quantity (laisser l'algorithme calculer cela)

2) Une fois le wish crée,
   2.a ajouter un ordre d'achat dans Disnat, puis associer l'ordre au wish. Sinon envoyer des rappel sous forme de
   notification
   2.b Ecouter le prix en direct de la valeur, si le prix dépasse le Buy Price, envoyer une notification pour prévenir
   que l'ordre d'achat devrait avoir été exécuter et demander le prix d'achat ajusté (mutation). Demander également si
   le stoploss à bel et bien été placé.
3) Ecouter ensuite le prix en direct de la valeur, afin d'anticiper les scenarios de vente.
   3.a) hit du stop loss : envoyer une notification pour prévenir que le stop loss a été touché et demander le prix de
   vente ajusté (mutation)
   3.b) hit du first take profit : envoyer une notification pour prévenir que le first take profit a été touché (n fois
   le risk) et demander de vendre une certaine quantité d'action à un certain prix. Demander également à l'utilisateur
   d'ajuster le stop loss au prix d'achat) Attendre la validation de l'utilisateur pour vendre.
   3.c) hit du second take profit : envoyer une notification pour prévenir que le second take profit a été touché (2n
   fois le risk) et demander de vendre une certaine quantité d'action à un certain prix. Demander également à
   l'utilisateur d'ajuster le stop loss pour faire un trailing stop loss) Attendre la validation de l'utilisateur pour
   vendre.