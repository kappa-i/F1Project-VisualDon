# F1Project-VisualDon# F1 — Sécurité & Performance : Une Histoire en Parallèle

> Projet de visualisation de données — Cours VisualDon, HEIG-VD

---

## Description

Ce projet est un **scrollytelling interactif** qui explore l'évolution conjointe de la **sécurité** et de la **performance** en Formule 1, depuis les débuts du championnat du monde en 1950 jusqu'à nos jours.

À travers une narration guidée par le scroll, le visiteur traverse les grandes époques de la F1 : une époque pionnière marquée par des accidents mortels à répétition, puis une prise de conscience progressive ayant mené aux réformes réglementaires, jusqu'aux monoplaces ultra-sécurisées et ultra-rapides d'aujourd'hui.

Le projet soulève une tension centrale : **peut-on aller plus vite tout en étant plus en sécurité ?** Les données suggèrent que oui — et c'est cette histoire que nous racontons.

---

## Objectifs

- Montrer comment les **temps au tour et les vitesses maximales** ont évolué au fil des décennies
- Mettre en regard ces gains de performance avec les **statistiques d'accidents et de décès**
- Contextualiser les données avec les **grands tournants réglementaires** (introduction du halo, zones déformables, circuits redessinés…)
- Offrir une expérience narrative fluide et accessible à un public non-spécialiste

---

## Structure du projet

**A compléter**
```

```

---

## Technologies

- **D3.js ou GSAP** — visualisations interactives
- **HTML / CSS / JavaScript** — structure et style

---

## Données & Sources

| Source | Contenu | Lien |
|--------|---------|------|
| Ergast API | API historique F1 (résultats, classements, circuits) — données depuis 1950 | [ergast.com/api/f1](https://ergast.com/api/f1) |
| Jolpica F1 API | Miroir maintenu de l'API Ergast, plus stable et actif | [api.jolpi.ca](https://api.jolpi.ca) / [GitHub](https://github.com/jolpica/jolpica-f1) |
| OpenF1 | API temps réel et historique (télémétrie, intervalles, météo) | [openf1.org](https://openf1.org) / [GitHub](https://github.com/br-g/openf1) |
| FastF1 | Librairie Python pour accéder aux données télémétriques officielles F1 | [docs.fastf1.dev](https://docs.fastf1.dev) / [GitHub](https://github.com/theOehrly/Fast-F1) |
| f1dataR | Package R pour l'analyse de données F1 via FastF1 | [scasanova.github.io/f1dataR](https://scasanova.github.io/f1dataR/) |
| Tracing Insights | Données F1 structurées en accès direct | [tracinginsights.com/data](https://tracinginsights.com/data) |
| F1 API JSON (Kathe) | Collection JSON de données F1 par saison | [GitHub](https://github.com/yashkathe/F1-API-JSON) |
| Formula 1 Race Data | Datasets F1 communautaires | [Kaggle](https://www.kaggle.com/datasets?search=formula+1) |
| Sportmonks Formula One API | API commerciale complète (résultats, stats, standings) | [sportmonks.com](https://www.sportmonks.com/formula-one-api/) |
| Sportradar Formula 1 API | API professionnelle avec statuts de course en temps réel | [developer.sportradar.com](https://developer.sportradar.com/sportradar-updates/changelog/formula-1-api-stage-statuses) |
| F1 Unofficial API (Postman) | Documentation d'une API non officielle F1 | [Postman Docs](https://documenter.getpostman.com/view/11586746/SztEa7bL) |


---

## Inspirations

### Inspirations visuelles & interactives

- **[Aston Martin F1 — Interactive 3D Scroll](https://dribbble.com/shots/25945471-Aston-Martin-F1-Interactive-3D-Scroll)** *(Dribbble)* — concept d'interface F1 avec scroll 3D immersif, référence pour l'esthétique racing et les transitions entre sections
- **[CarAddict.ch](https://caraddict.ch/a-propos/)** — site suisse de lifestyle automobile avec une identité visuelle sombre et des accents orange, proche de l'univers F1 que nous voulons retranscrire
- **[VIITA Race](https://race.viita-watches.com/)** — microsite primé sur Awwwards utilisant le scroll horizontal et GSAP pour immerger l'utilisateur dans l'univers de la course ; inspiration directe pour la gestion du scroll et l'animation
- **[Gen Z Broke the Marketing Funnel](https://genzbrokethefunnel.com)** — scrollytelling longform alliant typographie éditoriale, collages animés et moments WebGL ; modèle de référence pour la narration par le scroll et la hiérarchie visuelle

### Inspirations thématiques

- **[Bidwells — Driving Innovation at Speed](https://www.bidwells.co.uk/insights-reports-events/driving-innovation-at-speed/)** — rapport sur le cluster motorsport britannique, illustrant comment l'industrie F1 génère de l'innovation technologique à travers la contrainte de performance et de sécurité

---

## Équipe

- Tanguy Vaucher
- Gabriel Cappai
- Nuno Guilherme Amaro Faria 

---

## Licence

Les données utilisées sont issues de sources publiques. Le code source de ce projet est disponible sous licence MIT.
