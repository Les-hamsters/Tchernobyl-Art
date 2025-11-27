// Constantes
const imageCount = 15;
const diamètre = 20
// On met le diamètre dans le css
document.documentElement.style.setProperty("--diametre", diamètre);

const cercle = document.getElementById("cercle")

// Double boucle pour créer un carré d'images sans les images (matrice)
for (let i = 0; i < diamètre; i++) {
    for (let j = 0; j < diamètre; j++) {
        // ajouter les images au carrée
        const div = document.createElement("div");
        div.style.width = `${1 / (diamètre + 5) * 100}vh`
        cercle.appendChild(div)
    }
}

const crect = cercle.getBoundingClientRect();
const cx = crect.left + crect.width / 2;
const cy = crect.top + crect.height / 2;

const minDim = Math.min(crect.width, crect.height);
const radius = (minDim / 2) - minDim / diamètre;
const radius2 = (minDim / 2) - minDim / diamètre * 0.09;

let counter = 1

const children = Array.from(cercle.children);
for (const child of children) {
    const rect = child.getBoundingClientRect();
    const childCx = rect.left + rect.width / 2;
    const childCy = rect.top + rect.height / 2;

    const dx = childCx - cx;
    const dy = childCy - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > radius) {
        if (dist < radius2) {
            child.classList.add("number")
            const text = document.createElement("span");
            text.innerText = counter++
            child.appendChild(text)

            const way = Math.abs(dy) > Math.abs(dx);
            const rotation = way ? dy > 0 ? 180 : 0 : dx > 0 ? 90 : 270;
            child.style.transform = `rotate(${rotation}deg)`

        } else {
            child.classList.add("hidden");
        }
    } else {
        // Math.random() génère un nombre aléatoire [0;1[ on le multiplie par 8 donc on a un nombre entre [0;8[ soit [0;7]
        // Math.floor() prend la partie entière inférieure (retire ce qu'il ya après la virgule)
        const imageNumber = Math.floor(Math.random() * imageCount);
        child.style.backgroundImage = `url(./photos/${imageNumber}-s.png)`;
        child.setAttribute("image-number", imageNumber)
        if (Math.random() < 0.5) {
            child.classList.add("right")
        } else {
            child.classList.add("left")
        }

        const el = document.createElement("image");
        el.style.backgroundImage = `url(./photos/${imageNumber}-c.png)`;

        child.addEventListener("click", (e) => {
            child.classList.toggle("zoomed")
        })

        child.appendChild(el)
    }
}

// la fonction qui gère notre réaction en chaine

/**
 * @param {HTMLElement} el 
 * @param {number} id 
 */
function reactionEnChaine(el, id) {
    el.classList.toggle("allumé")
    setTimeout(() => {
        el.classList.toggle("allumé")
    }, 3500)

    // on défini les carrées autour de celui coloré
    const droite = id => id + 1
    const gauche = id => id - 1
    const haut = id => (Math.floor(id / diamètre) - 1) * diamètre + id % diamètre
    const bas = id => (Math.floor(id / diamètre) + 1) * diamètre + id % diamètre

    const directions = [droite(id), gauche(id), haut(id), bas(id), droite(haut(id)), gauche(haut(id)), droite(bas(id)), gauche(bas(id))]

    setTimeout(() => {
        for (let i = 0; i <= Math.round(Math.random()); i++) {
            // on choisi un carré random a coloré a coté
            let autreImageId = directions[Math.floor(Math.random() * directions.length)]
            let autreImage = cercle.childNodes[autreImageId];
            const timeout = 10
            let i = 0;
            while (
                i < timeout &&
                (!autreImage ||
                    autreImage.classList.contains("allumé") ||
                    autreImage.classList.contains("hidden") ||
                    autreImage.classList.contains("number"))
            ) {
                autreImageId = directions[Math.floor(Math.random() * directions.length)]
                autreImage = cercle.childNodes[autreImageId];
                i++
            }

            if (i < timeout) {
                // on répéte le processe sur l'image qui vien d'étre coloré + on rajoute du délais
                reactionEnChaine(autreImage, autreImageId)
            }
        }
    }, 400)
}

let imgId = Math.floor(Math.random() * diamètre ** 2);
let el = cercle.childNodes[imgId];
while (el.classList.contains("hidden") || el.classList.contains("number")) {
    imgId = Math.floor(Math.random() * diamètre ** 2);
    el = cercle.childNodes[imgId];
}

reactionEnChaine(el, imgId)

