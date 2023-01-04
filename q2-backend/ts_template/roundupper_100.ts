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


// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json())

// the POST /entity endpoint adds an entity to your global space database
app.post('/entity', (req, res) => {

    // TODO: confirm the request is of the right type
    // lassoSize not lassoLength
    for (const entity of req.body.entities) {
        const {lassoSize, ...otherProps} = entity.metadata;

        const {metadata, ...other} = entity;

        const newEntity = {metadata: {lassoLength: lassoSize, ...otherProps}, ...other};
        spaceDatabase.push(newEntity);
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
    
    // console.log(cowboy, animal)
    const squaredDist = Math.pow((cowboy.location.x - animal.location.x), 2) 
                        + Math.pow((cowboy.location.y - animal.location.y), 2);

    // TODO: change lassoSize to lassoLength
    if (squaredDist <= Math.pow((cowboy.metadata.lassoLength), 2)) {
        return true;
    } else {
        return false;
    }
}

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get('/lassoable', (req, res) => {
    const cowboy_name = req.body.cowboy_name;
    let cowboy;

    for (const entity of spaceDatabase) {
        if (entity.type === "space_cowboy" && entity.metadata.name === cowboy_name) {
            cowboy = entity; 
        }
    }

    if (!cowboy) {
        res.status(404).json({"message": "Cowboy not found"});
    } else {
        // This type is not exactly what is defined in the spec...
        const lassoableAnimals: spaceEntity[] = [];

        for (const entity of spaceDatabase) {
            if (isLassoable(cowboy, entity)) {
                lassoableAnimals.push(entity);
            }
        }

        res.status(200).json({cowboy, lassoableAnimals})
    }

})

app.listen(8080);