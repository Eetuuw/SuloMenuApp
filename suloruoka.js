const synth = window.speechSynthesis;

let menuArr = [];

const getMenu = async () => {
  const result = await fetch(
    "https://europe-west1-luncher-7cf76.cloudfunctions.net/api/v1/widget/e335b121-5b1f-4110-81ef-aeba6adab4ed/J2DgUZ2pcgM1O74GnUb0"
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  const weekData = result.data.week.days;

  let lunches = await Promise.all(
    weekData.map((d) => {
      const newLunchesArr = d.lunches.map((l) => {
        return {
          lunchName: l.title.fi,
          price: l.normalPrice.price,
        };
      });

      return {
        day: d.dayName.fi,
        lunches: newLunchesArr,
      };
    })
  );

  lunches = lunches.filter(
    (l) => l.day !== "Sunnuntai" && l.day !== "Lauantai"
  );

  menuArr = lunches;
};

getMenu();

const silence = () => {
  synth.cancel();
};

const pause = () => {
  synth.pause();
};

const playDay = (idx) => {
  console.clear();
  pause();
  silence();
  const day = menuArr[idx];

  day.lunches.map((l) => {
    console.log("Ruoka: " + l.lunchName + "\nHinta: " + l.price + " euroa\n");

    let foodText = l.lunchName + " hinta " + l.price + " euroa";

    const speakableText = new SpeechSynthesisUtterance(foodText);
    synth.speak(speakableText);
  });
};
