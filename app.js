// 1. Baza danych z przepisami (tutaj dopisujesz kolejne)
const przepisy = [
    {
        id: 1,
        kategoria: "Placki i naleśniki",
        tytul: "Puszyste amerykańskie pancakes",
        skladniki: ["1 szklanka mąki", "1 szklanka mleka", "1 jajko", "2 łyżki roztopionego masła", "1 łyżeczka proszku do pieczenia"],
        opis: "Wymieszaj składniki na gładką masę. Smaż na suchej, rozgrzanej patelni po ok. 2 minuty z każdej strony, aż pojawią się bąbelki. Podawaj z syropem klonowym i kostką masła."
    },
    {
        id: 2,
        kategoria: "Placki i naleśniki",
        tytul: "Placki z jabłkami",
        skladniki: ["2 jabłka", "1 jajko", "150 g jogurtu naturalnego", "1 szklanka mąki", "szczypta cynamonu"],
        opis: "Jabłka zetrzyj na tarce o grubych oczkach, połącz z resztą składników i smaż na złoty kolor."
    },
    {
        id: 3,
        kategoria: "Sałatki",
        tytul: "Sałatka grecka",
        skladniki: ["2 pomidory", "1 ogórek zielony", "ser feta", "garść czarnych oliwek", "oliwa i oregano"],
        opis: "Pokrój warzywa i fetę w grubą kostkę, dorzuć oliwki, polej oliwą i posyp oregano."
    },
    {
        id: 4,
        kategoria: "Desery",
        tytul: "Szybki mus czekoladowy",
        skladniki: ["100 g gorzkiej czekolady", "200 ml śmietanki 30%"],
        opis: "Rozpuść czekoladę w kąpieli wodnej, ostudź, a następnie delikatnie połącz z ubitą śmietanką."
    }
];

const kategorie = ["Placki i naleśniki", "Sałatki", "Desery", "Obiady"];

// 2. Historia nawigacji (zaczynamy od ekranu głównego)
let historia = [{ typ: "home" }];

const kontener = document.getElementById("app-content");
const wyszukiwarka = document.getElementById("search-input");

// Funkcja rysująca aktualny ekran na podstawie ostatniego elementu w historii
function renderuj() {
    const aktualny = historia[historia.length - 1];
    kontener.innerHTML = "";

    // WIDOK 1: Ekran główny (kategorie)
    if (aktualny.typ === "home") {
        kategorie.forEach(kat => {
            const kafelek = document.createElement("div");
            kafelek.className = "card";
            kafelek.textContent = kat;
            kafelek.onclick = () => {
                historia.push({ typ: "kategoria", nazwa: kat });
                renderuj();
            };
            kontener.appendChild(kafelek);
        });
    }

    // WIDOK 2: Lista przepisów z wybranej kategorii
    else if (aktualny.typ === "kategoria") {
        const pasujace = przepisy.filter(p => p.kategoria === aktualny.nazwa);
        pasujace.forEach(przepis => {
            const kafelek = document.createElement("div");
            kafelek.className = "card";
            kafelek.textContent = przepis.tytul;
            kafelek.onclick = () => {
                historia.push({ typ: "przepis", id: przepis.id });
                renderuj();
            };
            kontener.appendChild(kafelek);
        });
    }

    // WIDOK 3: Konkretny przepis
    else if (aktualny.typ === "przepis") {
        const p = przepisy.find(item => item.id === aktualny.id);
        kontener.innerHTML = `
            <div class="recipe-box">
                <h1>${p.tytul}</h1>
                <h2>Składniki:</h2>
                <ul>${p.skladniki.map(s => `<li>${s}</li>`).join("")}</ul>
                <h2>Przygotowanie:</h2>
                <p>${p.opis}</p>
            </div>
        `;
    }
}

// 3. Obsługa przycisków Home i Cofnij
document.getElementById("btn-home").onclick = () => {
    wyszukiwarka.value = "";
    historia = [{ typ: "home" }];
    renderuj();
};

document.getElementById("btn-back").onclick = () => {
    if (historia.length > 1) {
        historia.pop(); // Usuwa ostatni krok i wraca o jeden poziom wyżej
        renderuj();
    }
};

// 4. Obsługa wyszukiwarki na żywo
wyszukiwarka.addEventListener("input", (e) => {
    const fraza = e.target.value.toLowerCase().trim();
    if (!fraza) {
        renderuj();
        return;
    }

    kontener.innerHTML = "";
    const wyniki = przepisy.filter(p =>
        p.tytul.toLowerCase().includes(fraza) ||
        p.skladniki.some(s => s.toLowerCase().includes(fraza))
    );

    wyniki.forEach(przepis => {
        const kafelek = document.createElement("div");
        kafelek.className = "card";
        kafelek.textContent = przepis.tytul;
        kafelek.onclick = () => {
            wyszukiwarka.value = "";
            historia.push({ typ: "przepis", id: przepis.id });
            renderuj();
        };
        kontener.appendChild(kafelek);
    });
});

// Start aplikacji
renderuj();