import express from 'express';

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number, y: number };
type spaceCowboy = { name: string, lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
    | { type: "space_cowboy", metadata: spaceCowboy, location: location }
    | { type: "space_animal", metadata: spaceAnimal, location: location };


type spaceAnimalInfo = { 
    type: "pig" | "cow" | "flying_burger",
    location: location,
}


// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json())

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {
    const entities = req.body.entities;

    if (!entities) {
        res.status(404).json({ 'message': 'Entities not found' });
        return;
    }

    for (const entity of entities) {
        if (entity.type === "space_cowboy") {
            const newCowboy: spaceEntity = {
                type: "space_cowboy",
                metadata: {
                    name: entity.metadata.name,
                    lassoLength: entity.metadata.lassoSize,
                },
                location: {
                    x: entity.location.x,
                    y: entity.location.y,
                },
            };

            spaceDatabase.push(newCowboy);
        } else if (entity.type === "space_animal") {
            const newAnimal: spaceEntity = {
                type: "space_animal",
                metadata: {
                    type: entity.metadata.type,
                },
                location: {
                    x: entity.location.x,
                    y: entity.location.y,
                },
            };
            spaceDatabase.push(newAnimal);
        }
    }

    res.status(200).json(spaceDatabase);
});


function isLassoable(cowboy: spaceEntity, animal: spaceEntity): Boolean {
    if (cowboy.type !== "space_cowboy") {
        return false;
    }
    if (animal.type !== "space_animal") {
        return false;
    }
    
    const squaredDist = Math.pow((cowboy.location.x - animal.location.x), 2) 
                        + Math.pow((cowboy.location.y - animal.location.y), 2);

    if (squaredDist <= Math.pow((cowboy.metadata.lassoLength), 2)) {
        return true;
    } else {
        return false;
    }
}

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const cowboy_name: string = req.body.cowboy_name;

    if (!cowboy_name) {
        res.status(404).json({ 'message': 'Missing cowboy_name' });
        return;
    }

    let cowboy: spaceEntity | undefined = undefined;
    for (const entity of spaceDatabase) {
        if (entity.type === "space_cowboy" && entity.metadata.name === cowboy_name) {
            cowboy = entity; 
        }
    }

    if (!cowboy) {
        res.status(404).json({ 'message': 'Cowboy not found' });
        return;
    }

    // This type is not exactly what is defined in the spec...
    const lassoableAnimals: spaceAnimalInfo[] = [];

    for (const entity of spaceDatabase) {
        if (isLassoable(cowboy, entity)) {
            if (entity.type == "space_animal") {
                const lassoableAnimalInfo: spaceAnimalInfo = {
                    type: entity.metadata.type,
                    location: entity.location,
                }
                lassoableAnimals.push(lassoableAnimalInfo);
            }
        }
    }

    res.status(200).json({ space_animals: lassoableAnimals });
})

app.listen(8080);