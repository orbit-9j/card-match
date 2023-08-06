import "./style.css";
import React, { useState, useEffect } from "react";

const Card = ({ number, colour, id, selectedCards, setSelectedCards }) => {
  const [isSelected, setIsSelected] = useState(false);

  const cardClassName = `card ${colour} ${isSelected ? "selected" : ""}`;

  useEffect(() => {
    /* adds or removes card in selected cards array depending on card status. for some reason, the console log is always one click out of sync with what the user selected or deselected */
    if (isSelected) {
      setSelectedCards((prevSelectedCards) => [
        ...prevSelectedCards,
        [number, colour, id],
      ]);
    } else {
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((card) => card[2] !== id)
      );
    }
    console.log("selected cards");
    console.log(selectedCards);
  }, [isSelected, id, setSelectedCards]);

  const handleClick = (event) => {
    event.stopPropagation();
    setIsSelected(!isSelected);
  };

  return (
    <div className={cardClassName} onClick={handleClick}>
      {number === "joker" ? <p>&#x26A1;</p> : <p>{number}</p>}{" "}
      {/* // x2728
      sparkles, x2B50 star, x1F400 rat, x1F47D alien, x1F480 skull, x1F525 fire,
      x1F52E crystal ball, x1F577 spider, x1F577 spider web, x1F6F8 UFO */}
    </div>
  );
};

/* helper function that compares card IDs to check if a card in one array is the same as a card in another array */
const isCardInArray = (card, array) => {
  return array.some((c) => c[2] === card[2]);
};

function App() {
  var colours = ["purple", "orange", "green", "white"];
  var numbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];

  //generate number cards. using the generator function avoids out of memory error
  function* generateCards() {
    let key = 0;
    for (let i = 0; i < colours.length; i++) {
      for (let k = 0; k < 2; k++) {
        for (let j = 0; j < numbers.length; j++) {
          yield [numbers[j], colours[i], key];
          key++;
        }
      }
    }
  }

  var cards = [...generateCards()];

  //generate joker cards separately
  for (let i = 0; i < 2; i++) {
    cards.push(["joker", "none"]);
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  //randomise all cards
  const [shuffledCards, setShuffledCards] = useState(shuffleArray(cards));

  var numbers = [];
  var colours = [];

  const [hand, setHand] = useState(
    //select the first 13 cards in the shuffled array, simulating random selection of 13 cards from the pool, then sort them in ascending order to make it easier to identify possible groups
    shuffledCards.slice(0, 13).sort((a, b) => a[0] - b[0])
  );

  const [selectedCards, setSelectedCards] = useState([]);
  const [colourGroup, setColourGroup] = useState([]);

  useEffect(() => {
    console.log("colourGroup");
    console.log(colourGroup);
  }, [colourGroup]);

  const handleAddGroup = () => {
    // take the cards from the selected array and add them to the colour group array, then remove them from the hand

    selectedCards.forEach((selectedCard) => {
      if (!isCardInArray(selectedCard, colourGroup)) {
        setColourGroup((prevColourGroup) => [...prevColourGroup, selectedCard]);
      }
    });

    const updatedHand = hand.filter(
      (card) => !isCardInArray(card, selectedCards)
    );
    setHand(updatedHand);

    setSelectedCards([]); //clear the selected cards array
  };

  var exampleSameNumber3 = [
    ["6", "green", 1],
    ["6", "orange", 2],
    ["6", "purple", 3],
  ];

  var exampleSameNumber4 = [
    ["6", "green", 1],
    ["6", "orange", 2],
    ["6", "purple", 3],
    ["6", "white", 89],
  ];
  var badExampleSameNumber4 = [
    ["6", "green", 156],
    ["6", "orange", 2235],
    ["6", "purple", 31234],
    ["6", "orange", 54],
  ];

  var exampleSameColourJoker = [
    ["4", "green", 4],
    ["5", "green", 5],
    ["6", "green", 6],
    ["joker", "none", 111],
    ["8", "green", 8],
  ];
  var exampleSameColour = [
    ["4", "green", 4],
    ["5", "green", 5],
    ["6", "green", 6],
    ["7", "green", 7],
  ];

  var exampleSameColourBad1 = [
    ["4", "green", 4],
    ["5", "green", 5],
    ["5", "green", 55],
    ["6", "green", 6],
  ];

  var exampleSameColourBad2 = [
    ["4", "green", 4],
    ["5", "green", 5],
    ["7", "green", 7],
  ];

  var jokerSameColour = [
    ["4", "green", 4],
    ["5", "green", 5],
    ["joker", "none", 6375],
    ["7", "green", 7],
  ];

  var jokerSameNumber = [
    ["6", "orange", 2],
    ["6", "purple", 8326],
    ["joker", "none", 6375],
  ];

  return (
    <div className="App">
      <header className="header container">
        <h1 className="title">&#x1F47D; Card Match &#x1F47D;</h1>
        <h2>A single-player card game inspired by Rummikub </h2>
      </header>
      <section className="game container">
        <div className="warning"></div>
        <div class="game-grid">
          {/* //--------------------------------------NUMBER GROUP------------------------------------- */}
          <div className="number-group">
            <h2>Same number groups</h2>
            <div className="card-container">
              {exampleSameNumber3.map((card) => (
                <Card
                  key={card[2]}
                  number={card[0]}
                  colour={card[1]}
                  id={card[2]}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              ))}
            </div>
            <button>Add group</button>

            {/* //--------------------------------------COLOUR GROUP------------------------------------- */}
          </div>
          <div className="colour-group">
            <h2>Same colour groups</h2>
            <div>
              <div className="card-container">
                {/* temp cards for visuals: */}
                {exampleSameColourJoker.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
              <div className="card-container">
                {colourGroup.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
            </div>

            <button onClick={handleAddGroup}>Add group</button>
          </div>
          {/* //--------------------------------------HAND------------------------------------- */}
          <div className="hand">
            <h2>Hand</h2>
            <div className="card-container">
              {hand.map((card) => (
                <Card
                  key={card[2]}
                  number={card[0]}
                  colour={card[1]}
                  id={card[2]}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              ))}
              <button>Draw card</button>
            </div>
          </div>
        </div>
      </section>
      {/* //--------------------------------------RULES------------------------------------- */}
      <section className="rules container">
        <h2>Rules</h2>

        <h3>Game contents</h3>
        <div className="card-section">
          <div className="rule-card">
            <p>There are 106 cards in total: 104 number cards and 2 jokers.</p>
          </div>
          <div className="rule-card">
            <p>The number cards are numbered 1-13.</p>
          </div>
          <div className="rule-card">
            <p>
              There are 4 colours of numbered cards:{" "}
              <span className="green">green</span>,{" "}
              <span className="orange">orange</span>,{" "}
              <span className="purple">purple</span>, and{" "}
              <span className="white">white</span>.
            </p>
          </div>
        </div>

        <h3>Interactivity</h3>
        <div className="card-section">
          <div className="rule-card">
            <p>You can select the cards by clicking on them with the mouse.</p>
          </div>
          <div className="rule-card">
            <p>
              You can add the selected card to a group by selecting the group
              with the mouse.
            </p>
          </div>
          <div className="rule-card">
            <p>
              You can create a new group from selected cards by clicking on the
              "add group" button.
            </p>
          </div>
        </div>

        <h3>Game start</h3>
        <div className="card-section">
          <p className="rule-card">
            Begin by making a group of at least 3 cards.
          </p>
          <div className="rule-card">
            <p>If you can't play a card, draw one from the deck.</p>
          </div>
        </div>

        <h4>Same number groups</h4>
        <div className="rule-card-container">
          <div className="rule-card illustrated">
            <p>Group of 3-4 different coloured cards of the same number.</p>
            <div className="card-container">
              {exampleSameNumber3.map((card) => (
                <Card
                  key={card[2]}
                  number={card[0]}
                  colour={card[1]}
                  id={card[2]}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              ))}
            </div>
            <p className="or">OR</p>
            <div className="card-container">
              {exampleSameNumber4.map((card) => (
                <Card
                  key={card[2]}
                  number={card[0]}
                  colour={card[1]}
                  id={card[2]}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              ))}
            </div>
          </div>
          <div className="rule-card illustrated">
            <p>Same number groups cannot have repeating colours.</p>
            <div className="card-container-group">
              <div className="card-container bad">
                {badExampleSameNumber4.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
              <div className="card-container good">
                {exampleSameNumber4.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <h4>Same colour groups</h4>
        <div className="rule-card-container">
          <div className="rule-card illustrated">
            <p>Group of 3+ cards of contiguous numbers of the same colour.</p>
            <div className="card-container">
              {exampleSameColour.map((card) => (
                <Card
                  key={card[2]}
                  number={card[0]}
                  colour={card[1]}
                  id={card[2]}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                />
              ))}
            </div>
          </div>
          <div className="rule-card illustrated">
            <p>
              Same colour groups cannot contain duplicate numbers or skip
              numbers in the sequence.
            </p>
            <div className="card-container-group">
              <div className="card-container bad">
                {exampleSameColourBad1.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
              <div className="card-container bad">
                {exampleSameColourBad2.map((card) => (
                  <Card
                    key={card[2]}
                    number={card[0]}
                    colour={card[1]}
                    id={card[2]}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <h4>Jokers</h4>
        <div className="rule-card illustrated">
          <p>
            There are 2 jokers in the game. They can be used to replace a card
            of any number and colour. You can move them around the board freely,
            as long as adding/removing the joker results in valid groups.
          </p>
          <div className="card-container">
            {jokerSameColour.map((card) => (
              <Card
                key={card[2]}
                number={card[0]}
                colour={card[1]}
                id={card[2]}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            ))}
          </div>
          <p className="or">OR</p>
          <div className="card-container">
            {jokerSameNumber.map((card) => (
              <Card
                key={card[2]}
                number={card[0]}
                colour={card[1]}
                id={card[2]}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            ))}
          </div>
        </div>

        <h3>Game progression</h3>
        <div className="card-section">
          <div className="rule-card">
            <p>
              Add to the groups with the cards from your hand, one or several
              cards at a time.
            </p>
          </div>
          <div className="rule-card">
            <p>You can create new groups of cards.</p>
          </div>
          <div className="rule-card">
            <p>
              You can move cards between the groups, as long as the new group is
              valid.
            </p>
          </div>

          <div className="rule-card">
            <p>
              You can split up groups, as long as the resulting groups are
              valid.
            </p>
          </div>
        </div>

        <h3>Game end</h3>
        <div className="card-section">
          <div className="rule-card">
            <p>The game ends when you run out of cards in your hand.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
