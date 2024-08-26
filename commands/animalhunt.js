export class Command {
  settings = {
    name: "animalhunt",
    description: "You went hunting and caught an animal!",
    noPrefix: true,
    author: "Karina & Liane Cagara",
  };

  async main({ send, liaMongo, event }) {
    const animals = {
      lion: "🦁",
      tiger: "🐅",
      bear: "🐻",
      elephant: "🐘",
      giraffe: "🦒",
      fish: "🐟",
      zebra: "🦓",
      kangaroo: "🦘",
      panda: "🐼",
      monkey: "🐒",
      wolf: "🐺",
      fox: "🦊",
      eagle: "🦅",
      owl: "🦉",
      rabbit: "🐰",
      deer: "🦌",
      horse: "🐴",
      hippopotamus: "🦛",
      rhino: "🦏",
      cheetah: "🐆",
      liane: "🎀", // WTF!?
      penguin: "🐧",
      parrot: "🦜",
      seal: "🦭",
      dolphin: "🐬",
      shark: "🦈",
      octopus: "🐙",
      crab: "🦀",
      whale: "🐋",
      jellyfish: " medusa",
      walrus: "🦭",
      platypus: "🦦",
    };
    // 50% chance of catching anything, fair asf
    if (Math.random() > 0.5) {
      return send(
        `You went hunting but didn't find any animals this time. Better luck next time!`,
      );
    }
    // WARN: a userData could be null if the user doesn't exist, make sure to add fallback like an empty object
    const userData = (await liaMongo.get(event.senderID)) ?? {};
    const price = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;

    const animalNames = Object.keys(animals);
    const randomIndex = Math.floor(Math.random() * animalNames.length);
    const caughtAnimal = animalNames[randomIndex];
    const animalEmoji = animals[caughtAnimal];

    send(
      `You went hunting and caught a ${animalEmoji} ${caughtAnimal}!\n\nYou received ${price} coins.`,
    );
    // the money might be non existent, to use ??= to assign default to 0.
    userData.money ??= 0;
    userData.money += price;

    // WARN: make sure to put the entire userData or otherwise you fucked up and your user will loose their progress.
    await liaMongo.put(event.senderID, userData);
  }
}
