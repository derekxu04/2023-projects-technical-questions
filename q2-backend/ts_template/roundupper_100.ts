import express from "express";

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
  | { type: "space_cowboy"; metadata: spaceCowboy; location: location }
  | { type: "space_animal"; metadata: spaceAnimal; location: location };

// spaceAnimalInfo models the attributes of a spaceAnimal
type spaceAnimalInfo = {
  type: "pig" | "cow" | "flying_burger";
  location: location;
};

// === ADD YOUR CODE BELOW :D ===

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post("/entity", (req, res) => {
  const entities = req.body.entities;

  if (entities === undefined) {
    res.status(400).json();
    return;
  }

  for (const entity of entities) {
    spaceDatabase.push(entity);
  }

  res.status(200).json(spaceDatabase);
});

// isLassoable checks whether an animal is 'lassoable' by a cowboy
// i.e. whether the animal's distance from the cowboy is less than or equal to the length of the cowboy's lasso
function isLassoable(cowboy: spaceEntity, animal: spaceEntity): Boolean {
  if (cowboy.type !== "space_cowboy") {
    return false;
  }

  const squaredDist =
    Math.pow(cowboy.location.x - animal.location.x, 2) +
    Math.pow(cowboy.location.y - animal.location.y, 2);

  return squaredDist <= Math.pow(cowboy.metadata.lassoLength, 2);
}

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get("/lassoable", (req, res) => {
  const cowboy_name = req.body.cowboy_name;

  if (!cowboy_name) {
    res.status(400).json();
    return;
  }

  // Find specified cowboy in spaceDatabase
  let cowboy: undefined | spaceEntity;
  for (const entity of spaceDatabase) {
    if (
      entity.type === "space_cowboy" &&
      entity.metadata.name === cowboy_name
    ) {
      cowboy = entity;
    }
  }

  if (!cowboy) {
    res.status(404).json({ message: "Cowboy not found" });
    return;
  }

  // Parse spaceDatabase for all animals that are 'lassoable' and add to lassoableAnimals
  const lassoableAnimals: spaceAnimalInfo[] = [];

  for (const entity of spaceDatabase) {
    if (entity.type == "space_animal") {
      if (isLassoable(cowboy, entity)) {
        const lassoableAnimal: spaceAnimalInfo = {
          type: entity.metadata.type,
          location: entity.location,
        };
        lassoableAnimals.push(lassoableAnimal);
      }
    }
  }

  res.status(200).json({ space_animals: lassoableAnimals });
});

app.listen(8080);
