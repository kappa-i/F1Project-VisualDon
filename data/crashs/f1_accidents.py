"""
F1 Accidents par course - Scrapling
Scrape Wikipedia pour extraire les accidents/incidents par course F1
"""

from scrapling.fetchers import Fetcher
import json
import time

ACCIDENT_KEYWORDS = [
    "accident", "collision", "spun off", "spin", "crash",
    "impact", "damage", "wall", "barrier"
]


def get_cell_text(cell) -> str:
    """Extrait tout le texte d'une cellule."""
    return " ".join(t.strip() for t in cell.css("*::text").getall() if t.strip())


def get_season_races(year: int) -> list[dict]:
    """Récupère la liste des courses d'une saison F1 depuis Wikipedia."""
    url = f"https://en.wikipedia.org/wiki/{year}_Formula_One_World_Championship"
    print(f"\nRecuperation du calendrier {year}...")

    page = Fetcher.get(url, stealthy_headers=True)
    races = []
    seen_urls = set()

    for link in page.css("a"):
        href = link.attrib.get("href", "")
        text = link.css("::text").get() or ""
        if f"{year}" in href and "Grand_Prix" in href and "Grand Prix" in text:
            full_url = f"https://en.wikipedia.org{href}"
            if full_url not in seen_urls:
                seen_urls.add(full_url)
                races.append({"name": text.strip(), "url": full_url})

    print(f"  {len(races)} courses trouvees")
    return races


def get_race_incidents(race: dict) -> list[dict]:
    """Scrape une page de course et extrait les accidents/incidents."""
    try:
        page = Fetcher.get(race["url"], stealthy_headers=True)
    except Exception as e:
        print(f"    Erreur: {e}")
        return []

    incidents = []

    for table in page.css("table.wikitable"):
        headers = [get_cell_text(th).lower() for th in table.css("th")]

        # Table de résultats : contient "driver" et "time/retired" ou "laps"
        has_driver = any("driver" in h for h in headers)
        has_laps = any("laps" in h for h in headers)

        if not (has_driver and has_laps):
            continue

        for row in table.css("tr"):
            cells = row.css("td")
            if len(cells) < 5:
                continue

            # Structure : [num, driver, constructor, laps, time/retired, grid, points]
            reason = get_cell_text(cells[4]).lower()
            found = [kw for kw in ACCIDENT_KEYWORDS if kw in reason]

            if not found:
                continue

            incidents.append({
                "course": race["name"],
                "numero": get_cell_text(cells[0]),
                "pilote": get_cell_text(cells[1]),
                "ecurie": get_cell_text(cells[2]),
                "tours": get_cell_text(cells[3]),
                "raison": get_cell_text(cells[4]),
                "depart": get_cell_text(cells[5]) if len(cells) > 5 else "",
            })

    return incidents


def scrape_f1_accidents(year: int = 2024, max_races: int = None) -> list[dict]:
    """Scrape tous les accidents F1 d'une saison. Retourne un objet par Grand Prix."""
    print(f"\n{'='*60}")
    print(f"  F1 Incidents & Accidents - Saison {year}")
    print(f"{'='*60}")

    races = get_season_races(year)
    if not races:
        print("Aucune course trouvee.")
        return []

    if max_races:
        races = races[:max_races]

    grands_prix = []

    for i, race in enumerate(races, 1):
        print(f"[{i:02d}/{len(races)}] {race['name']:<40}", end=" ")
        incidents = get_race_incidents(race)

        # Un objet par Grand Prix avec tous les incidents dedans
        gp = {
            "annee": year,
            "course": race["name"],
            "url": race["url"],
            "nb_incidents": len(incidents),
            "incidents": [
                {
                    "numero": inc["numero"],
                    "pilote": inc["pilote"],
                    "ecurie": inc["ecurie"],
                    "tours": inc["tours"],
                    "raison": inc["raison"],
                    "depart": inc["depart"],
                }
                for inc in incidents
            ]
        }
        grands_prix.append(gp)
        print(f"-> {len(incidents)} incident(s)")
        time.sleep(1)

    return grands_prix


def display_summary(grands_prix: list[dict]):
    """Affiche un résumé des incidents."""
    total = sum(gp["nb_incidents"] for gp in grands_prix)
    print(f"\n{'='*60}")
    print(f"TOTAL: {total} incidents sur {len(grands_prix)} Grand(s) Prix")
    print(f"{'='*60}")

    for gp in grands_prix:
        if gp["nb_incidents"] == 0:
            continue
        print(f"\n  {gp['annee']} {gp['course']} ({gp['nb_incidents']} incident(s)):")
        for inc in gp["incidents"]:
            print(f"    #{inc['numero']:>2} {inc['pilote']:<22} [{inc['raison']}]  (tour {inc['tours']}, depart P{inc['depart']})")

    # Stats pilotes les plus accidentés
    from collections import Counter
    pilots = Counter(
        inc["pilote"]
        for gp in grands_prix
        for inc in gp["incidents"]
    )
    if pilots:
        print(f"\n{'='*60}")
        print("TOP PILOTES LES PLUS IMPLIQUES:")
        for pilot, count in pilots.most_common(10):
            print(f"  {count}x  {pilot}")


if __name__ == "__main__":
    START_YEAR = 1950
    END_YEAR = 2025

    all_time_gps = []

    for year in range(START_YEAR, END_YEAR + 1):
        try:
            grands_prix = scrape_f1_accidents(year=year)
            all_time_gps.extend(grands_prix)

            # Sauvegarde JSON par saison
            output_file = f"f1_accidents_{year}.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(grands_prix, f, ensure_ascii=False, indent=2)
            print(f"  Sauvegarde: {output_file}")

        except Exception as e:
            print(f"  ERREUR saison {year}: {e}")
            continue

        time.sleep(2)  # Pause entre chaque saison

    # Sauvegarde globale toutes saisons confondues
    with open("f1_accidents_1950_2025.json", "w", encoding="utf-8") as f:
        json.dump(all_time_gps, f, ensure_ascii=False, indent=2)

    display_summary(all_time_gps)
    print(f"\nFichier global sauvegarde : f1_accidents_1950_2025.json")
