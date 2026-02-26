import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

actor {
  include MixinStorage();

  type Question = {
    text : Text;
    options : [Text];
    correctOption : Nat;
    category : Text;
  };

  type GameSession = {
    playerName : Text;
    currentQuestionIndex : Nat;
    score : Nat;
    isFinished : Bool;
  };

  let sessions = Map.empty<Text, GameSession>();
  let highScores = List.empty<(Text, Nat)>();

  module Score {
    public func compareByScore(a : (Text, Nat), b : (Text, Nat)) : Order.Order {
      Nat.compare(b.1, a.1);
    };
  };

  let questions : [Question] = [
    {
      text = "What is the chemical symbol for water?";
      options = ["H2O", "CO2", "O2", "NaCl"];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "Who was the first President of the United States?";
      options = [
        "George Washington",
        "Abraham Lincoln",
        "Thomas Jefferson",
        "John Adams",
      ];
      correctOption = 0;
      category = "History";
    },
    {
      text = "What year did the Titanic sink?";
      options = ["1912", "1920", "1898", "1905"];
      correctOption = 0;
      category = "History";
    },
    {
      text = "Which planet is known as the Red Planet?";
      options = ["Mars", "Venus", "Jupiter", "Saturn"];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "Who painted the Mona Lisa?";
      options = [
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Michelangelo",
      ];
      correctOption = 0;
      category = "Entertainment";
    },
    {
      text = "What is the largest ocean on Earth?";
      options = [
        "Pacific",
        "Atlantic",
        "Indian",
        "Arctic",
      ];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "Who wrote 'Romeo and Juliet'?";
      options = [
        "William Shakespeare",
        "Charles Dickens",
        "Jane Austen",
        "Mark Twain",
      ];
      correctOption = 0;
      category = "Entertainment";
    },
    {
      text = "What year did World War II end?";
      options = ["1945", "1939", "1918", "1950"];
      correctOption = 0;
      category = "History";
    },
    {
      text = "What is the capital of France?";
      options = ["Paris", "London", "Rome", "Berlin"];
      correctOption = 0;
      category = "Geography";
    },
    {
      text = "Which sport uses a shuttlecock?";
      options = [
        "Badminton",
        "Tennis",
        "Squash",
        "Table Tennis",
      ];
      correctOption = 0;
      category = "Sports";
    },
    {
      text = "Who discovered penicillin?";
      options = [
        "Alexander Fleming",
        "Isaac Newton",
        "Marie Curie",
        "Louis Pasteur",
      ];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "What is the hardest natural substance?";
      options = [
        "Diamond",
        "Gold",
        "Iron",
        "Quartz",
      ];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "Which artist is known for the song 'Thriller'?";
      options = [
        "Michael Jackson",
        "Elvis Presley",
        "Madonna",
        "Prince",
      ];
      correctOption = 0;
      category = "Entertainment";
    },
    {
      text = "What is the capital of Japan?";
      options = ["Tokyo", "Beijing", "Seoul", "Bangkok"];
      correctOption = 0;
      category = "Geography";
    },
    {
      text = "Which country won the 2018 FIFA World Cup?";
      options = ["France", "Brazil", "Germany", "Spain"];
      correctOption = 0;
      category = "Sports";
    },
    {
      text = "Who wrote 'To Kill a Mockingbird'?";
      options = [
        "Harper Lee",
        "J.K. Rowling",
        "Ernest Hemingway",
        "F. Scott Fitzgerald",
      ];
      correctOption = 0;
      category = "Entertainment";
    },
    {
      text = "What is the tallest mountain in the world?";
      options = [
        "Mount Everest",
        "K2",
        "Kangchenjunga",
        "Lhotse",
      ];
      correctOption = 0;
      category = "Geography";
    },
    {
      text = "Who was the ancient Greek god of the sea?";
      options = [
        "Poseidon",
        "Zeus",
        "Ares",
        "Apollo",
      ];
      correctOption = 0;
      category = "History";
    },
    {
      text = "What is the main ingredient in guacamole?";
      options = [
        "Avocado",
        "Tomato",
        "Lettuce",
        "Pepper",
      ];
      correctOption = 0;
      category = "Science";
    },
    {
      text = "Which planet has the most moons?";
      options = ["Jupiter", "Mars", "Earth", "Venus"];
      correctOption = 0;
      category = "Science";
    },
  ];

  public query ({ caller }) func checkUsernameAvailable(username : Text) : async Bool {
    not sessions.containsKey(username);
  };

  public shared ({ caller }) func startNewGame(playerName : Text) : async () {
    if (sessions.containsKey(playerName)) {
      Runtime.trap("Username already exists. Please choose a different one.");
    };
    let newSession = {
      playerName;
      currentQuestionIndex = 0;
      score = 0;
      isFinished = false;
    };
    sessions.add(playerName, newSession);
  };

  public query ({ caller }) func getQuestion(playerName : Text) : async Question {
    switch (sessions.get(playerName)) {
      case (null) { Runtime.trap("Player not found") };
      case (?session) {
        if (session.currentQuestionIndex >= questions.size()) {
          Runtime.trap("No more questions");
        };
        questions[session.currentQuestionIndex];
      };
    };
  };

  public shared ({ caller }) func answerQuestion(playerName : Text, answerIndex : Nat) : async Bool {
    switch (sessions.get(playerName)) {
      case (null) { Runtime.trap("Player not found") };
      case (?session) {
        if (session.isFinished) {
          Runtime.trap("Game has already ended");
        };
        let currentQuestion = questions[session.currentQuestionIndex];
        let isCorrect = answerIndex == currentQuestion.correctOption;
        let newScore = if (isCorrect) { session.score + 1 } else {
          session.score;
        };
        let newQuestionIndex = session.currentQuestionIndex + 1;
        let isGameFinished = newQuestionIndex >= questions.size();

        let updatedSession = {
          playerName = session.playerName;
          currentQuestionIndex = newQuestionIndex;
          score = newScore;
          isFinished = isGameFinished;
        };

        sessions.add(playerName, updatedSession);

        if (isGameFinished) {
          addHighScore(playerName, newScore);
        };

        isCorrect;
      };
    };
  };

  func addHighScore(playerName : Text, score : Nat) {
    highScores.add((playerName, score));

    // Convert to array and sort
    let highScoresArray = highScores.toArray().sort(Score.compareByScore);

    // Check if size > 10 (keep only top 10)
    let trimmedScores = if (highScoresArray.size() > 10) {
      highScoresArray.sliceToArray(0, 10);
    } else {
      highScoresArray;
    };

    // Clear and repopulate highScores list with sorted array
    highScores.clear();
    for (score in trimmedScores.values()) {
      highScores.add(score);
    };
  };

  public query ({ caller }) func getHighScores() : async [(Text, Nat)] {
    highScores.toArray();
  };

  public query ({ caller }) func getCategories() : async [Text] {
    let categoriesSet = Map.empty<Text, ()>();

    for (question in questions.values()) {
      categoriesSet.add(question.category, ());
    };
    categoriesSet.keys().toArray();
  };

  public query ({ caller }) func getPlayerScore(playerName : Text) : async Nat {
    switch (sessions.get(playerName)) {
      case (null) { Runtime.trap("Player not found") };
      case (?session) { session.score };
    };
  };

  public query ({ caller }) func isGameFinished(playerName : Text) : async Bool {
    switch (sessions.get(playerName)) {
      case (null) { Runtime.trap("Player not found") };
      case (?session) { session.isFinished };
    };
  };
};
